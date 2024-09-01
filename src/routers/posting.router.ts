import { Router } from "express";
import {
  getAllPosting,
  getSinglePosting,
  createPosting,
  deletePosting,
  updatePosting,
  getNewPostings,
} from "../controllers/posting.controller";
import { adminGuardMiddleware } from "../middlewares/adminGuard.middleware";

const router = Router();

router.get("/", getAllPosting);
router.get("/:postingId", getSinglePosting);
router.post("/", adminGuardMiddleware, createPosting);
router.delete("/:postingId", adminGuardMiddleware, deletePosting);
router.patch("/:postingId", adminGuardMiddleware, updatePosting);

router.get("/new-arrivals", getNewPostings);

export default router;
