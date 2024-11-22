import { Router } from "express";
import {
  createUser,
  followUser,
  getCurrentUser,
  loginUser,
  sendVerificationEmail,
  unfollowUser,
} from "../controllers/user.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.post("/login", loginUser);
router.post("/register", createUser);
router.get("/me", userGuardMiddleware, getCurrentUser);
router.post("/send-verification-email", sendVerificationEmail);

// 팔로우, 언팔로우
router.post("/:id/follow", userGuardMiddleware, followUser);
router.delete("/:id/unfollow", userGuardMiddleware, unfollowUser);

export default router;
