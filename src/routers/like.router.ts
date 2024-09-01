import { Router } from "express";
import { getLikeUsers, toggleLike } from "../controllers/like.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/:parentId", getLikeUsers);
router.patch("/:parentId", userGuardMiddleware, toggleLike);

export default router;
