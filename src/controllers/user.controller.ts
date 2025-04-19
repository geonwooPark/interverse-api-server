import { RequestHandler } from "express";
import User, { UserDocument } from "../models/user.model";
import TempUser from "../models/tempUser.model";
import bcryptjs from "bcryptjs";
import { getToken } from "../utils/jwt";
import { connectDB } from "../db";
import { CustomRequest } from "../middlewares/userGuard.middleware";
import { JwtPayload } from "jsonwebtoken";
import { userDto } from "../dto/user.dto";
import { CreateUserSchema, LoginSchema } from "../utils/vaildateSchemas";
import * as yup from "yup";
import { CustomError } from "../errors/CustomError";
import { errorResponse, successResponse } from "src/utils/responseHelper";
import { getEmailTemplete } from "src/utils/getEmailTemplete";
import { sendEmail } from "src/utils/sendEmail";

export const createUser: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const validatedData = await CreateUserSchema.validate(req.body);

    const { email, password, nickname } = validatedData;

    const hashedPassword = await bcryptjs.hash(password, 12);

    const existedUser = await User.findOne<UserDocument>({ email });
    if (existedUser) {
      throw new CustomError("이미 존재하는 이메일입니다.", 409);
    }

    const newUser = await User.create({
      nickname,
      email,
      password: hashedPassword,
    });

    const { password: _, ...safeUser } = newUser.toObject();

    return res
      .status(201)
      .json(successResponse("회원가입 성공!", { user: safeUser }));
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.errors.join(", ");

      return res.status(400).json(errorResponse(validationErrors));
    }

    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .json({ message: error.message, user: null });
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = await LoginSchema.validate(req.body);

    const { email, password } = validatedData;

    await connectDB();
    const user = await User.findOne<UserDocument>({ email });
    if (!user) {
      throw new CustomError("존재하지 않는 회원입니다.", 409);
    }

    const pwcheck = await bcryptjs.compare(password, user.password);
    if (!pwcheck) {
      throw new CustomError("잘못된 비밀번호입니다.", 409);
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return res.status(200).send({ token: getToken(payload), user });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.errors.join(", ");

      return res.status(400).json(errorResponse(validationErrors));
    }

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
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
      throw new CustomError("존재하지 않는 회원입니다.", 409);
    }

    const user = userDto(userDoc);

    return res.status(200).json(successResponse("", { user }));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const sendVerificationEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const currentTime = new Date();

  try {
    await connectDB();

    // 이미 가입된 유저인지 확인
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      throw new CustomError("가입이 불가능한 이메일입니다.", 409);
    }

    // 최근에 전송된 임시 유저인지 확인
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      const timeElapsed =
        (currentTime.getTime() -
          new Date(existingTempUser.createdAt).getTime()) /
        1000;

      // 1분 이내에 재전송 요청이 있을 경우
      if (timeElapsed < 60) {
        throw new CustomError("1분 이후 재전송 가능합니다.", 429);
      } else {
        await TempUser.findOneAndUpdate(
          { email },
          { verificationCode, createdAt: currentTime },
          { upsert: true }
        );
      }
    }

    const mailOptions = {
      from: "white0581@naver.com",
      to: email,
      subject: "인증 메일입니다.",
      html: getEmailTemplete(verificationCode),
    };

    sendEmail(mailOptions);

    await TempUser.create({
      email,
      verificationCode,
      createdAt: currentTime,
    });

    return res
      .status(200)
      .json(successResponse("이메일 전송에 성공했습니다.", true));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};
