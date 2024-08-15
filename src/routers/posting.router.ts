import { Router } from "express";
import {
  getAllPosting,
  getSinglePosting,
  createPosting,
  deletePosting,
  updatePosting,
  getNewPostings,
} from "../controllers/posting.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllPosting);
router.get("/:postingId", getSinglePosting);
router.post("/", authMiddleware("admin"), createPosting);
router.delete("/:postingId", authMiddleware("admin"), deletePosting);
router.patch("/:postingId", authMiddleware("admin"), updatePosting);

router.get("/new-arrivals", getNewPostings);

export default router;
