import { RequestHandler } from "express";
import User, { UserDocument } from "../models/user.model";
import TempUser, { TempUserDocument } from "../models/tempUser.model";
import bcryptjs from "bcryptjs";
import { getToken } from "../utils/jwt";
import { connectDB } from "../db";
import { CustomRequest } from "../middlewares/userGuard.middleware";
import { JwtPayload } from "jsonwebtoken";
import { userDto } from "../dto/user.dto";
import { CreateUserSchema, LoginSchema } from "../utils/vaildateSchemas";
import * as yup from "yup";
import { smtpTransport } from "../utils/smtpTransport";

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

export const sendVerificationEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const currentTime = new Date();

  try {
    await connectDB();

    // 이미 가입된 유저인지 확인
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      return res.status(409).json({ message: "가입이 불가능한 이메일입니다." });
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
        return res.status(429).json({ message: "1분 후에 다시 시도해주세요." });
      } else {
        // 이전 데이터를 삭제하고 새로운 인증 코드로 업데이트
        await TempUser.deleteOne({ email });
      }
    }

    // 이메일 전송하기
    const mailOptions = {
      from: "white0581@naver.com",
      to: email,
      subject: "인증 메일입니다.",
      html: "<h1>인증번호를 입력해주세요.</h1>" + verificationCode,
    };

    // sendMail을 Promise로 래핑
    const sendMailPromise = () => {
      return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    };

    console.log(1);

    // 메일 전송 ---- 대기 뜨면서 메일을 안보냄
    await sendMailPromise();

    console.log(2);

    // 새 임시 유저 데이터 생성
    await TempUser.create({
      email,
      verificationCode,
      createdAt: currentTime, // 인증 요청 시간 저장
    });

    console.log(3);

    smtpTransport.close();
    return res.status(200).send({ message: "이메일 전송에 성공했습니다." });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: "서버 내부 오류" });
    }
  }
};
