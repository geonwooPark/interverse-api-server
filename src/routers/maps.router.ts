import { Router } from "express";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";
import { createMap, getMaps } from "@controllers/maps.controller";

const router = Router();

router.get("/", userGuardMiddleware, getMaps);
router.post("/", userGuardMiddleware, createMap);

export default router;
