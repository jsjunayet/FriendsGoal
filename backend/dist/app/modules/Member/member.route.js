"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const member_controller_1 = require("./member.controller");
const member_validation_1 = require("./member.validation");
const router = express_1.default.Router();
// 1. Create a new member
router.post("/", (0, validateRequest_1.default)(member_validation_1.MemberValidation.createMemberValidationSchema), member_controller_1.MemberControllers.createMember);
// 2. Admin dashboard fetch with dynamic search & pagination
router.get("/", member_controller_1.MemberControllers.getAllMembers);
// 3. Public API for public council page
router.get("/public-council", member_controller_1.MemberControllers.getPublicCouncilMembers);
// 4. Fetch single member details
router.get("/:id", member_controller_1.MemberControllers.getSingleMember);
// 5. Update member profile & designation data
router.patch("/:id", (0, validateRequest_1.default)(member_validation_1.MemberValidation.updateMemberValidationSchema), member_controller_1.MemberControllers.updateMember);
// 6. Permanently delete a member
router.delete("/:id", member_controller_1.MemberControllers.deleteMember);
exports.MemberRoutes = router;
//# sourceMappingURL=member.route.js.map