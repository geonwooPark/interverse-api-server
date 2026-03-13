import { Injectable } from "@nestjs/common";
import { ErrorCode } from "../../constants/error-codes";
import { CustomException } from "../../common/exceptions/custom.exception";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import * as bcryptjs from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangeNicknameDto } from "./dto/change-nickname.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import {
  SendVerificationEmailDto,
  CheckVerificationCodeDto,
  CheckIdDto,
} from "./dto/verification.dto";
import { userDto } from "./dto/user.dto";
import { getEmailTemplate } from "../../utils/get-email-template";
import { createSmtpTransport } from "../../utils/send-email";
import axios from "axios";
import {
  profileUploadToR2,
  deleteProfileFromR2,
} from "../../utils/profile-upload";
import dayjs from "../../utils/dayjs";
import { VERIFICATION_CODE_EXPIRY_MINUTES } from "./constants";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  getRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });
  }

  async createUser(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const { email, password, nickname } = createUserDto;

    const existedUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existedUser) {
      throw new CustomException(ErrorCode.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    let profile = "";
    if (file) {
      profile = await profileUploadToR2(file);
    }

    const newUser = await this.prisma.user.create({
      data: {
        nickname,
        email,
        password: hashedPassword,
        profile,
      },
    });

    const { password: _, ...safeUser } = newUser;

    return safeUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new CustomException(ErrorCode.OAUTH_PASSWORD_LOGIN_NOT_ALLOWED);
    }

    const pwcheck = await bcryptjs.compare(password, user.password);
    if (!pwcheck) {
      throw new CustomException(ErrorCode.INVALID_PASSWORD);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);

    return {
      token: accessToken,
      refreshToken,
      user: userDto(user),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });

      const newAccessToken = this.getAccessToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      return { token: newAccessToken };
    } catch (error: any) {
      throw new CustomException(ErrorCode.REFRESH_TOKEN_INVALID);
    }
  }

  async getCurrentUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }

    return userDto(user);
  }

  async sendVerificationEmail(dto: SendVerificationEmailDto) {
    const { email } = dto;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const currentTime = dayjs();

    await this.deleteExpiredTempUsers();

    const existingTempUser = await this.prisma.tempUser.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (existingTempUser) {
      const secondsSinceLastSend = currentTime.diff(
        dayjs(existingTempUser.createdAt),
        "second",
      );

      if (secondsSinceLastSend < 30) {
        throw new CustomException(
          ErrorCode.TOO_MANY_REQUESTS,
          "이전 전송 30초 이후 재전송 가능합니다.",
        );
      }

      await this.prisma.tempUser.update({
        where: { id: existingTempUser.id },
        data: { verificationCode, createdAt: currentTime.toDate() },
      });
    } else {
      await this.prisma.tempUser.create({
        data: {
          email,
          verificationCode,
          createdAt: currentTime.toDate(),
        },
      });
    }

    const smtpTransport = createSmtpTransport();

    try {
      console.log("📨 sendMail start");
      await smtpTransport.sendMail({
        from: "white0581@naver.com",
        to: email,
        subject: "인증 메일입니다.",
        html: getEmailTemplate(verificationCode),
      });
      console.log("✅ sendMail success");
    } finally {
      smtpTransport.close();
    }

    return true;
  }

  async checkVerificationCode(dto: CheckVerificationCodeDto) {
    const { email, code } = dto;

    await this.deleteExpiredTempUsers();

    const tempUser = await this.prisma.tempUser.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!tempUser) {
      throw new CustomException(ErrorCode.VERIFICATION_FAILED);
    }

    const expiredAt = dayjs(tempUser.createdAt).add(
      VERIFICATION_CODE_EXPIRY_MINUTES,
      "minute",
    );
    if (dayjs().isAfter(expiredAt)) {
      throw new CustomException(ErrorCode.VERIFICATION_CODE_EXPIRED);
    }

    if (tempUser.verificationCode !== code) {
      throw new CustomException(ErrorCode.VERIFICATION_FAILED);
    }

    return true;
  }

  /** 만료된 TempUser 삭제 (인증 코드 유효기간 경과) */
  private async deleteExpiredTempUsers() {
    const expiryThreshold = dayjs()
      .subtract(VERIFICATION_CODE_EXPIRY_MINUTES, "minute")
      .toDate();
    await this.prisma.tempUser.deleteMany({
      where: { createdAt: { lt: expiryThreshold } },
    });
  }

  async checkId(dto: CheckIdDto) {
    const { email } = dto;

    const isExistingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      throw new CustomException(ErrorCode.EMAIL_NOT_AVAILABLE);
    }

    return true;
  }

  async changePassword(dto: ChangePasswordDto) {
    const { email, newPassword } = dto;

    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomException(
        ErrorCode.USER_NOT_FOUND,
        "해당 이메일의 유저를 찾을 수 없습니다.",
      );
    }

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return true;
  }

  async changeNickname(email: string, dto: ChangeNicknameDto) {
    const { nickname } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { nickname },
    });

    return userDto(updatedUser);
  }

  async changeProfile(email: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }

    if (!file) {
      throw new CustomException(
        ErrorCode.BAD_REQUEST,
        "프로필 이미지가 필요합니다.",
      );
    }

    // 기존 프로필 이미지가 있으면 삭제
    if (user.profile) {
      await deleteProfileFromR2(user.profile);
    }

    const profile = await profileUploadToR2(file);

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { profile },
    });

    return userDto(updatedUser);
  }

  async startGoogleOAuth() {
    const params = new URLSearchParams({
      client_id: this.configService.get<string>("GOOGLE_CLIENT_ID")!,
      redirect_uri: this.configService.get<string>("GOOGLE_REDIRECT_URI")!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString();

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async handleGoogleCallback(code: string) {
    if (!code) {
      throw new CustomException(
        ErrorCode.BAD_REQUEST,
        "Authorization code가 없습니다.",
      );
    }

    // access_token 요청
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: this.configService.get<string>("GOOGLE_CLIENT_ID")!,
          client_secret: this.configService.get<string>(
            "GOOGLE_CLIENT_SECRET",
          )!,
          redirect_uri: this.configService.get<string>("GOOGLE_REDIRECT_URI")!,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { access_token } = tokenRes.data;

    // 사용자 정보 요청
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const { email, name, picture } = userRes.data;

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          profile: picture,
          nickname: name,
          email,
          password: "",
          isOAuthUser: true,
        },
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      message: "환영해요! 기다리고 있었어요 😊",
    };
  }
}
