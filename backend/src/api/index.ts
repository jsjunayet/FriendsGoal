import app from "../app";
import mongoose from "mongoose";
import config from "../app/config/index";

let isConnected = false;

async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  const mongoUri = config.database_url;
  if (!mongoUri) {
    console.warn("DATABASE_URL is not set in environment.");
    return;
  }
  await mongoose.connect(mongoUri, {
    maxPoolSize: 10,
  });
  isConnected = true;
}

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection error in Vercel function:", error);
  }
  return app(req, res);
}
