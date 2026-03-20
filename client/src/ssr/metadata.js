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
const DEFAULT_AUTHOR_JOB_TITLE = "Blog Author";
const DEFAULT_AUTHOR_ALUMNI = "Kyiv National University";
const DEFAULT_ORG_NAME = "Lama Dev Blog App";
const DEFAULT_ORG_LEGAL_NAME = "Lama Dev Blog App";
const DEFAULT_ORG_FOUNDING_DATE = "2024";
const DEFAULT_ORG_SAME_AS = [];
const DEFAULT_ORG_LOGO_WIDTH = 512;
const DEFAULT_ORG_LOGO_HEIGHT = 512;
const DEFAULT_ORG_CONTACT_EMAIL = "feedback@example.com";
const DEFAULT_ORG_CONTACT_PHONE = "+380123456789";

const CATEGORY_NAMES = {
  general: "All",
  "javascript-frontend": "JavaScript / Frontend Development",
  "backend-devops": "Backend & DevOps",
  "ai-ml": "Artificial Intelligence & ML",
  cybersecurity: "Cybersecurity",
  "tools-reviews": "Tools & Technology Reviews",
};

const DEFAULT_KNOWS_ABOUT = Object.values(CATEGORY_NAMES).filter(
  (item) => item !== "All",
);

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

const unique = (values) => {
  const seen = new Set();
  const result = [];

  for (const value of values) {
    const normalized = normalizeText(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

const getPage = (searchParams) => {
  const raw = Number(searchParams.get("page"));
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
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

const getDisplayName = (user, fallbackUsername = "") => {
  const firstName = normalizeText(user?.firstName);
  const lastName = normalizeText(user?.lastName);
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return normalizeText(user?.username) || normalizeText(fallbackUsername);
};

const getTopicsFromPosts = (posts) => {
  const topics = [];

  for (const post of posts || []) {
    const category = normalizeText(post?.category);
    const categoryName = CATEGORY_NAMES[category] || category;
    if (categoryName && categoryName !== "All") {
      topics.push(categoryName);
    }

    if (Array.isArray(post?.tags)) {
      topics.push(...post.tags);
    }
  }

  return unique(topics);
};

const buildOrganizationAffiliation = (origin) => ({
  "@type": "Organization",
  name: DEFAULT_ORG_NAME,
  legalName: DEFAULT_ORG_LEGAL_NAME,
  url: toAbsoluteUrl("/", origin),
  sameAs: DEFAULT_ORG_SAME_AS,
  foundingDate: DEFAULT_ORG_FOUNDING_DATE,
  logo: {
    "@type": "ImageObject",
    url: toAbsoluteUrl("/favicon.ico", origin),
    width: DEFAULT_ORG_LOGO_WIDTH,
    height: DEFAULT_ORG_LOGO_HEIGHT,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Kyivska St",
    addressLocality: "Kyiv",
    postalCode: "01001",
    addressCountry: {
      "@type": "Country",
      name: "UA",
    },
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: DEFAULT_ORG_CONTACT_EMAIL,
    telephone: DEFAULT_ORG_CONTACT_PHONE,
    contactType: "headquarters",
    areaServed: "UA",
    availableLanguage: ["uk-UA", "en-UA"],
  },
});

const buildAuthorStructuredData = ({
  user,
  username,
  origin,
  knowsAbout = [],
}) => {
  const resolvedUsername = normalizeText(user?.username) || normalizeText(username);
  if (!resolvedUsername) return null;

  const profileTopics = Array.isArray(user?.expertise) ? user.expertise : [];
  const knowsAboutValues = unique([
    ...profileTopics,
    ...(knowsAbout.length ? knowsAbout : DEFAULT_KNOWS_ABOUT),
  ]);
  const sameAs = unique([
    toAbsoluteUrl(user?.linkedinUrl, origin),
    toAbsoluteUrl(user?.githubUrl, origin),
    toAbsoluteUrl(user?.twitterUrl, origin),
    toAbsoluteUrl(user?.websiteUrl, origin),
  ]);
  const displayName = getDisplayName(user, resolvedUsername);
  const image = toAbsoluteUrl(user?.img, origin) || toAbsoluteUrl("/favicon.ico", origin);
  const email = normalizeText(user?.email);
  const awards = Array.isArray(user?.awards) ? unique(user.awards) : [];
  const author = {
    "@type": "Person",
    name: displayName || resolvedUsername,
    url: toAbsoluteUrl(`/authors/${encodeURIComponent(resolvedUsername)}`, origin),
    knowsAbout: knowsAboutValues,
    description:
      limitText(user?.fullBio || user?.bio, 1000) ||
      `Author profile: ${displayName || resolvedUsername}.`,
    sameAs,
    image,
    email,
    jobTitle: normalizeText(user?.jobTitle) || DEFAULT_AUTHOR_JOB_TITLE,
    affiliation: buildOrganizationAffiliation(origin),
    award: awards,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: normalizeText(user?.alumniOf) || DEFAULT_AUTHOR_ALUMNI,
    },
  };

  return author;
};

const removeEmptyFields = (value) => {
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => removeEmptyFields(item))
      .filter((item) => {
        if (item == null) return false;
        if (typeof item === "string" && !item.trim()) return false;
        if (Array.isArray(item) && item.length === 0) return false;
        if (typeof item === "object" && Object.keys(item).length === 0) return false;
        return true;
      });
    return cleanedArray;
  }

  if (value && typeof value === "object") {
    const cleanedObject = {};
    for (const [key, item] of Object.entries(value)) {
      const cleanedItem = removeEmptyFields(item);
      if (cleanedItem == null) continue;
      if (typeof cleanedItem === "string" && !cleanedItem.trim()) continue;
      if (Array.isArray(cleanedItem) && cleanedItem.length === 0) continue;
      if (
        cleanedItem &&
        typeof cleanedItem === "object" &&
        Object.keys(cleanedItem).length === 0
      ) {
        continue;
      }
      cleanedObject[key] = cleanedItem;
    }
    return cleanedObject;
  }

  return value;
};

const buildStructuredData = ({
  parsed,
  pathname,
  queryClient,
  origin,
  canonical,
  articleSlug,
}) => {
  const structuredData = [];
  const authorMatch = matchPath("/authors/:username", pathname);

  if (authorMatch?.params.username) {
    const username = decodeURIComponent(authorMatch.params.username);
    const page = getPage(parsed.searchParams);
    const user = queryClient.getQueryData(["user", username]);
    const posts = queryClient.getQueryData(["posts", "author", username, page])?.posts;
    const knowsAbout = getTopicsFromPosts(posts);
    const person = buildAuthorStructuredData({
      user,
      username,
      origin,
      knowsAbout,
    });

    if (person) {
      structuredData.push({
        "@context": "https://schema.org",
        ...person,
      });
    }
  }

  if (articleSlug) {
    const post = queryClient.getQueryData(["post", articleSlug]);

    if (post?.title) {
      const author = buildAuthorStructuredData({
        user: post.user,
        username: post.user?.username,
        origin,
        knowsAbout: getTopicsFromPosts([post]),
      });
      const article = removeEmptyFields({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: normalizeText(post.title),
        description: limitText(post.desc || DEFAULT_DESCRIPTION),
        image: toAbsoluteUrl(post.img, origin),
        mainEntityOfPage: canonical,
        url: canonical,
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        articleSection: CATEGORY_NAMES[post.category] || normalizeText(post.category),
        keywords: unique(post.tags || []),
        author,
        publisher: {
          "@type": "Organization",
          name: "Lama Dev Blog App",
          url: toAbsoluteUrl("/", origin),
        },
      });

      if (Object.keys(article).length > 0) {
        structuredData.push(article);
      }
    }
  }

  return structuredData;
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
  const structuredData = buildStructuredData({
    parsed,
    pathname,
    queryClient,
    origin,
    canonical,
    articleSlug,
  });

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
    structuredData,
  };
};
