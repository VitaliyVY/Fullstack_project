import express from "express";
import {
  getUserSavedPosts,
  savePost,
  getUserByUsername,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/saved", getUserSavedPosts);
router.patch("/save", savePost);
router.get("/:username", getUserByUsername);

export default router;
