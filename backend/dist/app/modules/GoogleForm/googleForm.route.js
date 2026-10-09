"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleFormRoutes = void 0;
const express_1 = require("express");
const googleForm_controller_1 = require("./googleForm.controller");
const router = (0, express_1.Router)();
router.post("/", googleForm_controller_1.GoogleFormControllers.createGoogleForm);
router.get("/", googleForm_controller_1.GoogleFormControllers.getAllGoogleForms);
router.get("/:id", googleForm_controller_1.GoogleFormControllers.getSingleGoogleForm);
router.patch("/:id", googleForm_controller_1.GoogleFormControllers.updateGoogleForm);
router.delete("/:id", googleForm_controller_1.GoogleFormControllers.deleteGoogleForm);
exports.GoogleFormRoutes = router;
//# sourceMappingURL=googleForm.route.js.map