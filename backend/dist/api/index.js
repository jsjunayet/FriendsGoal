"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = __importDefault(require("../app/config/index"));
let isConnected = false;
async function connectDB() {
    if (isConnected || mongoose_1.default.connection.readyState >= 1) {
        isConnected = true;
        return;
    }
    const mongoUri = index_1.default.database_url;
    if (!mongoUri) {
        console.warn("DATABASE_URL is not set in environment.");
        return;
    }
    await mongoose_1.default.connect(mongoUri, {
        maxPoolSize: 10,
    });
    isConnected = true;
}
async function handler(req, res) {
    try {
        await connectDB();
    }
    catch (error) {
        console.error("MongoDB connection error in Vercel function:", error);
    }
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map