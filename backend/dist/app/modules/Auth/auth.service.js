"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../../config/index"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const notification_service_1 = require("../Notification/notification.service");
const auth_utils_1 = require("./auth.utils");
const loginUser = async (payload) => {
    // checking if the user is exist
    const user = await user_model_1.User.isUserExistsByCustomId(payload.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    //checking if the password is correct
    if (!(await user_model_1.User.isPasswordMatched(payload?.password, user?.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    console.log(user);
    //create token and sent to the  client
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, index_1.default.jwt_access_secret, index_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, index_1.default.jwt_refresh_secret, index_1.default.jwt_refresh_expires_in);
    console.log(accessToken, refreshToken);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};
const changePassword = async (userData, payload) => {
    // checking if the user is exist
    const user = await user_model_1.User.isUserExistsByCustomId(userData.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    //checking if the password is correct
    if (!(await user_model_1.User.isPasswordMatched(payload.oldPassword, user?.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    //hash new password
    const newHashedPassword = await bcrypt_1.default.hash(payload.newPassword, Number(index_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
    return null;
};
const refreshToken = async (token) => {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, index_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    // checking if the user is exist
    const user = await user_model_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, index_1.default.jwt_access_secret, index_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
};
const forgetPassword = async (userId) => {
    // checking if the user is exist
    const user = await user_model_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, index_1.default.jwt_access_secret, '10m');
    const resetUILink = `${index_1.default.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;
    const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
      <h2 style="color: #00B074;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUILink}" style="background-color: #00B074; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #6B7280; font-size: 14px;">If you did not request this, please ignore this email. This link will expire in 10 minutes.</p>
    </div>
  `;
    await notification_service_1.NotificationServices.createNotification({
        recipientId: user._id, // Notice we use mongo _id here for ref
        title: "Password Reset Request",
        message: htmlBody,
        type: "PASSWORD_RESET",
        channel: ["EMAIL"],
    });
    console.log("Password reset triggered for:", user.email);
};
const resetPassword = async (payload, token) => {
    // checking if the user is exist
    const user = await user_model_1.User.isUserExistsByCustomId(payload?.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const decoded = jsonwebtoken_1.default.verify(token, index_1.default.jwt_access_secret);
    //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
    if (payload.id !== decoded.userId) {
        console.log(payload.id, decoded.userId);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You are forbidden!');
    }
    //hash new password
    const newHashedPassword = await bcrypt_1.default.hash(payload.newPassword, Number(index_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
};
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
//# sourceMappingURL=auth.service.js.map