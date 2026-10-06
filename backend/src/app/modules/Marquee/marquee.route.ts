import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { MarqueeControllers } from "./marquee.controller";

const router = Router();

// Public route for Home Page - fetches items where isActive: true
router.get("/active", MarqueeControllers.getActiveMarqueeItems);

// Admin route - fetches all items (or query ?active=true)
router.get("/", MarqueeControllers.getAllMarqueeItems);

// Admin / SuperAdmin CRUD routes
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), MarqueeControllers.createMarqueeItem);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), MarqueeControllers.updateMarqueeItem);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), MarqueeControllers.deleteMarqueeItem);

export const MarqueeRoutes = router;
