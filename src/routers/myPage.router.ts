import { Router } from "express";
import { getLikedPost, getMyComments } from "../controllers/myPage.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.get("/my-comment/:userId", userGuardMiddleware, getMyComments);
router.get("/liked-post/:userId", userGuardMiddleware, getLikedPost);

export default router;
