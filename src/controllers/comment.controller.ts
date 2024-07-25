import { RequestHandler } from "express";
import Comment from "../models/comment.model";
import { CommentDocument } from "../models/comment.model";
import { v4 as uuid } from "uuid";

export const getComments: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find<CommentDocument>({ parrentId: id });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createComment: RequestHandler = async (req, res) => {
  const { id, content } = req.body;

  try {
    const updatedComment = await Comment.findOneAndUpdate<CommentDocument>(
      { parrentId: id },
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
            like: 0,
            deleted: false,
          },
        },
      },
      // new: 업데이트된 문서를 반환, upsert: 문서가 없으면 새로 생성
      { new: true, upsert: true }
    );

    return res.status(201).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment: RequestHandler = async (req, res) => {
  const { id, commentId } = req.body;

  try {
    // const replyComment = await ReplyComment.find<CommentDocument>(
    //   {
    //     parrentId: id,
    //   },
    //   {
    //     user: {
    //       $elemMatch: {
    //         commentId,
    //       },
    //     },
    //   }
    // );

    // await Comment.findOneAndUpdate<CommentDocument>(
    //   {
    //     parrentId: id,
    //   },
    //   replyComment[0].comments.length !== 0
    //     ? { $set: { "comments.$[elem].isDeleted": true } }
    //     : { $pull: { comments: { commentId } } },
    //   { arrayFilters: [{ "elem.commentId": commentId }], new: true }
    // );

    return res.status(200).json({ id });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComment: RequestHandler = async (req, res) => {
  const { id, commentId, content } = req.body;

  try {
    await Comment.findOneAndUpdate<CommentDocument>(
      {
        parrentId: id,
      },
      { $set: { "comments.$[elem].content": content } },
      { arrayFilters: [{ "elem.commentId": commentId }] }
    );

    return res.status(200).json({ message: "댓글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
