import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBook,
  getSingleBook,
  updateBook,
} from "../controllers/book.controller";
import { adminGuardMiddleware } from "../middlewares/adminGuard.middleware";

const router = Router();

router.get("/", getAllBook);
router.get("/:bookId", getSingleBook);
router.post("/", adminGuardMiddleware, createBook);
router.delete("/:bookId", adminGuardMiddleware, deleteBook);
router.patch("/:bookId", adminGuardMiddleware, updateBook);

export default router;
