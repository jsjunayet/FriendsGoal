import type { Document, Model, HydratedDocument } from "mongoose";
import { Schema, model } from "mongoose";
import type { TUser } from "./user.interface";

export interface IUserDocument extends TUser, Document {
  isPasswordChangedAfter?(passwordChangedAt: Date, iat: number): boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  isUserExistsByCustomId(id: string): Promise<IUserDocument | null>;
  isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(passwordChangedAt: Date, iat: number): boolean;
}

const userSchema = new Schema<IUserDocument>(
  {
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
  },
  {
    timestamps: true,
  },
);

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  // 1. Search in User collection by id or email
  const user = await this.findOne({
    $or: [{ id: id }, { email: id.toLowerCase() }],
  });
  if (user) return user;

  // 2. Search in Member collection by memberCode, email, or mobileNo
  const { Member } = await import("../Member/member.model");
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
    } as any;
  }

  return null;
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
) {
  if (!givenPassword || !savedPassword) return false;
  if (givenPassword === savedPassword) return true;
  try {
    const bcrypt = await import("bcrypt");
    return await bcrypt.default.compare(givenPassword, savedPassword);
  } catch {
    return false;
  }
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = (
  passwordChangedAt: Date,
  iat: number,
) => {
  return passwordChangedAt.getTime() / 1000 > iat;
};

export const User = model<IUserDocument, IUserModel>(
  "User",
  userSchema,
);
