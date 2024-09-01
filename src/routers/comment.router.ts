import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/:parentId", getComments);
router.post("/", userGuardMiddleware, createComment);
router.delete("/:commentId", userGuardMiddleware, deleteComment);
router.patch("/:commentId", userGuardMiddleware, updateComment);

export default router;
