import { RequestHandler } from "express";
import Comment, { CommentDocument } from "../models/comment.model";
import Like, { LikeDocument } from "../models/like.model";
import User, { UserDocument } from "../models/user.model";
import ReplyComment, {
  ReplyCommentDocument,
} from "../models/replyComment.model";
import bcrypt from "bcrypt";
import { getToken } from "../utils/jwt";

export const createUser: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
  const hashedPassword = await bcrypt.hash(password, 12);

  if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(409).json({ message: "빈칸을 모두 입력해주세요." });
  }
  if (!emailRegex.test(email)) {
    return res.status(409).json({ message: "잘못된 이메일 형식입니다." });
  }
  if (name.length > 10) {
    return res
      .status(409)
      .json({ message: "이름은 10자 이하로 입력해주세요." });
  }
  if (parseInt(password.length, 10) < 8 || !passwordRegex.test(password)) {
    return res
      .status(409)
      .json({ message: "비밀번호는 영문을 포함하여 8~15자리이어야 합니다." });
  }

  try {
    const existedUser = await User.findOne<UserDocument>({ email });
    if (existedUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    await User.create({ name, email, password: hashedPassword, image: "" });

    return res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getAuth: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (email.trim() === "" || password.trim() === "") {
    return res.status(409).json({ message: "빈칸을 모두 입력해주세요." });
  }

  try {
    const user = await User.findOne<UserDocument>({ email });
    if (!user) {
      return res.status(409).json({ message: "존재하지 않는 회원입니다." });
    }

    const pwcheck = await bcrypt.compare(password, user.password);
    if (!pwcheck) {
      return res.status(409).json({ message: "잘못된 비밀번호입니다." });
    }

    // dto 필요해보임
    const payload = {
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
    };

    return res.status(200).send({ token: getToken(payload) });
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
    const likedPost = await Like.find<LikeDocument>({
      likes: {
        $elemMatch: {
          userId,
        },
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ likedPost });
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};
