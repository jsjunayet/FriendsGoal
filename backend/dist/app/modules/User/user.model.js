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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, default: false },
    role: {
        type: String,
        required: true,
        enum: ["superAdmin", "admin", "faculty", "student"],
    },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
}, {
    timestamps: true,
});
userSchema.statics.isUserExistsByCustomId = async function (id) {
    // 1. Search in User collection by id or email
    const user = await this.findOne({
        $or: [{ id: id }, { email: id.toLowerCase() }],
    });
    if (user)
        return user;
    // 2. Search in Member collection by memberCode, email, or mobileNo
    const { Member } = await Promise.resolve().then(() => __importStar(require("../Member/member.model")));
    const member = await Member.findOne({
        $or: [
            { memberCode: id },
            { email: id.toLowerCase() },
            { mobileNo: id },
        ],
    }).select("+password");
    if (member) {
        return {
            _id: member._id,
            id: member.memberCode || member._id.toString(),
            email: member.email,
            password: member.password || "member12345",
            role: member.role || "member",
            status: member.status,
            isDeleted: member.isDeleted,
            needsPasswordChange: false,
        };
    }
    return null;
};
userSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    if (!givenPassword || !savedPassword)
        return false;
    if (givenPassword === savedPassword)
        return true;
    try {
        const bcrypt = await Promise.resolve().then(() => __importStar(require("bcrypt")));
        return await bcrypt.default.compare(givenPassword, savedPassword);
    }
    catch {
        return false;
    }
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = (passwordChangedAt, iat) => {
    return passwordChangedAt.getTime() / 1000 > iat;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map