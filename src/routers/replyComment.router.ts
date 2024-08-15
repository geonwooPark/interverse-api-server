import { Router } from "express";
import {
  createReplyComment,
  deleteReplyComment,
  getReplyComments,
  updateReplyComment,
} from "../controllers/replyComment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:parentId", getReplyComments);
router.post("/", authMiddleware, createReplyComment);
router.delete("/:replyCommentId", authMiddleware, deleteReplyComment);
router.patch("/:replyCommentId", authMiddleware, updateReplyComment);

export default router;
