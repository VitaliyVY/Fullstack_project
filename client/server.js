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
  const url = req.originalUrl;
  const origin = getRequestOrigin(req);

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
      "<!--ssr-structured-data-->": structuredDataHtml,
      "<!--ssr-outlet-->": appHtml,
      "<!--ssr-state-->": queryState,
    };

    const html = Object.entries(replacements).reduce(
      (current, [placeholder, value]) => current.split(placeholder).join(value),
      template,
    );

    res.status(200).setHeader("Content-Type", "text/html").end(html);
  } catch (error) {
    vite?.ssrFixStacktrace(error);
    console.error(error);
    res.status(500).end("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`SSR server running on http://localhost:${port}`);
});
