"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const member_route_1 = require("../modules/Member/member.route");
const operation_route_1 = require("../modules/Operation/operation.route");
const adjustment_route_1 = require("../modules/Adjustment/adjustment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/members",
        route: member_route_1.MemberRoutes,
    },
    {
        path: "/operations",
        route: operation_route_1.OperationRoutes,
    },
    {
        path: "/adjustments",
        route: adjustment_route_1.AdjustmentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map