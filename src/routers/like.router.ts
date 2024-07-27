import { Router } from "express";
import { getLikeUsers, toggleLike } from "src/controllers/like.controller";

const router = Router();

router.get("/:parentId", getLikeUsers);
router.patch("/:parentId", toggleLike);

export default router;
