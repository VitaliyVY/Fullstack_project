import axios from "axios";
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getPosts = async (params) => {
  const response = await api.get("/posts", { params });
  return response.data;
};

const getPost = async (slug) => {
  const response = await api.get(`/posts/${slug}`);
  return response.data;
};

const getComments = async (postId) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

const getUser = async (username) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

const prefetchPostList = (queryClient, searchParams) => {
  const queryString = searchParams.toString();
  const listParams = Object.fromEntries(searchParams.entries());

  return queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", queryString],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      getPosts({
        page: pageParam,
        limit: 10,
        ...listParams,
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage?.hasMore ? pages.length + 1 : undefined,
  });
};

const safePrefetch = async (fn) => {
  try {
    await fn();
  } catch (error) {
    console.error("[SSR prefetch failed]", error.message);
  }
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

export const prefetchQueriesForUrl = async (url, queryClient) => {
  const parsed = new URL(url, "http://localhost");
  const { pathname, searchParams } = parsed;

  if (pathname === "/") {
    await Promise.all([
      safePrefetch(() =>
        queryClient.prefetchQuery({
          queryKey: ["featuredPosts"],
          queryFn: () =>
            getPosts({ featured: true, limit: 4, sort: "newest" }),
        }),
      ),
      safePrefetch(() => prefetchPostList(queryClient, searchParams)),
    ]);
  }

  if (pathname === "/posts") {
    await safePrefetch(() => prefetchPostList(queryClient, searchParams));
  }

  const categoryMatch = matchPath("/categories/:slug", pathname);
  if (categoryMatch?.params.slug) {
    const slug = categoryMatch.params.slug;
    const page = getPage(searchParams);
    const params = { page };

    if (slug !== "general") {
      params.cat = slug;
    }

    await safePrefetch(() =>
      queryClient.prefetchQuery({
        queryKey: ["posts", slug, page],
        queryFn: () => getPosts(params),
      }),
    );
  }

  const authorMatch = matchPath("/authors/:username", pathname);
  if (authorMatch?.params.username) {
    const username = authorMatch.params.username;
    const page = getPage(searchParams);

    await Promise.all([
      safePrefetch(() =>
        queryClient.prefetchQuery({
          queryKey: ["user", username],
          queryFn: () => getUser(username),
        }),
      ),
      safePrefetch(() =>
        queryClient.prefetchQuery({
          queryKey: ["posts", "author", username, page],
          queryFn: () => getPosts({ author: username, page }),
        }),
      ),
    ]);
  }

  const tagMatch = matchPath("/tags/:slug", pathname);
  if (tagMatch?.params.slug) {
    const slug = tagMatch.params.slug;
    const page = getPage(searchParams);

    await safePrefetch(() =>
      queryClient.prefetchQuery({
        queryKey: ["posts", "tag", slug, page],
        queryFn: () => getPosts({ tag: slug, page }),
      }),
    );
  }

  const articleSlug = getArticleSlug(pathname);
  if (articleSlug) {
    let post = null;

    await safePrefetch(async () => {
      post = await queryClient.fetchQuery({
        queryKey: ["post", articleSlug],
        queryFn: () => getPost(articleSlug),
      });
    });

    if (post?._id) {
      await safePrefetch(() =>
        queryClient.prefetchQuery({
          queryKey: ["comments", post._id],
          queryFn: () => getComments(post._id),
        }),
      );
    }
  }
};
