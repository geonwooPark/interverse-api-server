import { Router } from "express";
import {
  createReplyComment,
  deleteReplyComment,
  getReplyComments,
  updateReplyComment,
} from "../controllers/replyComment.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/:parentId", getReplyComments);
router.post("/", userGuardMiddleware, createReplyComment);
router.delete("/:replyCommentId", userGuardMiddleware, deleteReplyComment);
router.patch("/:replyCommentId", userGuardMiddleware, updateReplyComment);

export default router;
