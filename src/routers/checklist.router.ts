import { Router } from "express";
import {
  createCheckitem,
  deleteCheckitem,
  getChecklist,
  updateCheckitem,
} from "../controllers/checklist.controller";

const router = Router();

router.get("/:date", getChecklist);
router.post("/", createCheckitem);
router.delete("/", deleteCheckitem);
router.patch("/", updateCheckitem);

export default router;
