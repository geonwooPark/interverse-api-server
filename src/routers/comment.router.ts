import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";

const router = Router();

router.get("/:parentId", getComments);
router.post("/", createComment);
router.delete("/commentId", deleteComment);
router.patch("/:commentId", updateComment);

export default router;
