import type { Model } from "mongoose";

export type TCouncilCategory =
  | "core_leadership"
  | "financial_leadership"
  | "general_member"
  | "executive"
  | "financial"
  | "general";

export type TMemberRole = "superadmin" | "admin" | "manager" | "member";

export type TMemberStatus = "active" | "inactive" | "blocked";

export interface IBilingualText {
  bn: string;
  en: string;
}

export interface IMember {
  _id?: string;
  memberCode: string;
  memberId?: string;
  fullName: string;
  name?: IBilingualText;
  email: string;
  bloodGroup?: string;
  profession?: string;
  nidNo?: string;
  birthRegistrationNo?: string;
  fatherName?: string;
  motherName?: string;
  mobileNo: string;
  phone?: string;
  dateOfBirth?: string;
  division?: string;
  district?: string;
  thana?: string;
  presentAddress?: string;

  // Designation & Council Classification
  designation: string;
  designationBn: string;
  roleTitle?: IBilingualText;
  councilCategory: TCouncilCategory;
  councilType?: string;

  // Account Security & Savings
  role: TMemberRole;
  password?: string;
  profitBalance: number | any;
  totalDeposit: number | any;
  savingsBalance: number | any;
  dueAmount: number | any;
  totalWithdrawn?: number | any;
  depositBalance?: number | any;
  pendingWithdrawal?: number | any;
  othersReceived?: number | any;

  // Nominee Details & Media
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeNid?: string;
  nomineeAddress?: string;
  nomineePictureUrl?: string;
  pictureUrl?: string;
  photoUrl?: string;
  signatureUrl?: string;

  status: TMemberStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MemberModel extends Model<IMember> {
  isMemberExists(email: string): Promise<IMember | null>;
  generateNextMemberCode(): Promise<string>;
}

