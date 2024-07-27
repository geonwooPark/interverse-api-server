import { RequestHandler } from "express";
import ReplyComment from "../models/replyComment.model";
import { ReplyCommentDocument } from "../models/replyComment.model";
import { v4 as uuid } from "uuid";

export const getReplyComments: RequestHandler = async (req, res) => {
  const { parentId } = req.params;

  try {
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
    const updatedComment =
      await ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
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
              like: 0,
              deleted: false,
            },
          },
        },
        // new: 업데이트된 문서를 반환, upsert: 문서가 없으면 새로 생성
        { new: true, upsert: true }
      );

    return res.status(201).json({ updatedComment });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReplyComment: RequestHandler = async (req, res) => {
  const { replyCommentId } = req.params;
  const { parentId } = req.body;

  try {
    await ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
      {
        parentId,
      },
      { $pull: { comments: { replyCommentId } } },
      { arrayFilters: [{ "elem.commentId": replyCommentId }], new: true }
    );

    return res.status(200).json({ deletedId: parentId });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReplyComment: RequestHandler = async (req, res) => {
  const { replyCommentId } = req.params;
  const { parentId, content } = req.body;

  try {
    await ReplyComment.findOneAndUpdate<ReplyCommentDocument>(
      {
        parentId,
      },
      { $set: { "comments.$[elem].content": content } },
      { arrayFilters: [{ "elem.replyCommentId": replyCommentId }] }
    );

    return res.status(200).json({ message: "댓글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
