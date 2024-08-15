import { Router } from "express";
import { updateBook } from "src/controllers/book.controller";
import {
  createHotplace,
  deleteHotplace,
  getAllHotplace,
  getAutocompleteResults,
  getSingleHotplace,
} from "src/controllers/hotplace.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllHotplace);
router.get("/:hotplaceId", getSingleHotplace);
router.post("/", authMiddleware, createHotplace);
router.delete("/:hotplaceId", authMiddleware, deleteHotplace);
router.patch("/:hotplaceId", authMiddleware, updateBook);

router.get("/automatic-search/:keyword", getAutocompleteResults);

export default router;
