import { Router } from "express";
import { updateBook } from "src/controllers/book.controller";
import {
  createHotplace,
  deleteHotplace,
  getAllHotplace,
  getAutocompleteResults,
  getSingleHotplace,
} from "src/controllers/hotplace.controller";

const router = Router();

router.get("/", getAllHotplace);
router.get("/:hotplaceId", getSingleHotplace);
router.post("/", createHotplace);
router.delete("/:hotplaceId", deleteHotplace);
router.patch("/:hotplaceId", updateBook);

router.get("/automatic-search/:keyword", getAutocompleteResults);

export default router;
