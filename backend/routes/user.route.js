import express from "express";
import {
  getUserSavedPosts,
  getCurrentUserProfile,
  getAdminAuthors,
  savePost,
  getUserByUsername,
  updateCurrentUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/saved", getUserSavedPosts);
router.get("/me", getCurrentUserProfile);
router.get("/admin/authors", getAdminAuthors);
router.patch("/save", savePost);
router.patch("/profile", updateCurrentUserProfile);
router.get("/:username", getUserByUsername);

export default router;
