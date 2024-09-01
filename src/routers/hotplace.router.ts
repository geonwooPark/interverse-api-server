import { Router } from "express";
import {
  createHotplace,
  deleteHotplace,
  updateHotplace,
  getAllHotplace,
  getAutocompleteResults,
  getSingleHotplace,
} from "../controllers/hotplace.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/", getAllHotplace);
router.get("/:hotplaceId", getSingleHotplace);
router.post("/", userGuardMiddleware, createHotplace);
router.delete("/:hotplaceId", userGuardMiddleware, deleteHotplace);
router.patch("/:hotplaceId", userGuardMiddleware, updateHotplace);

router.get("/automatic-search/:keyword", getAutocompleteResults);

export default router;
