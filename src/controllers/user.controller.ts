import { RequestHandler } from "express";
import Comment, { CommentDocument } from "../models/comment.model";
import Like, { LikeDocument } from "../models/like.model";
import User, { UserDocument } from "../models/user.model";
import ReplyComment, {
  ReplyCommentDocument,
} from "../models/replyComment.model";
import bcryptjs from "bcryptjs";
import { getToken } from "../utils/jwt";
import { connectDB } from "../db";
import { CustomRequest } from "../middlewares/userGuard.middleware";
import { JwtPayload } from "jsonwebtoken";
import { userDto } from "../dto/user.dto";
import { CreateUserSchema, LoginSchema } from "../utils/vaildateSchemas";
import * as yup from "yup";

export const createUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = await CreateUserSchema.validate(req.body);

    const { email, password, nickname } = validatedData;

    const hashedPassword = await bcryptjs.hash(password, 12);

    await connectDB();
    const existedUser = await User.findOne<UserDocument>({ email });
    if (existedUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    await User.create({ nickname, email, password: hashedPassword, image: "" });

    return res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.errors.join(", ");
      return res.status(400).json({ message: validationErrors });
    }

    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = await LoginSchema.validate(req.body);

    const { email, password } = validatedData;

    await connectDB();
    const user = await User.findOne<UserDocument>({ email });
    if (!user) {
      return res.status(409).json({ message: "존재하지 않는 회원입니다." });
    }

    const pwcheck = await bcryptjs.compare(password, user.password);
    if (!pwcheck) {
      return res.status(409).json({ message: "잘못된 비밀번호입니다." });
    }

    const payload = {
      email: user.email,
      role: user.role,
    };

    return res.status(200).send({ token: getToken(payload) });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.errors.join(", ");
      return res.status(400).json({ message: validationErrors });
    }

    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getCurrentUser: RequestHandler = async (
  req: CustomRequest,
  res
) => {
  const { email } = req.auth as JwtPayload;

  try {
    await connectDB();
    const userDoc = await User.findOne<UserDocument>({ email });
    if (!userDoc) {
      return res.status(409).json({ message: "존재하지 않는 회원입니다." });
    }

    const user = userDto(userDoc);

    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).json({ error: "서버 내부 오류" });
  }
};

export const getMyComments: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    await connectDB();
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
    await connectDB();
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
