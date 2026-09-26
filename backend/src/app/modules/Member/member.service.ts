import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import type { IMember } from "./member.interface";
import { Member } from "./member.model";
import { getDesignationBn } from "./member.utils";
import bcrypt from "bcrypt";

// ─── 1. Create Member ─────────────────────────────────────────────────────────

const createMemberIntoDB = async (payload: IMember) => {
  const existingMember = await Member.findOne({ email: payload.email });
  if (existingMember) {
    throw new AppError(httpStatus.BAD_REQUEST, "A member with this email already exists!");
  }

  // Auto-map designationBn if not given
  if (payload.designation && !payload.designationBn) {
    payload.designationBn = getDesignationBn(payload.designation);
  }

  const result = await Member.create(payload);
  return result;
};

// ─── 2. Get All Members (Admin with Search & Pagination) ───────────────────────

const getAllMembersFromDB = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    councilCategory,
    designation,
    role,
    status,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const filterConditions: Record<string, unknown> = {
    isDeleted: false,
  };

  // Dynamic Search by fullName, mobileNo, memberCode, email, profession
  if (searchTerm) {
    filterConditions.$or = [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { mobileNo: { $regex: searchTerm, $options: "i" } },
      { memberCode: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { profession: { $regex: searchTerm, $options: "i" } },
      { designation: { $regex: searchTerm, $options: "i" } },
    ];
  }

  if (councilCategory) {
    filterConditions.councilCategory = councilCategory;
  }
  if (designation) {
    filterConditions.designation = designation;
  }
  if (role) {
    filterConditions.role = role;
  }
  if (status) {
    filterConditions.status = status;
  }

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const total = await Member.countDocuments(filterConditions);
  const totalPage = Math.ceil(total / limitNum) || 1;

  const result = await Member.find(filterConditions)
    .sort(sort as string)
    .skip(skip)
    .limit(limitNum);

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPage,
    },
    data: result,
  };
};

// ─── 3. Get Public Council Members ────────────────────────────────────────────

const getPublicCouncilMembersFromDB = async (query: Record<string, unknown>) => {
  const { category, designation, search } = query;

  const filterConditions: Record<string, unknown> = {
    isDeleted: false,
    status: "active",
  };

  if (category) {
    filterConditions.councilCategory = category;
  }

  if (designation) {
    filterConditions.designation = designation;
  }

  if (search) {
    filterConditions.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } },
      { designationBn: { $regex: search, $options: "i" } },
    ];
  }

  const result = await Member.find(filterConditions)
    .select(
      "memberCode fullName designation designationBn councilCategory bloodGroup profession mobileNo dateOfBirth division district thana presentAddress pictureUrl totalDeposit savingsBalance"
    )
    .sort("memberCode");

  return result;
};

// ─── 4. Get Single Member Details ─────────────────────────────────────────────

const getSingleMemberFromDB = async (id: string) => {
  // Support both Mongo _id and memberCode
  let result = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    result = await Member.findById(id);
  } else {
    result = await Member.findOne({ memberCode: id });
  }

  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  return result;
};

// ─── 5. Update Member Profile & Designation ───────────────────────────────────

const updateMemberIntoDB = async (id: string, payload: Partial<IMember>) => {
  // Check if member exists
  let member = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(id);
  } else {
    member = await Member.findOne({ memberCode: id });
  }

  if (!member || member.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  // If designation is updated, auto-update designationBn if not supplied
  if (payload.designation && !payload.designationBn) {
    payload.designationBn = getDesignationBn(payload.designation);
  }

  // If password is updated, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const updatedMember = await Member.findByIdAndUpdate(member._id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedMember;
};

// ─── 6. Permanently Delete Member ─────────────────────────────────────────────

const deleteMemberFromDB = async (id: string) => {
  let member = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    member = await Member.findById(id);
  } else {
    member = await Member.findOne({ memberCode: id });
  }

  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Member not found!");
  }

  // Permanently delete as requested in requirement
  const result = await Member.findByIdAndDelete(member._id);
  return result;
};

export const MemberServices = {
  createMemberIntoDB,
  getAllMembersFromDB,
  getPublicCouncilMembersFromDB,
  getSingleMemberFromDB,
  updateMemberIntoDB,
  deleteMemberFromDB,
};
