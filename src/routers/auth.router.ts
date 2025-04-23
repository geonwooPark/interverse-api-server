import { Router } from "express";
import {
  changePassword,
  checkId,
  checkVerificationCode,
  createUser,
  getCurrentUser,
  loginUser,
  sendVerificationEmail,
} from "../controllers/auth.controller";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";

const router = Router();

router.post("/login", loginUser);
router.post("/signup", createUser);
router.get("/me", userGuardMiddleware, getCurrentUser);
router.post("/send-verification-email", sendVerificationEmail);
router.post("/check-verification-code", checkVerificationCode);
router.post("/check-id", checkId);
router.patch("/change-password", changePassword);

export default router;
