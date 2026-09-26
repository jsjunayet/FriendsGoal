"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const member_model_1 = require("./member.model");
const member_utils_1 = require("./member.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
// ─── 1. Create Member ─────────────────────────────────────────────────────────
const createMemberIntoDB = async (payload) => {
    const existingMember = await member_model_1.Member.findOne({ email: payload.email });
    if (existingMember) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "A member with this email already exists!");
    }
    // Auto-map designationBn if not given
    if (payload.designation && !payload.designationBn) {
        payload.designationBn = (0, member_utils_1.getDesignationBn)(payload.designation);
    }
    const result = await member_model_1.Member.create(payload);
    return result;
};
// ─── 2. Get All Members (Admin with Search & Pagination) ───────────────────────
const getAllMembersFromDB = async (query) => {
    const { searchTerm, councilCategory, designation, role, status, page = 1, limit = 10, sort = "-createdAt", } = query;
    const filterConditions = {
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
    const total = await member_model_1.Member.countDocuments(filterConditions);
    const totalPage = Math.ceil(total / limitNum) || 1;
    const result = await member_model_1.Member.find(filterConditions)
        .sort(sort)
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
const getPublicCouncilMembersFromDB = async (query) => {
    const { category, designation, search } = query;
    const filterConditions = {
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
    const result = await member_model_1.Member.find(filterConditions)
        .select("memberCode fullName designation designationBn councilCategory bloodGroup profession mobileNo dateOfBirth division district thana presentAddress pictureUrl totalDeposit savingsBalance")
        .sort("memberCode");
    return result;
};
// ─── 4. Get Single Member Details ─────────────────────────────────────────────
const getSingleMemberFromDB = async (id) => {
    // Support both Mongo _id and memberCode
    let result = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await member_model_1.Member.findById(id);
    }
    else {
        result = await member_model_1.Member.findOne({ memberCode: id });
    }
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member not found!");
    }
    return result;
};
// ─── 5. Update Member Profile & Designation ───────────────────────────────────
const updateMemberIntoDB = async (id, payload) => {
    // Check if member exists
    let member = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        member = await member_model_1.Member.findById(id);
    }
    else {
        member = await member_model_1.Member.findOne({ memberCode: id });
    }
    if (!member || member.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member not found!");
    }
    // If designation is updated, auto-update designationBn if not supplied
    if (payload.designation && !payload.designationBn) {
        payload.designationBn = (0, member_utils_1.getDesignationBn)(payload.designation);
    }
    // If password is updated, hash it
    if (payload.password) {
        payload.password = await bcrypt_1.default.hash(payload.password, 10);
    }
    const updatedMember = await member_model_1.Member.findByIdAndUpdate(member._id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedMember;
};
// ─── 6. Permanently Delete Member ─────────────────────────────────────────────
const deleteMemberFromDB = async (id) => {
    let member = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        member = await member_model_1.Member.findById(id);
    }
    else {
        member = await member_model_1.Member.findOne({ memberCode: id });
    }
    if (!member) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Member not found!");
    }
    // Permanently delete as requested in requirement
    const result = await member_model_1.Member.findByIdAndDelete(member._id);
    return result;
};
exports.MemberServices = {
    createMemberIntoDB,
    getAllMembersFromDB,
    getPublicCouncilMembersFromDB,
    getSingleMemberFromDB,
    updateMemberIntoDB,
    deleteMemberFromDB,
};
//# sourceMappingURL=member.service.js.map