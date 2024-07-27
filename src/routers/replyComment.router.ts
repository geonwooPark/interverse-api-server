import { Router } from "express";
import {
  createReplyComment,
  deleteReplyComment,
  getReplyComments,
  updateReplyComment,
} from "../controllers/replyComment.controller";

const router = Router();

router.get("/:parentId", getReplyComments);
router.post("/", createReplyComment);
router.delete("/:replyCommentId", deleteReplyComment);
router.patch("/:replyCommentId", updateReplyComment);

export default router;
