import { checkHealth } from "@controllers/checkHealth.controller";
import { Router } from "express";

const router = Router();

router.get("/", checkHealth);

export default router;
