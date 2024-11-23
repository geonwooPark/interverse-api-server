import { RequestHandler } from "express";
import Like, { LikeDocument } from "../models/like.model";
import Posting, { PostingDocument } from "../models/posting.model";
import { connectDB } from "../db";
import mongoose from "mongoose";

export const getLikeUsers: RequestHandler = async (req, res) => {
  const { parentId } = req.params;

  try {
    await connectDB();
    const likes = await Like.findOne<LikeDocument>({ parentId });

    return res.status(200).json({ likes: likes || [] });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const toggleLike: RequestHandler = async (req, res) => {
  const { parentId } = req.params;
  const { userId } = req.body;

  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const likes = await Like.findOne<LikeDocument>({ parentId }).session(
      session
    );

    if (!likes) {
      throw new Error("좋아요 엔티티를 찾을 수 없습니다.");
    }

    const isLike = likes.likes.some((user) => user.userId === userId);

    if (isLike) {
      await Promise.all([
        Like.updateOne(
          {
            parentId,
          },
          { $pull: { likes: req.body } },
          { session }
        ),
        Posting.findByIdAndUpdate<PostingDocument>(
          {
            _id: parentId,
          },
          {
            $inc: { likeCount: -1 },
          },
          { session }
        ),
      ]);
    } else {
      await Promise.all([
        Like.updateOne(
          {
            parentId,
          },
          { $push: { likes: req.body } },
          { session }
        ),
        Posting.findByIdAndUpdate<PostingDocument>(
          {
            _id: parentId,
          },
          {
            $inc: { likeCount: 1 },
          },
          { session }
        ),
      ]);
    }

    await session.commitTransaction();

    return res.status(200).json({ isLike: !isLike });
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof Error) {
      if (error.message === "좋아요 엔티티를 찾을 수 없습니다.") {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "서버 내부 오류" });
    }
  } finally {
    session.endSession();
  }
};
