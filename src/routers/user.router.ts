import { Router } from "express";
import {
  createUser,
  getCurrentUser,
  getLikedPost,
  getMyComments,
  loginUser,
} from "../controllers/user.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.post("/login", loginUser);
router.post("/register", createUser);

router.get("/me", userGuardMiddleware, getCurrentUser);
router.get("/my-comment/:userId", userGuardMiddleware, getMyComments);
router.get("/liked-post/:userId", userGuardMiddleware, getLikedPost);

export default router;
