import { Router } from "express";
import {
  createUser,
  getLikedPost,
  getMyComments,
  getAuth,
} from "../controllers/user.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.post("/login", getAuth);
router.post("/register", createUser);

router.get("/my-comment/:userId", userGuardMiddleware, getMyComments);
router.get("/liked-post/:userId", userGuardMiddleware, getLikedPost);

export default router;
