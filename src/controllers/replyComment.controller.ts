import { RequestHandler } from "express";
import ReplyComment from "../models/replyComment.model";
import Posting from "../models/posting.model";
import { ReplyCommentDocument } from "../models/replyComment.model";
import { v4 as uuid } from "uuid";
import { PostingDocument } from "src/models/posting.model";
import { connectDB } from "../db";
import { CustomRequest } from "src/middlewares/userGuard.middleware";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export const getReplyComments: RequestHandler = async (req, res) => {
  const { parentId } = req.params;

  try {
    await connectDB();
    const replyComments = await ReplyComment.findOne<ReplyCommentDocument>({
      parentId,
    });

    return res
      .status(200)
      .json({ replyComments: replyComments ? replyComments.comments : [] });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createReplyComment: RequestHandler = async (
  req: CustomRequest,
  res
) => {
  const { parentId, commentId, content } = req.body;
  const { image: userImage, email: userEmail } = req.auth as JwtPayload;

  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const [updatedComment] = await Promise.all([
      ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
        { parentId },
        {
          $push: {
            comments: {
              commentId,
              replyCommentId: uuid(),
              user: {
                userImage,
                userEmail,
              },
              createdAt: new Date(),
              content,
            },
          },
        },
        { new: true, upsert: true, session }
      ),
      Posting.findByIdAndUpdate<PostingDocument>(
        {
          _id: parentId,
        },
        {
          $inc: { commentCount: 1 },
        },
        { session }
      ),
    ]);

    await session.commitTransaction();

    return res.status(201).json({ updatedComment });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({ error: "서버 내부 오류" });
  } finally {
    session.endSession();
  }
};

export const deleteReplyComment: RequestHandler = async (req, res) => {
  const { replyCommentId } = req.params;
  const { parentId } = req.body;

  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    await Promise.all([
      ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
        {
          parentId,
        },
        { $pull: { comments: { replyCommentId } } },
        { session }
      ),
      Posting.findByIdAndUpdate<PostingDocument>(
        {
          _id: parentId,
        },
        {
          $inc: { commentCount: -1 },
        },
        { session }
      ),
    ]);

    await session.commitTransaction();

    return res.status(200).json({ deletedId: parentId });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({ error: "서버 내부 오류" });
  } finally {
    session.endSession();
  }
};

export const updateReplyComment: RequestHandler = async (req, res) => {
  const { replyCommentId } = req.params;
  const { parentId, content } = req.body;

  try {
    await connectDB();
    await ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
      {
        parentId,
      },
      { $set: { "comments.$[elem].content": content } },
      { arrayFilters: [{ "elem.replyCommentId": replyCommentId }] }
    );

    return res.status(200).json({ message: "댓글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
