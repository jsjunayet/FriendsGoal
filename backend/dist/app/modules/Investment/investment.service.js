"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const investment_model_1 = require("./investment.model");
const member_model_1 = require("../Member/member.model");
const auditLog_service_1 = require("../AuditLog/auditLog.service");
/**
 * 1. Create a new Investment
 * - Financial Accounting Rule: Selecting member is ONLY for tracking; NEVER alters member ledger.
 * - Initial state: status defaults to 'Running', isActive to true, endDate null.
 */
const createInvestmentInDB = async (payload, userId) => {
    try {
        await investment_model_1.Investment.collection.dropIndex("id_1");
    }
    catch {
        // Legacy index already dropped
    }
    let memberName = payload.memberName;
    let memberCode = payload.memberCode;
    if (payload.memberId && mongoose_1.default.isValidObjectId(payload.memberId)) {
        const member = await member_model_1.Member.findById(payload.memberId);
        if (member) {
            memberName = member.fullName;
            memberCode = member.memberCode;
        }
    }
    const { investmentId, numericId } = await investment_model_1.Investment.getNextInvestmentId();
    const isClosedExplicitly = payload.status === "Closed" || Boolean(payload.endDate);
    const status = isClosedExplicitly ? "Closed" : "Running";
    const isActive = isClosedExplicitly ? false : (payload.isActive ?? true);
    const endDate = payload.endDate ? new Date(payload.endDate) : null;
    const docData = {
        investmentId,
        numericId,
        name: payload.name.trim(),
        amount: Number(payload.amount),
        startDate: new Date(payload.startDate),
        endDate,
        remarks: payload.remarks.trim(),
        status,
        isActive,
        memberId: payload.memberId && mongoose_1.default.isValidObjectId(payload.memberId)
            ? new mongoose_1.default.Types.ObjectId(payload.memberId)
            : undefined,
        memberName: memberName ? memberName.trim() : undefined,
        memberCode: memberCode ? memberCode.trim() : undefined,
        isDeleted: false,
    };
    if (userId && mongoose_1.default.isValidObjectId(userId)) {
        docData.createdBy = new mongoose_1.default.Types.ObjectId(userId);
    }
    const createdInvestment = await investment_model_1.Investment.create(docData);
    // Record Audit Log
    await auditLog_service_1.AuditLogServices.createAuditLogInDB({
        adminName: "Super Admin",
        adminRole: "Super Admin",
        action: "Investment Recorded",
        target: `${payload.name}`,
        details: `New investment "${payload.name}" recorded with amount ৳${Number(payload.amount).toLocaleString()}.`,
    }).catch((err) => console.error("Failed to record investment audit log:", err));
    return createdInvestment;
};
/**
 * 2. Get All Investments with Search & Filter
 */
const getInvestmentsFromDB = async (query) => {
    const filter = { isDeleted: false };
    // Search filter
    if (query.search && query.search.trim()) {
        const term = query.search.trim();
        const isNum = !isNaN(Number(term));
        const orConditions = [
            { name: { $regex: term, $options: "i" } },
            { remarks: { $regex: term, $options: "i" } },
            { investmentId: { $regex: term, $options: "i" } },
            { memberName: { $regex: term, $options: "i" } },
            { status: { $regex: term, $options: "i" } },
        ];
        if (isNum) {
            orConditions.push({ amount: Number(term) });
            orConditions.push({ numericId: Number(term) });
        }
        filter.$or = orConditions;
    }
    // Status filter
    if (query.status && query.status !== "All") {
        filter.status = query.status;
    }
    // Active status filter
    if (query.isActive !== undefined && query.isActive !== "") {
        filter.isActive = query.isActive === "true";
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        investment_model_1.Investment.find(filter)
            .sort({ numericId: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        investment_model_1.Investment.countDocuments(filter),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit) || 1,
        },
        data,
    };
};
/**
 * 3. Get Single Investment by ID
 */
const getSingleInvestmentFromDB = async (id) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else {
        query.investmentId = id;
    }
    const investment = await investment_model_1.Investment.findOne(query);
    if (!investment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Investment record not found");
    }
    return investment;
};
/**
 * 4. Close an active Investment
 * - Sets endDate to today (Date.now())
 * - Updates status from 'Running' to 'Closed'
 * - Updates isActive from true to false
 * - DOES NOT modify member balances
 */
const closeInvestmentInDB = async (id) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else {
        query.investmentId = id;
    }
    const existing = await investment_model_1.Investment.findOne(query);
    if (!existing) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Investment record not found to close");
    }
    const updated = await investment_model_1.Investment.findOneAndUpdate(query, {
        endDate: new Date(),
        status: "Closed",
        isActive: false,
    }, { new: true, runValidators: true });
    return updated;
};
/**
 * 5. Update Investment
 */
const updateInvestmentInDB = async (id, payload) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else {
        query.investmentId = id;
    }
    const updateData = { ...payload };
    if (payload.startDate) {
        updateData.startDate = new Date(payload.startDate);
    }
    if (payload.endDate !== undefined) {
        updateData.endDate = payload.endDate ? new Date(payload.endDate) : null;
    }
    if (payload.amount !== undefined) {
        updateData.amount = Number(payload.amount);
    }
    if (payload.status) {
        updateData.isActive = payload.status === "Running";
    }
    const updated = await investment_model_1.Investment.findOneAndUpdate(query, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updated) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Investment record not found to update");
    }
    return updated;
};
/**
 * 6. Delete Investment (Soft delete)
 */
const deleteInvestmentFromDB = async (id) => {
    const query = { isDeleted: false };
    if (mongoose_1.default.isValidObjectId(id)) {
        query._id = id;
    }
    else {
        query.investmentId = id;
    }
    const deleted = await investment_model_1.Investment.findOneAndUpdate(query, { isDeleted: true }, { new: true });
    if (!deleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Investment record not found to delete");
    }
    return deleted;
};
exports.InvestmentServices = {
    createInvestmentInDB,
    getInvestmentsFromDB,
    getSingleInvestmentFromDB,
    closeInvestmentInDB,
    updateInvestmentInDB,
    deleteInvestmentFromDB,
};
//# sourceMappingURL=investment.service.js.map