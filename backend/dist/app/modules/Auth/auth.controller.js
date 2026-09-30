"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const index_1 = __importDefault(require("../../config/index"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    console.log(req.body);
    const result = await auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken, accessToken, needsPasswordChange } = result;
    const isProduction = index_1.default.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie("accessToken", accessToken, {
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 15 * 60 * 1000, // 15 mins
    });
    // Superadmin First-Login Security Alert
    try {
        const decoded = jsonwebtoken_1.default.decode(accessToken);
        if (decoded && decoded.role === "superAdmin" && needsPasswordChange) {
            const ip = req.ip || req.connection.remoteAddress || "Unknown IP";
            const userAgent = req.headers["user-agent"] || "Unknown Device";
            const timestamp = new Date().toLocaleString();
            const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #EF4444;">Superadmin Security Audit Alert</h2>
          <p>A Superadmin has logged into the system for the very first time.</p>
          <div style="background-color: #FEE2E2; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Timestamp:</strong> ${timestamp}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${ip}</p>
            <p style="margin: 5px 0 0 0;"><strong>Browser/Device:</strong> ${userAgent}</p>
          </div>
          <p style="color: #B91C1C; font-size: 13px;"><strong>Warning:</strong> Ensure the default password is changed immediately. If this was not authorized, please take immediate action to secure the platform.</p>
        </div>
      `;
            // Assuming Superadmin notification should go to junayetshiblu0@gmail.com
            // but we need a user ID. For a systemic email, we can omit recipientId and send directly?
            // Wait, our service requires a recipientId for email, unless we modify it. Let's see.
            // I'll import sendEmail directly.
            const { sendEmail } = require('../../../shared/sendEmail');
            sendEmail("junayetshiblu0@gmail.com", "CRITICAL: Superadmin First Login Alert", htmlBody, "A Superadmin has logged in for the first time.").catch((err) => console.error("Failed to send superadmin alert", err));
        }
    }
    catch (err) {
        console.error("Superadmin alert error", err);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in succesfully!',
        data: {
            accessToken,
            needsPasswordChange,
        },
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { ...passwordData } = req.body;
    const result = await auth_service_1.AuthServices.changePassword(req.user, passwordData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password is updated succesfully!',
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_service_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: result,
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.body.id;
    const result = await auth_service_1.AuthServices.forgetPassword(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reset link is generated succesfully!',
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong !');
    }
    const result = await auth_service_1.AuthServices.resetPassword(req.body, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset succesfully!',
        data: result,
    });
});
exports.AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
//# sourceMappingURL=auth.controller.js.map