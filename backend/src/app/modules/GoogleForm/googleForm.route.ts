import { Router } from "express";
import { GoogleFormControllers } from "./googleForm.controller";

const router = Router();

router.post("/", GoogleFormControllers.createGoogleForm);
router.get("/", GoogleFormControllers.getAllGoogleForms);
router.get("/:id", GoogleFormControllers.getSingleGoogleForm);
router.patch("/:id", GoogleFormControllers.updateGoogleForm);
router.delete("/:id", GoogleFormControllers.deleteGoogleForm);

export const GoogleFormRoutes = router;
