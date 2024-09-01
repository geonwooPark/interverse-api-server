import { Router } from "express";
import {
  createHotplace,
  deleteHotplace,
  updateHotplace,
  getAllHotplace,
  getAutocompleteResults,
  getSingleHotplace,
} from "../controllers/hotplace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHotplace);
router.get("/:hotplaceId", getSingleHotplace);
router.post("/", authMiddleware, createHotplace);
router.delete("/:hotplaceId", authMiddleware, deleteHotplace);
router.patch("/:hotplaceId", authMiddleware, updateHotplace);

router.get("/automatic-search/:keyword", getAutocompleteResults);

export default router;
