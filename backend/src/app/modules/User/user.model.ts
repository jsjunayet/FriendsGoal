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
  return this.findOne({ id });
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
) {
  return givenPassword === savedPassword;
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
