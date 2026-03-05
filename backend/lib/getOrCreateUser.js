import User from "../models/user.model.js";

const getClaimValue = (sessionClaims, keys) => {
  for (const key of keys) {
    const value = sessionClaims?.[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const buildFallbackUsername = (sessionClaims, clerkUserId) => {
  const email = getClaimValue(sessionClaims, [
    "email",
    "email_address",
    "primary_email_address",
  ]);
  const username = getClaimValue(sessionClaims, [
    "username",
    "preferred_username",
  ]);

  if (username) {
    return username;
  }

  if (email) {
    return `${email.split("@")[0]}-${clerkUserId.slice(-6)}`;
  }

  return `user-${clerkUserId.slice(-8)}`;
};

const buildFallbackEmail = (sessionClaims, clerkUserId) => {
  const email = getClaimValue(sessionClaims, [
    "email",
    "email_address",
    "primary_email_address",
  ]);

  if (email) {
    return email;
  }

  return `${clerkUserId}@clerk.local`;
};

const buildFallbackImage = (sessionClaims) =>
  getClaimValue(sessionClaims, ["image_url", "picture", "avatar_url"]);

const buildFallbackFirstName = (sessionClaims) =>
  getClaimValue(sessionClaims, ["first_name", "given_name"]);

const buildFallbackLastName = (sessionClaims) =>
  getClaimValue(sessionClaims, ["last_name", "family_name"]);

const getOrCreateUser = async (auth) => {
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    return null;
  }

  const existingUser = await User.findOne({ clerkUserId });

  if (existingUser) {
    return existingUser;
  }

  const sessionClaims = auth?.sessionClaims;

  const newUser = new User({
    clerkUserId,
    username: buildFallbackUsername(sessionClaims, clerkUserId),
    firstName: buildFallbackFirstName(sessionClaims),
    lastName: buildFallbackLastName(sessionClaims),
    email: buildFallbackEmail(sessionClaims, clerkUserId),
    img: buildFallbackImage(sessionClaims),
  });

  await newUser.save();

  return newUser;
};

export default getOrCreateUser;
