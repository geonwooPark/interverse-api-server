import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:parentId", getComments);
router.post("/", authMiddleware, createComment);
router.delete("/:commentId", authMiddleware, deleteComment);
router.patch("/:commentId", authMiddleware, updateComment);

export default router;
