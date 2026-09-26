import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import type { IMember, MemberModel } from "./member.interface";
import { getDesignationBn } from "./member.utils";

const memberSchema = new Schema<IMember, MemberModel>(
  {
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
    totalDeposit: {
      type: Number,
      default: 0,
    },
    savingsBalance: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Index for performance on council queries
memberSchema.index({ councilCategory: 1, designation: 1, status: 1 });
memberSchema.index({ memberCode: 1 });
memberSchema.index({ mobileNo: 1 });
memberSchema.index({ fullName: "text", email: "text", profession: "text" });

// Static methods
memberSchema.statics.isMemberExists = async function (email: string) {
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
    const nextCode = await (this.constructor as MemberModel).generateNextMemberCode();
    this.memberCode = nextCode;
  }

  // Auto-map designationBn if not supplied
  if (!this.designationBn || this.isModified("designation")) {
    this.designationBn = getDesignationBn(this.designation);
  }

  // Hash password if modified
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const Member = model<IMember, MemberModel>("Member", memberSchema);
