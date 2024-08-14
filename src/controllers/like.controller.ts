import { RequestHandler } from "express";
import Like, { LikeDocument } from "../models/like.model";
import Posting, { PostingDocument } from "../models/posting.model";
import { connectDB } from "src/db";

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
  const { userId, userImage, userName } = req.body;

  try {
    await connectDB();
    const likes = await Like.findOne<LikeDocument>({ parentId });

    if (!likes) {
      return res
        .status(404)
        .json({ error: "좋아요 엔티티를 찾을 수 없습니다." });
    }

    const isLike = likes.likes.some((user) => user.userId === userId);

    if (isLike) {
      await Promise.all([
        Like.updateOne(
          {
            parentId,
          },
          { $pull: { likes: req.body } }
        ),
        Posting.findByIdAndUpdate<PostingDocument>(
          {
            _id: parentId,
          },
          {
            $inc: { likeCount: -1 },
          }
        ),
      ]);
    } else {
      await Promise.all([
        Like.updateOne(
          {
            parentId,
          },
          { $push: { likes: req.body } }
        ),
        Posting.findByIdAndUpdate<PostingDocument>(
          {
            _id: parentId,
          },
          {
            $inc: { likeCount: 1 },
          }
        ),
      ]);
    }

    return res.status(200).json({ isLike: !isLike });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
