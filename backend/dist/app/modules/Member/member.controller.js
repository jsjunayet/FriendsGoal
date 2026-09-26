"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const member_service_1 = require("./member.service");
// 1. Create Member
const createMember = (0, catchAsync_1.default)(async (req, res) => {
    const result = await member_service_1.MemberServices.createMemberIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Member registered successfully!",
        data: result,
    });
});
// 2. Get All Members (Admin dynamic search & pagination)
const getAllMembers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await member_service_1.MemberServices.getAllMembersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Members fetched successfully!",
        meta: result.meta,
        data: result.data,
    });
});
// 3. Get Public Council Members
const getPublicCouncilMembers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await member_service_1.MemberServices.getPublicCouncilMembersFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Public council members fetched successfully!",
        data: result,
    });
});
// 4. Get Single Member Details
const getSingleMember = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await member_service_1.MemberServices.getSingleMemberFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Member retrieved successfully!",
        data: result,
    });
});
// 5. Update Member Profile & Designation
const updateMember = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await member_service_1.MemberServices.updateMemberIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Member profile updated successfully!",
        data: result,
    });
});
// 6. Permanently Delete Member
const deleteMember = (0, catchAsync_1.default)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await member_service_1.MemberServices.deleteMemberFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Member deleted permanently!",
        data: result,
    });
});
exports.MemberControllers = {
    createMember,
    getAllMembers,
    getPublicCouncilMembers,
    getSingleMember,
    updateMember,
    deleteMember,
};
//# sourceMappingURL=member.controller.js.map