import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    fullBio: {
      type: String,
      default: "",
    },
    linkedinUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    twitterUrl: {
      type: String,
      default: "",
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "Blog Author",
    },
    yearsExperience: {
      type: Number,
      default: null,
      min: 0,
    },
    expertise: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    alumniOf: {
      type: String,
      default: "Kyiv National University",
    },
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
