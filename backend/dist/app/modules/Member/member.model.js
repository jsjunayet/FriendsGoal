"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const member_utils_1 = require("./member.utils");
const memberSchema = new mongoose_1.Schema({
    memberCode: {
        type: String,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    bloodGroup: {
        type: String,
        trim: true,
    },
    profession: {
        type: String,
        trim: true,
        default: "General",
    },
    nidNo: {
        type: String,
        trim: true,
    },
    birthRegistrationNo: {
        type: String,
        trim: true,
    },
    fatherName: {
        type: String,
        trim: true,
    },
    motherName: {
        type: String,
        trim: true,
    },
    mobileNo: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
    },
    dateOfBirth: {
        type: String,
        trim: true,
    },
    division: {
        type: String,
        trim: true,
    },
    district: {
        type: String,
        trim: true,
    },
    thana: {
        type: String,
        trim: true,
    },
    presentAddress: {
        type: String,
        trim: true,
    },
    // Designation & Council Classification
    designation: {
        type: String,
        trim: true,
        default: "General Member",
    },
    designationBn: {
        type: String,
        trim: true,
        default: "সাধারণ সদস্য",
    },
    councilCategory: {
        type: String,
        enum: ["core_leadership", "financial_leadership", "general_member"],
        default: "general_member",
    },
    // Account Security & Savings
    role: {
        type: String,
        enum: ["superadmin", "admin", "manager", "member"],
        default: "member",
    },
    password: {
        type: String,
        select: false,
    },
    profitBalance: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    totalDeposit: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    savingsBalance: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    dueAmount: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    totalWithdrawn: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    depositBalance: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    pendingWithdrawal: {
        type: mongoose_1.Schema.Types.Decimal128,
        default: 0.0,
        get: (v) => (v != null ? parseFloat(v.toString()) : 0),
    },
    // Nominee Details & Media
    nomineeName: {
        type: String,
        trim: true,
    },
    nomineeRelation: {
        type: String,
        trim: true,
    },
    nomineeDob: {
        type: String,
        trim: true,
    },
    nomineeNid: {
        type: String,
        trim: true,
    },
    nomineeAddress: {
        type: String,
        trim: true,
    },
    nomineePictureUrl: {
        type: String,
        trim: true,
    },
    pictureUrl: {
        type: String,
        trim: true,
    },
    signatureUrl: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "blocked"],
        default: "active",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: "__v",
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
});
// Compound Index for performance on queries
memberSchema.index({ email: 1, mobileNo: 1 });
memberSchema.index({ councilCategory: 1, designation: 1, status: 1 });
memberSchema.index({ fullName: "text", email: "text", profession: "text" });
// Static methods
memberSchema.statics.isMemberExists = async function (email) {
    return await this.findOne({ email });
};
memberSchema.statics.generateNextMemberCode = async function () {
    const lastMember = await this.findOne({}, { memberCode: 1 }, { sort: { createdAt: -1 } });
    if (!lastMember || !lastMember.memberCode) {
        return "001";
    }
    const numericCode = parseInt(lastMember.memberCode, 10);
    if (isNaN(numericCode)) {
        const count = await this.countDocuments();
        return String(count + 1).padStart(3, "0");
    }
    return String(numericCode + 1).padStart(3, "0");
};
// Pre-save hook
memberSchema.pre("save", async function () {
    // Auto-generate memberCode if missing
    if (!this.memberCode) {
        const nextCode = await this.constructor.generateNextMemberCode();
        this.memberCode = nextCode;
    }
    // Auto-map designationBn if not supplied
    if (!this.designationBn || this.isModified("designation")) {
        this.designationBn = (0, member_utils_1.getDesignationBn)(this.designation);
    }
    // Hash password if modified
    if (this.password && this.isModified("password")) {
        this.password = await bcrypt_1.default.hash(this.password, 10);
    }
});
exports.Member = (0, mongoose_1.model)("Member", memberSchema);
//# sourceMappingURL=member.model.js.map