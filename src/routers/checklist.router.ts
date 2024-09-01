import { Router } from "express";
import {
  createCheckitem,
  deleteCheckitem,
  getChecklist,
  updateCheckitem,
} from "../controllers/checklist.controller";
import { adminGuardMiddleware } from "../middlewares/adminGuard.middleware";

const router = Router();

router.get("/:date", getChecklist);
router.post("/", adminGuardMiddleware, createCheckitem);
router.delete("/", adminGuardMiddleware, deleteCheckitem);
router.patch("/", adminGuardMiddleware, updateCheckitem);

export default router;
