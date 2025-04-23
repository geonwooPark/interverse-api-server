import { Router } from "express";
import { userGuardMiddleware } from "../middlewares/userGuard.middleware";
import {
  createRoom,
  deleteRoom,
  getRooms,
  joinRoom,
} from "../controllers/rooms.controller";

const router = Router();

router.get("/", userGuardMiddleware, getRooms);
router.post("/", userGuardMiddleware, createRoom);
router.post("/:roomId/join", userGuardMiddleware, joinRoom);
router.delete("/:roomId", userGuardMiddleware, deleteRoom);

export default router;
