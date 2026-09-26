import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { MemberRoutes } from "../modules/Member/member.route";

import { OperationRoutes } from "../modules/Operation/operation.route";
import { AdjustmentRoutes } from "../modules/Adjustment/adjustment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/members",
    route: MemberRoutes,
  },
  {
    path: "/operations",
    route: OperationRoutes,
  },
  {
    path: "/adjustments",
    route: AdjustmentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
