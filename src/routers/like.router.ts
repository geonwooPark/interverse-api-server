import { Router } from "express";
import { getLikeUsers, toggleLike } from "../controllers/like.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:parentId", getLikeUsers);
router.patch("/:parentId", authMiddleware, toggleLike);

export default router;
