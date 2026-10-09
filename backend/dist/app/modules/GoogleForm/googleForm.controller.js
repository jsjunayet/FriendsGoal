"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFormControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const googleForm_service_1 = require("./googleForm.service");
const createGoogleForm = (0, catchAsync_1.default)(async (req, res) => {
    const result = await googleForm_service_1.GoogleFormServices.createGoogleFormInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Google Form saved successfully!",
        data: result,
    });
});
const getAllGoogleForms = (0, catchAsync_1.default)(async (req, res) => {
    const result = await googleForm_service_1.GoogleFormServices.getAllGoogleFormsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Google Forms retrieved successfully!",
        data: result,
    });
});
const getSingleGoogleForm = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await googleForm_service_1.GoogleFormServices.getSingleGoogleFormFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Google Form retrieved successfully!",
        data: result,
    });
});
const updateGoogleForm = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await googleForm_service_1.GoogleFormServices.updateGoogleFormInDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Google Form updated successfully!",
        data: result,
    });
});
const deleteGoogleForm = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await googleForm_service_1.GoogleFormServices.deleteGoogleFormFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Google Form deleted successfully!",
        data: result,
    });
});
exports.GoogleFormControllers = {
    createGoogleForm,
    getAllGoogleForms,
    getSingleGoogleForm,
    updateGoogleForm,
    deleteGoogleForm,
};
//# sourceMappingURL=googleForm.controller.js.map