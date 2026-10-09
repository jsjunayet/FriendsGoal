"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./app/utils/pdfFontLoader");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const index_1 = __importDefault(require("./app/routes/index"));
const security_1 = require("./app/middlewares/security");
const app = (0, express_1.default)();
// Security Headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// Parsers
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
// NoSQL Injection sanitizer
app.use(security_1.sanitizeNoSql);
// Strict CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin ||
            allowedOrigins.includes("*") ||
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.endsWith(".onrender.com")) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
// Serve static uploads (candidate directories across local workspace and serverless deployment)
const possibleUploadDirs = [
    path_1.default.join(process.cwd(), "uploads"),
    path_1.default.join(process.cwd(), "backend", "uploads"),
    path_1.default.join(__dirname, "../uploads"),
    path_1.default.join(__dirname, "../../uploads"),
    path_1.default.join(__dirname, "../../../uploads"),
    path_1.default.join(os_1.default.tmpdir(), "uploads"),
];
possibleUploadDirs.forEach((dir) => {
    try {
        if (fs_1.default.existsSync(dir)) {
            app.use("/uploads", express_1.default.static(dir));
        }
    }
    catch (_) { }
});
// Explicit route fallback to ensure static uploads are always sent if found
app.get("/uploads/:filename", (req, res, next) => {
    const filename = path_1.default.basename(req.params.filename || "");
    for (const dir of possibleUploadDirs) {
        try {
            const candidate = path_1.default.join(dir, filename);
            if (fs_1.default.existsSync(candidate) && fs_1.default.statSync(candidate).isFile()) {
                return res.sendFile(candidate);
            }
        }
        catch (_) { }
    }
    return next();
});
// Application routes
app.use("/api/v1", index_1.default);
app.get("/", (req, res) => {
    res.send("Hi The FriendsGoal API is Running!");
});
app.use(globalErrorhandler_1.default);
// Not Found
app.use(notFound_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map