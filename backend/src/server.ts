import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.send("FriendsGoal Backend is running perfectly alright! 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is blasting off on port ${PORT} ⚡`);
});
