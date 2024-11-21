import { RequestHandler } from "express";
import Comment, { CommentDocument } from "../models/comment.model";
import Like, { LikeDocument } from "../models/like.model";
import ReplyComment, {
  ReplyCommentDocument,
} from "../models/replyComment.model";

import { connectDB } from "../db";

export const getMyComments: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    await connectDB();
    const [myComments, myReplyComments] = await Promise.all([
      Comment.find<CommentDocument>({
        comments: {
          $elemMatch: {
            "user.userId": userId,
          },
        },
      }),
      ReplyComment.find<ReplyCommentDocument>({
        comments: {
          $elemMatch: {
            "user.userId": userId,
          },
        },
      }),
    ]);

    const comments = [];
    for (const comment of myComments) {
      comments.push(...comment.comments);
    }
    for (const comment of myReplyComments) {
      comments.push(...comment.comments);
    }

    const result = comments
      .filter((comment) => comment.user.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return res.status(200).json({ comments: result });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getLikedPost: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    await connectDB();
    const likedPost = await Like.find<LikeDocument>({
      likes: {
        $elemMatch: {
          userId,
        },
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ likedPost });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
