import { RequestHandler } from "express";
import Posting from "../models/posting.model";
import { PostingDocument } from "../models/posting.model";

export const getAllPosting: RequestHandler = async (req, res) => {
  try {
    const postings = await Posting.find<PostingDocument>({});

    return res.status(200).json(postings);
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getSinglePosting: RequestHandler = async (req, res) => {
  const { postingId } = req.params;

  if (!postingId) {
    return res.status(400).json({ error: "postingId를 제공해주세요." });
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

    return res.status(200).json(posting);
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
    const newPosting = await Posting.create<PostingDocument>(req.body);

    return res.status(201).json(newPosting);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePosting: RequestHandler = async (req, res) => {
  const { postingId } = req.params;

  try {
    await Posting.findByIdAndDelete<PostingDocument>(postingId);

    return res.status(200).json({ postingId, message: "글 삭제 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePosting: RequestHandler = async (req, res) => {
  const { postingId, category, title, description, thumbnailURL, content } =
    req.body;

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
      { category, title, description, thumbnailURL, content }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "해당 게시글을 찾을 수 없거나 수정되지 않았습니다." });
    }

    return res.status(200).json({ message: "글 수정 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
