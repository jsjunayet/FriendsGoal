"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentIncomeRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const investmentIncome_validation_1 = require("./investmentIncome.validation");
const investmentIncome_controller_1 = require("./investmentIncome.controller");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.manager), (0, validateRequest_1.default)(investmentIncome_validation_1.InvestmentIncomeValidation.createInvestmentIncomeSchema), investmentIncome_controller_1.InvestmentIncomeControllers.createInvestmentIncome);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.manager), investmentIncome_controller_1.InvestmentIncomeControllers.getInvestmentIncomes);
exports.InvestmentIncomeRoutes = router;
//# sourceMappingURL=investmentIncome.route.js.map