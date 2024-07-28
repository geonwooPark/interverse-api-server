import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBook,
  getSingleBook,
  updateBook,
} from "src/controllers/book.controller";

const router = Router();

router.get("/", getAllBook);
router.get("/:bookId", getSingleBook);
router.post("/", createBook);
router.delete("/:bookId", deleteBook);
router.patch("/:bookId", updateBook);

export default router;
