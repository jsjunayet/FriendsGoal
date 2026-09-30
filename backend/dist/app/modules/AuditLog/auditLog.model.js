"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = require("mongoose");
const auditLogSchema = new mongoose_1.Schema({
    logId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    adminName: {
        type: String,
        required: [true, "Admin name is required"],
        trim: true,
    },
    adminAvatar: {
        type: String,
        trim: true,
    },
    adminRole: {
        type: String,
        trim: true,
        default: "Admin",
    },
    action: {
        type: String,
        required: [true, "Action is required"],
        trim: true,
    },
    target: {
        type: String,
        required: [true, "Target is required"],
        trim: true,
    },
    details: {
        type: String,
        required: [true, "Details is required"],
        trim: true,
    },
}, {
    timestamps: true,
});
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ target: "text", details: "text", adminName: "text" });
exports.AuditLog = (0, mongoose_1.model)("AuditLog", auditLogSchema);
//# sourceMappingURL=auditLog.model.js.map