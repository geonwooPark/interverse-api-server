import { Router } from "express";
import {
  getAllPosting,
  getSinglePosting,
  createPosting,
  deletePosting,
  updatePosting,
  getNewPostings,
} from "../controllers/posting.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/", getAllPosting);
router.get("/:postingId", getSinglePosting);
router.post("/", userGuardMiddleware, createPosting);
router.delete("/:postingId", userGuardMiddleware, deletePosting);
router.patch("/:postingId", userGuardMiddleware, updatePosting);

router.get("/new-arrivals", getNewPostings);

export default router;
