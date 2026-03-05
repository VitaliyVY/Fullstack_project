import getOrCreateUser from "../lib/getOrCreateUser.js";
import User from "../models/user.model.js";

export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await getOrCreateUser(req.auth);

  res.status(200).json(user.savedPosts);
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

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select(
      "-clerkUserId -email -savedPosts",
    );
    if (!user) {
      return res.status(404).json("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
