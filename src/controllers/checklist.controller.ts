import { RequestHandler } from "express";
import Checklist, { ChecklistDocument } from "../models/checklist.model";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { connectDB } from "src/db";

export const getChecklist: RequestHandler = async (req, res) => {
  const { date } = req.params;

  try {
    await connectDB();
    const result = await Checklist.findOne<ChecklistDocument>({
      date,
    });
    if (!result || !result.list) {
      return res.status(200).json({ result: [] });
    }

    const checklist = result.list.reverse();

    return res.status(200).json({ checklist });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const createCheckitem: RequestHandler = async (req, res) => {
  const { value: text } = req.body;
  const today = dayjs().format("YYYY-MM-DD");

  if (!text) {
    return res.status(400).json({ error: "할 일을 입력해주세요." });
  }

  try {
    await connectDB();
    await Checklist.updateOne(
      {
        date: today,
      },
      {
        $push: {
          list: {
            id: uuid(),
            text,
            status: false,
          },
        },
      },
      // 문서가 없을 경우 생성
      { upsert: true }
    );

    return res.status(201).json({ message: "리스트 추가 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const deleteCheckitem: RequestHandler = async (req, res) => {
  const { itemId } = req.body;
  const today = dayjs().format("YYYY-MM-DD");

  try {
    await connectDB();
    await Checklist.updateOne(
      {
        date: today,
      },
      { $pull: { list: { id: itemId } } }
    );

    return res.status(200).json({ deletedId: itemId });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const updateCheckitem: RequestHandler = async (req, res) => {
  const { itemId, status } = req.body;
  const today = dayjs().format("YYYY-MM-DD");

  try {
    await connectDB();
    await Checklist.updateOne(
      {
        date: today,
      },
      { $set: { "list.$[elem].status": !status } },
      { arrayFilters: [{ "elem.id": itemId }] }
    );

    return res.status(200).json({ message: "리스트 상태 변경 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
