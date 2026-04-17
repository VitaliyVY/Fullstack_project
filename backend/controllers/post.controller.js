import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import getOrCreateUser from "../lib/getOrCreateUser.js";

// Simple in-memory caches for post detail and post lists
const postCache = new Map();
const postsListCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const isFreshCacheEntry = (entry, now) => entry && now - entry.timestamp < CACHE_TTL;

const clearPostCaches = () => {
  postCache.clear();
  postsListCache.clear();
};

const buildPostsListCacheKey = ({
  page,
  limit,
  cat,
  tag,
  author,
  searchQuery,
  sortQuery,
  featured,
}) => {
  const normalizedTag = Array.isArray(tag) ? [...tag].sort() : tag || "";
  return JSON.stringify({
    page,
    limit,
    cat: cat || "",
    tag: normalizedTag,
    author: author || "",
    search: searchQuery || "",
    sort: sortQuery || "",
    featured: String(Boolean(featured)),
  });
};

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const now = Date.now();

  const query = {};

  const cat = req.query.cat;
  const tag = req.query.tag;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;
  const listCacheKey = `posts_${buildPostsListCacheKey({
    page,
    limit,
    cat,
    tag,
    author,
    searchQuery,
    sortQuery,
    featured,
  })}`;

  const cachedList = postsListCache.get(listCacheKey);
  if (isFreshCacheEntry(cachedList, now)) {
    return res.status(200).json(cachedList.data);
  }
  if (cachedList) {
    postsListCache.delete(listCacheKey);
  }

  if (cat) {
    query.category = cat;
  }

  if (tag) {
    if (Array.isArray(tag)) {
      query.tags = { $in: tag };
    } else {
      query.tags = { $in: [tag] };
    }
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(200).json({ posts: [], hasMore: false });
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username firstName lastName img")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments(query);
  const hasMore = page * limit < totalPosts;

  const payload = { posts, hasMore, totalPosts };
  postsListCache.set(listCacheKey, { data: payload, timestamp: now });
  res.status(200).json(payload);
};

export const getPost = async (req, res) => {
  const slug = req.params.slug;
  const cacheKey = `post_${slug}`;
  const now = Date.now();

  // Check cache
  if (postCache.has(cacheKey)) {
    const cachedPost = postCache.get(cacheKey);
    if (isFreshCacheEntry(cachedPost, now)) {
      return res.status(200).json(cachedPost.data);
    }
    postCache.delete(cacheKey);
  }

  const post = await Post.findOne({ slug }).populate(
    "user",
    "username firstName lastName img bio fullBio linkedinUrl githubUrl twitterUrl websiteUrl email jobTitle yearsExperience expertise awards alumniOf",
  );

  if (post) {
    postCache.set(cacheKey, { data: post, timestamp: now });
  }

  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await getOrCreateUser(req.auth);

  if (!user) {
    return res.status(404).json("User not found!");
  }

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });

  const post = await newPost.save();
  clearPostCaches();
  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    clearPostCaches();
    return res.status(200).json("Post has been deleted");
  }

  const user = await User.findOne({ clerkUserId });

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can delete only your posts!");
  }

  clearPostCaches();
  res.status(200).json("Post has been deleted");
};

export const updatePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await getOrCreateUser(req.auth);

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  if (post.user.toString() !== user._id.toString()) {
    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json("You can update only your posts!");
    }
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true },
  );

  clearPostCaches();
  res.status(200).json(updatedPost);
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true },
  );

  clearPostCaches();
  res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};

export const uploadConfig = async (req, res) => {
  if (!process.env.IK_PUBLIC_KEY || !process.env.IK_URL_ENDPOINT) {
    return res.status(500).json("Image upload config is missing");
  }

  res.status(200).json({
    publicKey: process.env.IK_PUBLIC_KEY,
    urlEndpoint: process.env.IK_URL_ENDPOINT,
  });
};
