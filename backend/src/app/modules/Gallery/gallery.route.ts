import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { GalleryController } from "./gallery.controller";

const router = Router();

// Public routes
router.get("/", GalleryController.getAllGalleryItems);
router.get("/:id", GalleryController.getSingleGalleryItem);

// Protected Admin / SuperAdmin routes
router.post("/", auth(USER_ROLE.admin, USER_ROLE.superAdmin), GalleryController.createGalleryItem);
router.patch("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), GalleryController.updateGalleryItem);
router.delete("/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), GalleryController.deleteGalleryItem);

export const GalleryRoutes = router;
