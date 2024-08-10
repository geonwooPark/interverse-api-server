import { Router } from "express";
import {
  createUser,
  getLikedPost,
  getMyComments,
  getAuth,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", getAuth);
router.post("/register", createUser);

router.get("/my-comment/:userId", authMiddleware, getMyComments);
router.get("/liked-post/:userId", authMiddleware, getLikedPost);

export default router;
