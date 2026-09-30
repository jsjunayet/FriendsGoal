"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../config/index"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_model_1 = require("../modules/User/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.accessToken ||
            (authHeader?.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : authHeader);
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, index_1.default.jwt_access_secret);
        const { role, userId, iat } = decoded;
        // checking if user exists in User or Member
        let user = await user_model_1.User.isUserExistsByCustomId(userId);
        if (!user) {
            const member = await (await Promise.resolve().then(() => __importStar(require("../modules/Member/member.model")))).Member.findById(userId);
            if (member) {
                user = {
                    _id: member._id,
                    id: member.id || member._id.toString(),
                    email: member.email,
                    role: member.role || "member",
                    status: member.status,
                    isDeleted: member.isDeleted,
                };
            }
        }
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
        }
        const isDeleted = user?.isDeleted;
        if (isDeleted) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This user is deleted !");
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
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized  hi!');
        }
        req.user = { ...decoded, _id: user._id, id: user.id || user._id, email: user.email };
        next();
    });
};
exports.default = auth;
//# sourceMappingURL=auth.js.map