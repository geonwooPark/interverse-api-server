import { RequestHandler } from "express";
import Comment, { CommentDocument } from "../models/comment.model";
import ReplyComment, {
  ReplyCommentDocument,
} from "../models/replyComment.model";
import bcrypt from "bcrypt";

export const createUser: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
  const hashedPassword = await bcrypt.hash(password, 12);

  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    return res.json(409).json({ message: "빈칸을 모두 입력해주세요." });
  }
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { message: "잘못된 이메일 형식입니다." },
      { status: 409 }
    );
  }
  if (name.length > 10) {
    return NextResponse.json(
      { message: "이름은 10자 이하로 입력해주세요." },
      { status: 409 }
    );
  }
  if (parseInt(password.length, 10) < 8 || !passwordRegex.test(password)) {
    return NextResponse.json(
      {
        message: "비밀번호는 영문을 포함하여 8~15자리이어야 합니다.",
      },
      { status: 409 }
    );
  }

  try {
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getMyComments: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
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
    // return res.status(200).json({ likedPost: result });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
