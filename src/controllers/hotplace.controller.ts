import { RequestHandler } from "express";
import Hotplace, { HotplaceDocument } from "../models/hotplace.model";
import Comment from "../models/comment.model";
import ReplyComment from "../models/replyComment.model";
import Like from "../models/like.model";
import { connectDB } from "src/db";

export const getAllHotplace: RequestHandler = async (req, res) => {
  const { keyword, category, gu } = req.body;

  const categoryArr = category?.split(",");
  const guArr = gu?.split(",");

  const options = [
    keyword ? { store: { $regex: new RegExp(keyword, "i") } } : {},
    category ? { category: { $in: categoryArr } } : {},
    gu ? { gu: { $in: guArr } } : {},
  ];

  try {
    await connectDB();
    const hotplaces = await Hotplace.find<HotplaceDocument>({
      $and: options,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ hotplaces });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getSingleHotplace: RequestHandler = async (req, res) => {
  const { hotplaceId } = req.params;

  if (!hotplaceId) {
    return res.status(400).json({ error: "id를 제공해주세요." });
  }

  try {
    await connectDB();
    const hotplace = await Hotplace.findOne<HotplaceDocument>({
      _id: hotplaceId,
    });

    if (!hotplace) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." });
    }

    return res.status(200).json({ hotplace });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createHotplace: RequestHandler = async (req, res) => {
  try {
    await connectDB();
    const newHotplace = await Hotplace.create(req.body);

    await Comment.create({
      parentId: newHotplace._id,
    });
    await ReplyComment.create({
      parentId: newHotplace._id,
    });
    await Like.create({
      parentId: newHotplace._id,
    });

    return res.status(201).json({ newHotplace });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const deleteHotplace: RequestHandler = async (req, res) => {
  const { hotplaceId } = req.params;

  try {
    await connectDB();
    // 포함된 이미지 삭제

    await Hotplace.findByIdAndDelete<HotplaceDocument>(hotplaceId);

    await Promise.all([
      Comment.findOneAndDelete({ parentId: hotplaceId }),
      ReplyComment.findOneAndDelete({ parentId: hotplaceId }),
      Like.findOneAndDelete({ parentId: hotplaceId }),
    ]);

    return res.status(200).json({ deletedId: hotplaceId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const updateHotplace: RequestHandler = async (req, res) => {
  const { hotplaceId } = req.params;

  try {
    await connectDB();
    const updateResult = await Hotplace.updateOne<HotplaceDocument>(
      { _id: hotplaceId },
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

export const getAutocompleteResults: RequestHandler = async (req, res) => {
  const { keyword } = req.params;
  const regexPattern = new RegExp(`^${keyword}`, "i");

  try {
    await connectDB();
    const hotplaces = await Hotplace.find({
      store: { $regex: regexPattern },
    }).limit(5);

    return res.status(200).json({ hotplaces });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
