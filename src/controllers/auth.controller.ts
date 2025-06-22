import { RequestHandler } from "express";
import User, { UserDocument } from "@models/user.model";
import TempUser from "@models/tempUser.model";
import bcryptjs from "bcryptjs";
import { getToken } from "@utils/jwt";
import { connectDB } from "@db/index";
import { CustomRequest } from "@middlewares/userGuard.middleware";
import { JwtPayload } from "jsonwebtoken";
import { userDto } from "@dto/user.dto";
import { CreateUserSchema, LoginSchema } from "@utils/vaildateSchemas";
import * as yup from "yup";
import { CustomError } from "@errors/CustomError";
import { errorResponse, successResponse } from "@dto/response.dto";
import { getEmailTemplete } from "@utils/getEmailTemplete";
import { createSmtpTransport } from "@utils/sendEmail";
import axios from "axios";

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

    return res.status(201).json(
      successResponse("가입이 완료됐어요! 지금부터 함께해요 🙌'", {
        user: safeUser,
      })
    );
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

    return res.status(200).json(
      successResponse("환영해요! 기다리고 있었어요 😊", {
        token: getToken(payload),
        user: userDto(user),
      })
    );
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

export const startGoogleOAuth: RequestHandler = async (req, res) => {
  try {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString();

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    return res.redirect(googleAuthUrl);
  } catch (error) {
    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const handleGoogleCallback: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const code = req.query.code as string;
    if (!code) {
      throw new CustomError("Authorization code가 없습니다.", 400);
    }

    // access_token 요청
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;

    // 사용자 정보 요청
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { email, name } = userRes.data;

    let payload;

    const user = await User.findOne({ email });

    if (user) {
      payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } else {
      const newUser = await User.create({
        nickname: name,
        email,
        password: "",
        isOAuthUser: true,
      });

      payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };
    }

    const message = encodeURIComponent("환영해요! 기다리고 있었어요 😊");

    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth?token=${getToken(
        payload
      )}&message=${message}`
    );
  } catch (error) {
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

  let smtpTransport;

  try {
    await connectDB();

    const existingTempUser = await TempUser.findOne({ email });

    if (existingTempUser) {
      const timeElapsed =
        (currentTime.getTime() -
          new Date(existingTempUser.createdAt).getTime()) /
        1000;

      if (timeElapsed < 30) {
        return res
          .status(429)
          .json(errorResponse("이전 전송 30초 이후 재전송 가능합니다."));
      }

      await TempUser.updateOne(
        { email },
        { verificationCode, createdAt: currentTime }
      );
    } else {
      await TempUser.create({
        email,
        verificationCode,
        createdAt: currentTime,
      });
    }

    smtpTransport = createSmtpTransport();

    console.log("📨 sendMail start");
    await smtpTransport.sendMail({
      from: "white0581@naver.com",
      to: email,
      subject: "인증 메일입니다.",
      html: getEmailTemplete(verificationCode),
    });
    console.log("✅ sendMail success");
  } catch (err) {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json(errorResponse(err.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  } finally {
    if (smtpTransport) {
      smtpTransport.close();
    }
  }

  return res
    .status(200)
    .json(successResponse("이메일 전송에 성공했습니다.", true));
};

export const checkVerificationCode: RequestHandler = async (req, res) => {
  const { email, code } = req.body;

  try {
    await connectDB();

    const tempUser = await TempUser.findOne({ email });

    if (tempUser && tempUser.verificationCode === code) {
      return res
        .status(200)
        .json(successResponse("인증에 성공했습니다.", true));
    } else {
      throw new CustomError("인증에 실패했습니다.", 401);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const checkId: RequestHandler = async (req, res) => {
  const { email } = req.body;

  try {
    await connectDB();

    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      throw new CustomError("가입이 불가능한 이메일입니다.", 409);
    } else {
      return res
        .status(200)
        .json(successResponse("가입 가능한 이메일입니다.", true));
    }
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }

    return res.status(500).json(errorResponse("서버 내부 오류"));
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await bcryptjs.hash(newPassword, 12);

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("해당 이메일의 유저를 찾을 수 없습니다.", 404);
    }

    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(successResponse("비밀번호가 성공적으로 변경되었어요!", true));
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(errorResponse(error.message));
    }
  }
};
