import { RequestHandler } from "express";
import Posting from "../models/posting.model";
import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Like from "../models/like.model";
import { PostingDocument } from "../models/posting.model";

export const getAllPosting: RequestHandler = async (req, res) => {
  try {
    const postings = await Posting.find<PostingDocument>({});

    return res.status(200).json({ postings });
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
    const posting = await Posting.findByIdAndUpdate<PostingDocument>(
      {
        _id: postingId,
      },
      {
        $inc: { views: 1 },
      }
    );

    if (!posting) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json({ posting });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createPosting: RequestHandler = async (req, res) => {
  const { category, title, description } = req.body;

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

  try {
    const newPosting = await Posting.create(req.body);

    await Promise.all([
      Comment.create({
        parentId: newPosting._id,
        title: newPosting.title,
      }),
      ReplyComment.create({
        parentId: newPosting._id,
        title: newPosting.title,
      }),
      Like.create({
        parentId: newPosting._id,
        title: newPosting.title,
      }),
    ]);

    return res.status(201).json({ newPosting });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const deletePosting: RequestHandler = async (req, res) => {
  const { postingId } = req.params;

  try {
    await Posting.findByIdAndDelete<PostingDocument>(postingId);

    // 포함된 이미지 삭제

    await Promise.all([
      Comment.findOneAndDelete({ parentId: postingId }),
      ReplyComment.findOneAndDelete({ parentId: postingId }),
      Like.findOneAndDelete({ parentId: postingId }),
    ]);

    return res.status(200).json({ deletedId: postingId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const updatePosting: RequestHandler = async (req, res) => {
  const { postingId } = req.params;
  const { category, title, description } = req.body;

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

  try {
    const updateResult = await Posting.updateOne<PostingDocument>(
      { _id: postingId },
      { ...req.body }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "해당 게시글을 찾을 수 없거나 수정되지 않았습니다." });
    }

    return res.status(200).json({ message: "글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getNewPostings: RequestHandler = async (req, res) => {
  const { limit } = req.query;

  try {
    const postings = await Posting.find<PostingDocument>({})
      .sort({
        createdAt: -1,
      })
      .limit(parseInt(limit as string) || 5);

    return res.status(200).json({ postings });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
