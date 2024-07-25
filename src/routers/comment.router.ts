import { Router } from "express";
import { createComment, getComments } from "../controllers/comment.controller";

const router = Router();

router.get("/", getComments);
router.post("/", createComment);
// router.delete("/:id", deleteComment);
// router.patch("/:id", updateComment);

export default router;
