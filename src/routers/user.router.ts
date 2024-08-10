import { Router } from "express";
import {
  createUser,
  getLikedPost,
  getMyComments,
  getAuth,
} from "../controllers/user.controller";

const router = Router();

router.post("/login", getAuth);
router.post("/register", createUser);

router.get("/my-comment/:userId", getMyComments);
router.get("/liked-post/:userId", getLikedPost);

export default router;
