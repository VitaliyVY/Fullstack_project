import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO) {
    throw new Error("MONGO environment variable is not set");
  }

  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

export default connectDB;
