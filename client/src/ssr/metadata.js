import { matchPath } from "react-router-dom";

const RESERVED_SLUGS = new Set([
  "about",
  "posts",
  "articles",
  "write",
  "categories",
  "authors",
  "tags",
  "admin",
  "login",
  "register",
]);

const DEFAULT_TITLE = "Lama Dev Blog App";
const DEFAULT_DESCRIPTION =
  "Tech blog with articles about JavaScript, frontend, backend, DevOps, AI, machine learning, and cybersecurity.";

const CATEGORY_NAMES = {
  general: "All",
  "javascript-frontend": "JavaScript / Frontend Development",
  "backend-devops": "Backend & DevOps",
  "ai-ml": "Artificial Intelligence & ML",
  cybersecurity: "Cybersecurity",
  "tools-reviews": "Tools & Technology Reviews",
};

const normalizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();

const limitText = (value, max = 160) => {
  const text = normalizeText(value);
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
};

const toAbsoluteUrl = (rawUrl, origin) => {
  if (!rawUrl) return "";
  try {
    return new URL(rawUrl, origin).toString();
  } catch {
    return "";
  }
};

const isSingleSlugRoute = (pathname) => {
  const match = pathname.match(/^\/([^/]+)$/);
  if (!match) return null;
  const slug = match[1];
  if (!slug || RESERVED_SLUGS.has(slug)) return null;
  return decodeURIComponent(slug);
};

const getArticleSlug = (pathname) => {
  const articleMatch = matchPath("/articles/:slug", pathname);
  if (articleMatch?.params.slug) {
    return decodeURIComponent(articleMatch.params.slug);
  }
  return isSingleSlugRoute(pathname);
};

export const getMetadataForUrl = (url, queryClient, origin) => {
  const parsed = new URL(url, origin || "http://localhost");
  const { pathname } = parsed;

  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let ogType = "website";
  let image = toAbsoluteUrl("/favicon.ico", origin);

  if (pathname === "/posts") {
    const sort = parsed.searchParams.get("sort");
    if (sort === "trending") {
      title = "Trending Posts | Lama Dev Blog App";
      description = "Trending posts and recent popular topics from our tech blog.";
    } else if (sort === "popular") {
      title = "Most Popular Posts | Lama Dev Blog App";
      description = "Most popular articles and guides from our tech blog.";
    } else {
      title = "All Posts | Lama Dev Blog App";
      description = "Browse all posts from our tech blog.";
    }
  }

  if (pathname === "/about") {
    title = "About Us | Lama Dev Blog App";
    description =
      "Learn about LamaLog, our editorial mission, and how we create practical content for developers.";
  }

  const categoryMatch = matchPath("/categories/:slug", pathname);
  if (categoryMatch?.params.slug) {
    const slug = categoryMatch.params.slug;
    const categoryName = CATEGORY_NAMES[slug] || slug;
    title = `${categoryName} | Lama Dev Blog App`;
    description = `Articles in category: ${categoryName}.`;
  }

  const authorMatch = matchPath("/authors/:username", pathname);
  if (authorMatch?.params.username) {
    const username = decodeURIComponent(authorMatch.params.username);
    title = `${username} | Author | Lama Dev Blog App`;
    description = `Posts written by ${username}.`;
  }

  const tagMatch = matchPath("/tags/:slug", pathname);
  if (tagMatch?.params.slug) {
    const tag = decodeURIComponent(tagMatch.params.slug);
    title = `Tag: ${tag} | Lama Dev Blog App`;
    description = `Articles tagged with ${tag}.`;
  }

  const articleSlug = getArticleSlug(pathname);
  if (articleSlug) {
    const post = queryClient.getQueryData(["post", articleSlug]);
    if (post?.title) {
      title = `${normalizeText(post.title)} | Lama Dev Blog App`;
      description = limitText(post.desc || DEFAULT_DESCRIPTION);
      ogType = "article";
      image = toAbsoluteUrl(post.img, origin) || image;
    }
  }

  if (pathname === "/login") {
    title = "Login | Lama Dev Blog App";
    description = "Sign in to your account.";
  }

  if (pathname === "/register") {
    title = "Register | Lama Dev Blog App";
    description = "Create a new account.";
  }

  const canonicalArticleSlug = getArticleSlug(pathname);
  const canonicalPath =
    canonicalArticleSlug && !pathname.startsWith("/articles/")
      ? `/articles/${encodeURIComponent(canonicalArticleSlug)}`
      : pathname;
  const canonical = new URL(canonicalPath, origin).toString();

  return {
    title: limitText(title, 120) || DEFAULT_TITLE,
    description: limitText(description) || DEFAULT_DESCRIPTION,
    canonical,
    ogType,
    ogTitle: limitText(title, 120) || DEFAULT_TITLE,
    ogDescription: limitText(description) || DEFAULT_DESCRIPTION,
    ogImage: image,
    ogUrl: canonical,
    twitterCard: image ? "summary_large_image" : "summary",
    twitterTitle: limitText(title, 120) || DEFAULT_TITLE,
    twitterDescription: limitText(description) || DEFAULT_DESCRIPTION,
    twitterImage: image,
  };
};
