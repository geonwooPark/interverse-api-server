import { Router } from "express";
import { getLikedPost, getMyComments } from "../controllers/user.controller";

const router = Router();

router.get("/login", getMyComments);
router.post("/register", getMyComments);

router.get("/my-comment/:userId", getMyComments);
router.get("/liked-post/:userId", getLikedPost);

export default router;
