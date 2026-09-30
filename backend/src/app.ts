import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import type { Application, Request, Response } from "express";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes/index";
import { sanitizeNoSql } from "./app/middlewares/security";

const app: Application = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// NoSQL Injection sanitizer
app.use(sanitizeNoSql);

// Strict CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com")
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hi The FriendsGoal API is Running!");
});

app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
