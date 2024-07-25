import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";

const router = Router();

router.get("/", getComments);
router.post("/", createComment);
router.delete("/:id", deleteComment);
router.patch("/:id", updateComment);

export default router;
