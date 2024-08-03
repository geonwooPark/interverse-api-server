import { RequestHandler } from "express";
import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Posting from "../models/posting.model";
import { CommentDocument } from "../models/comment.model";
import { v4 as uuid } from "uuid";
import { PostingDocument } from "src/models/posting.model";

export const getComments: RequestHandler = async (req, res) => {
  const { parentId } = req.params;

  try {
    const comments = await Comment.findOne<CommentDocument>({ parentId });

    return res
      .status(200)
      .json({ comments: comments ? comments.comments : [] });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createComment: RequestHandler = async (req, res) => {
  const { parentId, content } = req.body;

  try {
    const [updatedComment] = await Promise.all([
      Comment.findOneAndUpdate<CommentDocument>(
        { parentId },
        {
          $push: {
            comments: {
              commentId: uuid(),
              user: {
                userImage: "",
                userId: "",
                userName: "",
              },
              createdAt: new Date(),
              content,
              likeCount: 0,
              isDeleted: false,
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
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { commentId } = req.params;
  const { parentId } = req.body;

  try {
    // 댓글에 답글이 있다면 isDeleted만 변경하고 댓글이 없다면 삭제
    const replyComment = await ReplyComment.findOne<CommentDocument>(
      {
        parentId,
      },
      {
        comments: {
          $elemMatch: {
            commentId,
          },
        },
      }
    );

    await Promise.all([
      replyComment?.comments.length !== 0
        ? Comment.findOneAndUpdate<CommentDocument>(
            {
              parentId,
            },
            { $set: { "comments.$[elem].isDeleted": true } },
            { arrayFilters: [{ "elem.commentId": commentId }] }
          )
        : Comment.findOneAndUpdate<CommentDocument>(
            {
              parentId,
            },
            { $pull: { comments: { commentId } } }
          ),
      Posting.findByIdAndUpdate<PostingDocument>(
        {
          _id: parentId,
        },
        {
          $inc: { commentCount: -1 },
        }
      ),
    ]);

    return res.status(200).json({ deletedId: parentId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const updateComment: RequestHandler = async (req, res) => {
  const { commentId } = req.params;
  const { parentId, content } = req.body;

  try {
    await Comment.findOneAndUpdate<CommentDocument>(
      {
        parentId,
      },
      { $set: { "comments.$[elem].content": content } },
      { arrayFilters: [{ "elem.commentId": commentId }] }
    );

    return res.status(200).json({ message: "댓글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
