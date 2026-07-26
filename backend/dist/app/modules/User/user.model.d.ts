import type { Document, Model } from "mongoose";
import type { TUser } from "./user.interface";
export interface IUserDocument extends TUser, Document {
    isPasswordChangedAfter?(passwordChangedAt: Date, iat: number): boolean;
}
export interface IUserModel extends Model<IUserDocument> {
    isUserExistsByCustomId(id: string): Promise<IUserDocument | null>;
    isPasswordMatched(givenPassword: string, savedPassword: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(passwordChangedAt: Date, iat: number): boolean;
}
export declare const User: IUserModel;
//# sourceMappingURL=user.model.d.ts.map