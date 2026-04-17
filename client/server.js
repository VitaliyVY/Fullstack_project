/* eslint-env node */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.argv.includes("--prod");
const port = Number(process.env.PORT) || 4173;

const resolve = (target) => path.resolve(__dirname, target);
const app = express();

let vite;
const SITEMAP_PAGE_LIMIT = 100;
const SITEMAP_MAX_PAGES = 20;
const STATIC_SITEMAP_PATHS = [
  "/",
  "/posts",
  "/about",
  "/categories/general",
  "/categories/javascript-frontend",
  "/categories/backend-devops",
  "/categories/ai-ml",
  "/categories/cybersecurity",
  "/categories/tools-reviews",
];
const HTML_CACHE_TTL_MS = Number(process.env.HTML_CACHE_TTL_MS || 60_000);
const HTML_CACHE_MAX_ENTRIES = Number(process.env.HTML_CACHE_MAX_ENTRIES || 200);
const HTML_CACHE_CONTROL = "public, max-age=0, s-maxage=60, stale-while-revalidate=300";
const NO_STORE_CACHE_CONTROL = "no-store";
const htmlResponseCache = new Map();

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const serializeJsonForHtml = (value) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

const getRequestOrigin = (req) => {
  const forwardedProto = req.headers["x-forwarded-proto"]?.split(",")[0];
  const forwardedHost = req.headers["x-forwarded-host"]?.split(",")[0];
  const proto = forwardedProto || req.protocol || "http";
  const host = forwardedHost || req.get("host") || "localhost";
  return `${proto}://${host}`;
};

const normalizeOrigin = (origin) => String(origin || "").replace(/\/+$/, "");

const buildPreloadLinksHtml = (images) =>
  (Array.isArray(images) ? images : [])
    .filter(Boolean)
    .map(
      (href) =>
        `<link rel="preload" as="image" href="${escapeHtml(
          href,
        )}" fetchpriority="high" />`,
    )
    .join("");

const getHtmlCacheKey = (url) => url;

const isCacheablePath = (pathname) => {
  if (!pathname) return false;
  if (pathname === "/login" || pathname === "/register") return false;
  if (pathname.startsWith("/admin") || pathname.startsWith("/write")) return false;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return false;
  return true;
};

const canUseHtmlCache = (req, pathname) =>
  isProd &&
  req.method === "GET" &&
  !req.headers.cookie &&
  !req.headers.authorization &&
  isCacheablePath(pathname);

const getCachedHtmlResponse = (key) => {
  const cached = htmlResponseCache.get(key);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    htmlResponseCache.delete(key);
    return null;
  }

  return cached;
};

const setCachedHtmlResponse = (key, payload) => {
  if (htmlResponseCache.size >= HTML_CACHE_MAX_ENTRIES) {
    const oldestKey = htmlResponseCache.keys().next().value;
    if (oldestKey) htmlResponseCache.delete(oldestKey);
  }

  htmlResponseCache.set(key, {
    ...payload,
    expiresAt: Date.now() + HTML_CACHE_TTL_MS,
  });
};

const escapeXml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatSitemapDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const getCanonicalOrigin = (req) =>
  normalizeOrigin(process.env.SITE_URL || getRequestOrigin(req));

const buildStaticSitemapEntries = (origin) => {
  const lastmod = formatSitemapDate(new Date()) || "2026-04-17";

  return STATIC_SITEMAP_PATHS.map((path) => ({
    loc: `${origin}${path}`,
    lastmod,
  }));
};

const fetchPostsForSitemap = async (apiBaseUrl, origin) => {
  const normalizedApi = normalizeOrigin(apiBaseUrl);
  if (!normalizedApi) return [];

  const entries = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= SITEMAP_MAX_PAGES) {
    const endpoint = `${normalizedApi}/posts?page=${page}&limit=${SITEMAP_PAGE_LIMIT}&sort=newest`;
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Sitemap post fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    const posts = Array.isArray(payload?.posts) ? payload.posts : [];

    for (const post of posts) {
      if (!post?.slug) continue;

      entries.push({
        loc: `${origin}/articles/${encodeURIComponent(post.slug)}`,
        lastmod: formatSitemapDate(post.updatedAt || post.createdAt),
      });
    }

    hasMore = Boolean(payload?.hasMore) && posts.length > 0;
    page += 1;
  }

  return entries;
};

const mergeSitemapEntries = (entries) => {
  const byLoc = new Map();

  for (const entry of entries) {
    if (!entry?.loc) continue;

    const existing = byLoc.get(entry.loc);
    if (!existing) {
      byLoc.set(entry.loc, {
        loc: entry.loc,
        lastmod: entry.lastmod || "",
      });
      continue;
    }

    if (entry.lastmod && (!existing.lastmod || entry.lastmod > existing.lastmod)) {
      existing.lastmod = entry.lastmod;
    }
  }

  return Array.from(byLoc.values());
};

const buildSitemapXml = (entries) => {
  const items = entries
    .map(
      (entry) => `<url>
  <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `
  <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : ""}
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
};

app.get("/robots.txt", (req, res) => {
  const origin = getCanonicalOrigin(req);
  const body = `User-agent: *
Disallow: /admin/
Disallow: /write
Disallow: /login
Disallow: /register
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.status(200).end(body);
});

app.get("/sitemap.xml", async (req, res) => {
  const origin = getCanonicalOrigin(req);
  const staticEntries = buildStaticSitemapEntries(origin);

  try {
    const postEntries = await fetchPostsForSitemap(process.env.VITE_API_URL, origin);
    const sitemapEntries = mergeSitemapEntries([...staticEntries, ...postEntries]);
    const xml = buildSitemapXml(sitemapEntries);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).end(xml);
  } catch (error) {
    console.error("[sitemap]", error?.message || error);
    const xml = buildSitemapXml(staticEntries);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=120");
    res.status(200).end(xml);
  }
});

if (!isProd) {
  vite = await createViteServer({
    root: __dirname,
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);
} else {
  app.use(
    "/assets",
    express.static(resolve("dist/client/assets"), {
      immutable: true,
      maxAge: "1y",
      index: false,
    }),
  );

  app.use(
    express.static(resolve("dist/client"), {
      index: false,
    }),
  );
}

app.use("*", async (req, res) => {
  const origin = getRequestOrigin(req);
  const parsedUrl = new URL(req.originalUrl, origin);

  if (parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith("/")) {
    const normalizedPath = parsedUrl.pathname.replace(/\/+$/, "");
    const location = `${normalizedPath}${parsedUrl.search}`;
    res.redirect(301, location);
    return;
  }

  const url = `${parsedUrl.pathname}${parsedUrl.search}`;
  const cacheKey = getHtmlCacheKey(url);

  if (canUseHtmlCache(req, parsedUrl.pathname)) {
    const cached = getCachedHtmlResponse(cacheKey);
    if (cached) {
      res
        .status(cached.statusCode)
        .setHeader("Content-Type", "text/html")
        .setHeader("Cache-Control", cached.cacheControl)
        .setHeader("X-HTML-Cache", "HIT")
        .end(cached.html);
      return;
    }
  }

  try {
    let template;
    let render;

    if (!isProd) {
      template = await fs.readFile(resolve("index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render;
    } else {
      template = await fs.readFile(resolve("dist/client/index.html"), "utf-8");
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const { appHtml, queryState, metadata } = await render(url, { origin });
    const preloadLinksHtml = buildPreloadLinksHtml(metadata?.preloadImages);
    const structuredDataHtml = Array.isArray(metadata?.structuredData)
      ? metadata.structuredData
          .map(
            (item) =>
              `<script type="application/ld+json">${serializeJsonForHtml(item)}</script>`,
          )
          .join("")
      : "";

    const replacements = {
      "<!--ssr-title-->": escapeHtml(metadata?.title),
      "<!--ssr-description-->": escapeHtml(metadata?.description),
      "<!--ssr-robots-->": escapeHtml(metadata?.robots),
      "<!--ssr-canonical-->": escapeHtml(metadata?.canonical),
      "<!--ssr-og-type-->": escapeHtml(metadata?.ogType),
      "<!--ssr-og-title-->": escapeHtml(metadata?.ogTitle),
      "<!--ssr-og-description-->": escapeHtml(metadata?.ogDescription),
      "<!--ssr-og-image-->": escapeHtml(metadata?.ogImage),
      "<!--ssr-og-url-->": escapeHtml(metadata?.ogUrl),
      "<!--ssr-twitter-card-->": escapeHtml(metadata?.twitterCard),
      "<!--ssr-twitter-title-->": escapeHtml(metadata?.twitterTitle),
      "<!--ssr-twitter-description-->": escapeHtml(metadata?.twitterDescription),
      "<!--ssr-twitter-image-->": escapeHtml(metadata?.twitterImage),
      "<!--ssr-preload-links-->": preloadLinksHtml,
      "<!--ssr-structured-data-->": structuredDataHtml,
      "<!--ssr-outlet-->": appHtml,
      "<!--ssr-state-->": queryState,
    };

    const html = Object.entries(replacements).reduce(
      (current, [placeholder, value]) => current.split(placeholder).join(value),
      template,
    );

    const statusCode = Number.isInteger(metadata?.statusCode) ? metadata.statusCode : 200;
    const cacheControl = statusCode === 200 ? HTML_CACHE_CONTROL : NO_STORE_CACHE_CONTROL;

    res
      .status(statusCode)
      .setHeader("Content-Type", "text/html")
      .setHeader("Cache-Control", cacheControl)
      .setHeader("X-HTML-Cache", "MISS")
      .end(html);

    if (statusCode === 200 && canUseHtmlCache(req, parsedUrl.pathname)) {
      setCachedHtmlResponse(cacheKey, {
        html,
        statusCode,
        cacheControl,
      });
    }
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).end("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`SSR server running on http://localhost:${port}`);
});
