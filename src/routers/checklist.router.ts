import { Router } from "express";
import {
  createCheckitem,
  deleteCheckitem,
  getChecklist,
  updateCheckitem,
} from "../controllers/checklist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:date", getChecklist);
router.post("/", authMiddleware("admin"), createCheckitem);
router.delete("/", authMiddleware("admin"), deleteCheckitem);
router.patch("/", authMiddleware("admin"), updateCheckitem);

export default router;
