import { Router } from "express";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";
import {
  checkPassword,
  createRoom,
  deleteRoom,
  getRooms,
  getSingleRoom,
  joinRoom,
} from "@controllers/rooms.controller";

const router = Router();

router.get("/", userGuardMiddleware, getRooms);
router.get("/:roomId", userGuardMiddleware, getSingleRoom);
router.post("/", userGuardMiddleware, createRoom);
router.post("/:roomId/join", userGuardMiddleware, joinRoom);
router.delete("/:roomId", userGuardMiddleware, deleteRoom);
router.post("/:roomId/check-password", userGuardMiddleware, checkPassword);

export default router;
