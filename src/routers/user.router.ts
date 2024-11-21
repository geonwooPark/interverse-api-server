import { Router } from "express";
import {
  createUser,
  getCurrentUser,
  loginUser,
  sendVerificationEmail,
} from "../controllers/user.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.post("/login", loginUser);
router.post("/register", createUser);
router.get("/me", userGuardMiddleware, getCurrentUser);
router.post("/send-verification-email", sendVerificationEmail);

export default router;
