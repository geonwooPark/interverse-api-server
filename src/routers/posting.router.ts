import { Router } from "express";
import {
  getAllPosting,
  getSinglePosting,
  createPosting,
  deletePosting,
  updatePosting,
  getNewPostings,
} from "../controllers/posting.controller";

const router = Router();

router.get("/", getAllPosting);
router.get("/:postingId", getSinglePosting);
router.post("/", createPosting);
router.delete("/:postingId", deletePosting);
router.patch("/:postingId", updatePosting);

router.get("/new-arrivals", getNewPostings);

export default router;
