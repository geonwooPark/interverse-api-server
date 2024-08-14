import { RequestHandler } from "express";
import ReplyComment from "../models/replyComment.model";
import Posting from "../models/posting.model";
import { ReplyCommentDocument } from "../models/replyComment.model";
import { v4 as uuid } from "uuid";
import { PostingDocument } from "src/models/posting.model";
import { connectDB } from "src/db";

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

export const createReplyComment: RequestHandler = async (req, res) => {
  const { parentId, commentId, content } = req.body;

  try {
    await connectDB();
    const [updatedComment] = await Promise.all([
      ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
        { parentId },
        {
          $push: {
            comments: {
              commentId,
              replyCommentId: uuid(),
              user: {
                userImage: "",
                userId: "",
                userName: "",
              },
              createdAt: new Date(),
              content,
              likeCount: 0,
            },
          },
        },
        // new: 업데이트된 문서를 반환, upsert: 문서가 없으면 새로 생성
        { new: true, upsert: true }
      ),
      Posting.findByIdAndUpdate<PostingDocument>(
        {
          _id: parentId,
        },
        {
          $inc: { commentCount: 1 },
        }
      ),
    ]);

    return res.status(201).json({ updatedComment });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const deleteReplyComment: RequestHandler = async (req, res) => {
  const { replyCommentId } = req.params;
  const { parentId } = req.body;

  try {
    await connectDB();
    await Promise.all([
      ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
        {
          parentId,
        },
        { $pull: { comments: { replyCommentId } } }
      ),
      Posting.findByIdAndUpdate<PostingDocument>(
        {
          _id: parentId,
        },
        {
          $inc: { commentCount: -1 },
        }
      ),
      ,
    ]);

    return res.status(200).json({ deletedId: parentId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
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
