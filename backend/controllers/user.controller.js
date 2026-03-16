import getOrCreateUser from "../lib/getOrCreateUser.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "bio",
  "img",
  "linkedinUrl",
  "githubUrl",
];

const normalizeText = (value) => String(value || "").trim();

const hasFullName = (profile) =>
  Boolean(normalizeText(profile?.firstName) && normalizeText(profile?.lastName));

const isValidOptionalUrl = (url) => {
  const value = normalizeText(url);
  if (!value) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const sanitizeProfilePayload = (body) => {
  const updates = {};

  for (const field of PROFILE_FIELDS) {
    if (typeof body[field] === "string") {
      updates[field] = normalizeText(body[field]);
    }
  }

  if (typeof updates.bio === "string" && updates.bio.length > 320) {
    updates.bio = updates.bio.slice(0, 320);
  }

  return updates;
};

export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await getOrCreateUser(req.auth);

  res.status(200).json(user.savedPosts);
};

export const getCurrentUserProfile = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const user = await getOrCreateUser(req.auth);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const postCount = await Post.countDocuments({ user: user._id });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      img: user.img || "",
      linkedinUrl: user.linkedinUrl || "",
      githubUrl: user.githubUrl || "",
      postCount,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await getOrCreateUser(req.auth);

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await user.updateOne({
      $push: { savedPosts: postId },
    });
  } else {
    await user.updateOne({
      $pull: { savedPosts: postId },
    });
  }

  res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
};

export const getAdminAuthors = async (req, res) => {
  try {
    const users = await User.find()
      .select("-clerkUserId -email -savedPosts")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((user) => user._id);
    const counts = await Post.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", postCount: { $sum: 1 } } },
    ]);

    const postCountMap = new Map(
      counts.map((item) => [String(item._id), item.postCount]),
    );

    const authors = users.map((user) => ({
      ...user,
      postCount: postCountMap.get(String(user._id)) || 0,
    }));

    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateCurrentUserProfile = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const user = await getOrCreateUser(req.auth);

    if (!user) {
      return res.status(404).json("User not found");
    }

    const updates = sanitizeProfilePayload(req.body || {});
    const nextProfile = {
      firstName: updates.firstName ?? user.firstName,
      lastName: updates.lastName ?? user.lastName,
    };

    if (!hasFullName(nextProfile)) {
      return res.status(400).json("First name and last name are required");
    }

    if (!isValidOptionalUrl(updates.linkedinUrl)) {
      return res.status(400).json("Invalid LinkedIn URL");
    }

    if (!isValidOptionalUrl(updates.githubUrl)) {
      return res.status(400).json("Invalid GitHub URL");
    }

    await user.updateOne({ $set: updates });

    const updatedUser = await User.findById(user._id).select(
      "-clerkUserId -email -savedPosts",
    );
    const postCount = await Post.countDocuments({ user: user._id });

    res.status(200).json({
      ...updatedUser.toObject(),
      postCount,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-clerkUserId -email -savedPosts")
      .lean();

    if (!user) {
      return res.status(404).json("User not found");
    }

    const postCount = await Post.countDocuments({ user: user._id });

    res.status(200).json({
      ...user,
      postCount,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
