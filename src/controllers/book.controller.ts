import { RequestHandler } from "express";
import Book, { BookDocument } from "../models/book.model";
import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Like from "../models/like.model";

export const getAllBook: RequestHandler = async (req, res) => {
  try {
    const books = await Book.find<BookDocument>({});

    return res.status(200).json({ books });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getSingleBook: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  if (!bookId) {
    return res.status(400).json({ error: "id를 제공해주세요." });
  }

  try {
    const book = await Book.findOne<BookDocument>({
      _id: bookId,
    });

    if (!book) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createBook: RequestHandler = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    await Comment.create({
      parentId: newBook._id,
    });
    await ReplyComment.create({
      parentId: newBook._id,
    });
    await Like.create({
      parentId: newBook._id,
    });

    return res.status(201).json({ newBook });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const deleteBook: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  try {
    // 포함된 이미지 삭제

    await Book.findByIdAndDelete<BookDocument>(bookId);

    await Promise.all([
      Comment.findOneAndDelete({ parentId: bookId }),
      ReplyComment.findOneAndDelete({ parentId: bookId }),
      Like.findOneAndDelete({ parentId: bookId }),
    ]);

    return res.status(200).json({ deletedId: bookId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const updateBook: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  try {
    const updateResult = await Book.updateOne<BookDocument>(
      { _id: bookId },
      { ...req.body }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "해당 게시글을 찾을 수 없거나 수정되지 않았습니다." });
    }

    return res.status(200).json({ message: "글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
