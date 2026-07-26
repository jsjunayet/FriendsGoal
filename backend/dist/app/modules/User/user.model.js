"use strict";
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
    return this.findOne({ id });
};
userSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    return givenPassword === savedPassword;
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = (passwordChangedAt, iat) => {
    return passwordChangedAt.getTime() / 1000 > iat;
};
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map