// testMongo.js
import mongoose from "mongoose";

const MONGO =
  "mongodb://Admin:Admin@vasyacluster-shard-00-00.wnadszy.mongodb.net:27017,vasyacluster-shard-00-01.wnadszy.mongodb.net:27017,vasyacluster-shard-00-02.wnadszy.mongodb.net:27017/blog?replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  } finally {
    mongoose.connection.close(); // закриваємо підключення після перевірки
  }
};

connectDB();
