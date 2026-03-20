import getOrCreateUser from "../lib/getOrCreateUser.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const PROFILE_STRING_FIELDS = [
  "firstName",
  "lastName",
  "bio",
  "fullBio",
  "img",
  "linkedinUrl",
  "githubUrl",
  "twitterUrl",
  "websiteUrl",
  "jobTitle",
  "alumniOf",
];

const MAX_SHORT_BIO_LENGTH = 320;
const MAX_FULL_BIO_LENGTH = 3000;
const MAX_LIST_ITEMS = 20;

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

const toUniqueList = (input) => {
  const source = Array.isArray(input) ? input : String(input || "").split(/[\n,]/);
  const seen = new Set();
  const values = [];

  for (const raw of source) {
    const value = normalizeText(raw);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    values.push(value);
    if (values.length >= MAX_LIST_ITEMS) break;
  }

  return values;
};

const sanitizeProfilePayload = (body) => {
  const updates = {};

  for (const field of PROFILE_STRING_FIELDS) {
    if (typeof body[field] === "string") {
      updates[field] = normalizeText(body[field]);
    }
  }

  if (typeof updates.bio === "string" && updates.bio.length > MAX_SHORT_BIO_LENGTH) {
    updates.bio = updates.bio.slice(0, MAX_SHORT_BIO_LENGTH);
  }

  if (
    typeof updates.fullBio === "string" &&
    updates.fullBio.length > MAX_FULL_BIO_LENGTH
  ) {
    updates.fullBio = updates.fullBio.slice(0, MAX_FULL_BIO_LENGTH);
  }

  if (Object.prototype.hasOwnProperty.call(body, "expertise")) {
    updates.expertise = toUniqueList(body.expertise);
  }

  if (Object.prototype.hasOwnProperty.call(body, "awards")) {
    updates.awards = toUniqueList(body.awards);
  }

  if (Object.prototype.hasOwnProperty.call(body, "yearsExperience")) {
    const raw = body.yearsExperience;
    if (raw === "" || raw == null) {
      updates.yearsExperience = null;
    } else {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 80) {
        updates.yearsExperience = Math.floor(parsed);
      }
    }
  }

  return updates;
};

const buildPublicProfileResponse = (user, postCount) => ({
  _id: user._id,
  username: user.username,
  email: user.email || "",
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  bio: user.bio || "",
  fullBio: user.fullBio || "",
  img: user.img || "",
  linkedinUrl: user.linkedinUrl || "",
  githubUrl: user.githubUrl || "",
  twitterUrl: user.twitterUrl || "",
  websiteUrl: user.websiteUrl || "",
  jobTitle: user.jobTitle || "",
  yearsExperience:
    typeof user.yearsExperience === "number" ? user.yearsExperience : null,
  expertise: Array.isArray(user.expertise) ? user.expertise : [],
  awards: Array.isArray(user.awards) ? user.awards : [],
  alumniOf: user.alumniOf || "",
  postCount,
});

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
    res.status(200).json(buildPublicProfileResponse(user, postCount));
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

    if (
      Object.prototype.hasOwnProperty.call(req.body || {}, "yearsExperience") &&
      !Object.prototype.hasOwnProperty.call(updates, "yearsExperience")
    ) {
      return res.status(400).json("Years of experience must be between 0 and 80");
    }

    if (!isValidOptionalUrl(updates.linkedinUrl)) {
      return res.status(400).json("Invalid LinkedIn URL");
    }

    if (!isValidOptionalUrl(updates.githubUrl)) {
      return res.status(400).json("Invalid GitHub URL");
    }

    if (!isValidOptionalUrl(updates.twitterUrl)) {
      return res.status(400).json("Invalid X/Twitter URL");
    }

    if (!isValidOptionalUrl(updates.websiteUrl)) {
      return res.status(400).json("Invalid website URL");
    }

    await user.updateOne({ $set: updates });

    const updatedUser = await User.findById(user._id).select(
      "-clerkUserId -savedPosts",
    );
    const postCount = await Post.countDocuments({ user: user._id });

    res.status(200).json(buildPublicProfileResponse(updatedUser, postCount));
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select("-clerkUserId -savedPosts")
      .lean();

    if (!user) {
      return res.status(404).json("User not found");
    }

    const postCount = await Post.countDocuments({ user: user._id });
    res.status(200).json(buildPublicProfileResponse(user, postCount));
  } catch (err) {
    res.status(500).json(err);
  }
};
