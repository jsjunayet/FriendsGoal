import app from "../src/app";
import mongoose from "mongoose";
import config from "../src/app/config/index";

// Preload standard fonts to force Vercel NFT to trace and bundle them into the Serverless Function
try {
  require("pdfkit/standard-fonts/Helvetica");
  require("pdfkit/standard-fonts/HelveticaBold");
  require("pdfkit/standard-fonts/HelveticaOblique");
  require("pdfkit/standard-fonts/HelveticaBoldOblique");
  require("pdfkit/standard-fonts/Courier");
  require("pdfkit/standard-fonts/CourierBold");
  require("pdfkit/standard-fonts/TimesRoman");
  require("pdfkit/standard-fonts/TimesBold");
  require("pdfkit/standard-fonts/Symbol");
  require("pdfkit/standard-fonts/ZapfDingbats");
} catch (_) {}

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
