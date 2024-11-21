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
        return res.status(429).json({ message: "1분 이후 재전송 가능합니다." });
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
      html: `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>이메일 인증</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #4caf50;
              font-size: 32px;
            }
            .content {
              font-size: 16px;
              line-height: 1.5;
              text-align: center;
              margin: 20px 0;
            }
            .code {
              font-size: 24px;
              font-weight: bold;
              color: black;
              background-color: #f2f2f2;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>이메일 인증</h1>
            </div>
            <div class="content">
              <p>
                안녕하세요! 아래의 인증번호를 입력하여 이메일 인증을 완료해주세요.
              </p>
              <div class="code">${verificationCode}</div>
              <p>
                이 인증번호는 3분 이내에 입력해야 하며, 만약 이 메일을 본 적이 없다면
                무시하셔도 됩니다.
              </p>
            </div>
            <div class="footer">
              <p>이 메일은 자동으로 발송된 메일입니다. 답변하지 마세요.</p>
              <p>
                문의 사항은
                <a href="mailto:white0581@naver.com">white0581@naver.com</a>으로
                보내주세요.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
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

    await sendMailPromise();

    await TempUser.create({
      email,
      verificationCode,
      createdAt: currentTime,
    });

    smtpTransport.close();
    return res.status(200).send({ message: "이메일 전송에 성공했습니다." });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: "서버 내부 오류" });
    }
  }
};
