import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { InvestmentIncomeValidation } from "./investmentIncome.validation";
import { InvestmentIncomeControllers } from "./investmentIncome.controller";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  validateRequest(InvestmentIncomeValidation.createInvestmentIncomeSchema),
  InvestmentIncomeControllers.createInvestmentIncome
);

router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.manager),
  InvestmentIncomeControllers.getInvestmentIncomes
);

export const InvestmentIncomeRoutes = router;
