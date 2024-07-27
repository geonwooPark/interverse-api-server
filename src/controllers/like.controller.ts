import { RequestHandler } from "express";
import Like, { LikeDocument } from "../models/like.model";

export const getLikeUsers: RequestHandler = async (req, res) => {
  const { parentId } = req.params;

  try {
    const likes = await Like.findOne<LikeDocument>({ parentId });

    return res.status(200).json({ likes: likes || [] });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const toggleLike: RequestHandler = async (req, res) => {
  const { parentId } = req.params;
  const { userId } = req.body;

  try {
    const likes = await Like.findOne<LikeDocument>({ parentId });

    if (!likes) {
      return res
        .status(404)
        .json({ error: "좋아요 엔티티를 찾을 수 없습니다." });
    }
    const isLike = likes.likes.includes(userId);

    await Like.updateOne(
      {
        parentId,
      },
      isLike ? { $pull: { userId } } : { $push: { userId } }
    );

    return res.status(200).json({ isLike: !isLike });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
