import type { Model } from "mongoose";

export type TCouncilCategory =
  | "core_leadership"
  | "financial_leadership"
  | "general_member";

export type TMemberRole = "superadmin" | "admin" | "manager" | "member";

export type TMemberStatus = "active" | "inactive" | "blocked";

export interface IMember {
  _id?: string;
  memberCode: string;
  fullName: string;
  email: string;
  bloodGroup?: string;
  profession?: string;
  nidNo?: string;
  birthRegistrationNo?: string;
  fatherName?: string;
  motherName?: string;
  mobileNo: string;
  dateOfBirth?: string;
  division?: string;
  district?: string;
  thana?: string;
  presentAddress?: string;

  // Designation & Council Classification
  designation: string;
  designationBn: string;
  councilCategory: TCouncilCategory;

  // Account Security & Savings
  role: TMemberRole;
  password?: string;
  totalDeposit: number;
  savingsBalance: number;
  dueAmount: number;

  // Nominee Details & Media
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeDob?: string;
  nomineeNid?: string;
  nomineeAddress?: string;
  nomineePictureUrl?: string;
  pictureUrl?: string;
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
