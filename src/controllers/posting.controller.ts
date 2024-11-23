import { RequestHandler } from "express";
import Posting from "../models/posting.model";
import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Like from "../models/like.model";
import { PostingDocument } from "../models/posting.model";
import { CustomRequest } from "src/middlewares/userGuard.middleware";
import { connectDB } from "../db";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export const getAllPosting: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const postings = await Posting.find<PostingDocument>({});
    const totalCount = await Posting.countDocuments({});

    return res.status(200).json({ postings, totalCount });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getSinglePosting: RequestHandler = async (req, res) => {
  const { postingId } = req.params;

  if (!postingId) {
    return res.status(400).json({ error: "id를 제공해주세요." });
  }

  try {
    await connectDB();
    const posting = await Posting.findByIdAndUpdate<PostingDocument>(
      postingId,
      {
        $inc: { viewCount: 1 },
      },
      { new: true }
    );

    if (!posting) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json({ posting });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createPosting: RequestHandler = async (
  req: CustomRequest,
  res
) => {
  const { category, title, description } = req.body;
  const { id } = req.auth as JwtPayload;

  if (!category) {
    return res.status(406).json({ error: "카테고리를 입력해주세요." });
  }
  if (!title) {
    return res.status(406).json({ error: "제목을 입력해주세요." });
  }
  if (title.length > 40) {
    return res.status(406).json({ error: "제목은 40자 이하로 입력해주세요." });
  }
  if (description && description.length > 90) {
    return res.status(406).json({ error: "설명은 90자 이하로 입력해주세요." });
  }

  await connectDB();
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [newPosting] = await Posting.create([{ ...req.body, userId: id }], {
      session,
    });

    await Promise.all([
      Comment.create([{ parentId: newPosting._id }], {
        session,
      }),
      ReplyComment.create([{ parentId: newPosting._id }], { session }),
      Like.create([{ parentId: newPosting._id }], {
        session,
      }),
      ,
    ]);

    await session.commitTransaction();

    return res.status(201).json({ newPosting });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({ error: "서버 내부 오류" });
  } finally {
    session.endSession();
  }
};

export const deletePosting: RequestHandler = async (
  req: CustomRequest,
  res
) => {
  const { postingId } = req.params;
  const { id } = req.auth as JwtPayload;

  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const posting = await Posting.findById<PostingDocument>(postingId).session(
      session
    );

    if (!posting) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (posting.userId !== id) {
      throw new Error("작성자만 삭제할 수 있습니다.");
    }

    await Posting.findByIdAndDelete<PostingDocument>(postingId).session(
      session
    );

    // 포함된 이미지 삭제

    await Promise.all([
      Comment.findOneAndDelete({ parentId: postingId }, { session }),
      ReplyComment.findOneAndDelete({ parentId: postingId }, { session }),
      Like.findOneAndDelete({ parentId: postingId }, { session }),
    ]);

    await session.commitTransaction();

    return res.status(200).json({ deletedId: postingId });
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof Error) {
      if (error.message === "게시글을 찾을 수 없습니다.") {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === "작성자만 삭제할 수 있습니다.") {
        return res.status(403).json({ error: error.message });
      }

      return res.status(500).json({ error: "서버 내부 오류" });
    }
  } finally {
    session.endSession();
  }
};

export const updatePosting: RequestHandler = async (
  req: CustomRequest,
  res
) => {
  const { postingId } = req.params;
  const { category, title, description } = req.body;
  const { id } = req.auth as JwtPayload;

  if (!category) {
    return res.status(406).json({ error: "카테고리를 입력해주세요." });
  }
  if (!title) {
    return res.status(406).json({ error: "제목을 입력해주세요." });
  }
  if (title.length > 40) {
    return res.status(406).json({ error: "제목은 40자 이하로 입력해주세요." });
  }
  if (description && description.length > 90) {
    return res.status(406).json({ error: "설명은 90자 이하로 입력해주세요." });
  }

  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const posting = await Posting.findById<PostingDocument>(postingId).session(
      session
    );

    if (!posting) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    if (posting.userId !== id) {
      throw new Error("작성자만 삭제할 수 있습니다.");
    }

    const updatedData = { category, title, description };

    const updateResult = await Posting.findByIdAndUpdate(
      postingId,
      updatedData,
      {
        new: true,
        session,
      }
    );

    if (!updateResult) {
      throw new Error("해당 게시글을 찾을 수 없거나 수정되지 않았습니다.");
    }

    await session.commitTransaction();

    return res
      .status(200)
      .json({ message: "글 수정 성공!", posting: updateResult });
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof Error) {
      if (
        error.message === "해당 게시글을 찾을 수 없거나 수정되지 않았습니다."
      ) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "서버 내부 오류" });
    }
  } finally {
    session.endSession();
  }
};

export const getNewPostings: RequestHandler = async (req, res) => {
  const { limit } = req.query;

  try {
    await connectDB();

    const safeLimit = Number(limit) && Number(limit) > 0 ? Number(limit) : 20;

    const postings = await Posting.find<PostingDocument>({})
      .sort({
        createdAt: -1,
      })
      .limit(safeLimit);

    return res.status(200).json({ postings });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
