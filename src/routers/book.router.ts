import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBook,
  getSingleBook,
  updateBook,
} from "src/controllers/book.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllBook);
router.get("/:bookId", getSingleBook);
router.post("/", authMiddleware("admin"), createBook);
router.delete("/:bookId", authMiddleware("admin"), deleteBook);
router.patch("/:bookId", authMiddleware("admin"), updateBook);

export default router;
