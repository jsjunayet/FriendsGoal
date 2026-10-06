import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { StatController } from "./stats.controller";

const router = Router();

// Public route to fetch home page stats
router.get("/", StatController.getAllStats);

// Admin / SuperAdmin Protected routes
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), StatController.createStat);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), StatController.updateStat);

export const StatRoutes = router;
