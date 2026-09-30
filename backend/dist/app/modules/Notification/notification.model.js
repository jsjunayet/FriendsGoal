"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    recipientId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: [
            "DUE_ALERT",
            "DEPOSIT_SUCCESS",
            "WITHDRAWAL_REQUEST",
            "DIRECT_ADMIN_MSG",
            "MEMBER_ONBOARDING",
            "PASSWORD_RESET",
            "SUPERADMIN_SECURITY_ALERT",
            "GENERAL",
        ],
        default: "GENERAL",
    },
    channel: { type: [String], default: ["IN_APP"] },
    isRead: { type: Boolean, default: false },
    requiresAction: { type: Boolean, default: false },
    isAcknowledged: { type: Boolean, default: false },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
});
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
//# sourceMappingURL=notification.model.js.map