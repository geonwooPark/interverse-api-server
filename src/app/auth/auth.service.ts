import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
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
import { getEmailTemplete } from "../../utils/getEmailTemplete";
import { createSmtpTransport } from "../../utils/sendEmail";
import axios from "axios";
import {
  profileUploadToR2,
  deleteProfileFromR2,
} from "../../utils/profile-upload";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  getAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwtSecretKey"),
      expiresIn: "30m",
    });
  }

  getRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwtRefreshSecret"),
      expiresIn: "7d",
    });
  }

  async createUser(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    const { email, password, nickname } = createUserDto;

    const existedUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existedUser) {
      throw new ConflictException("이미 존재하는 이메일입니다.");
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
      throw new ConflictException("존재하지 않는 회원입니다.");
    }

    if (!user.password) {
      throw new UnauthorizedException(
        "OAuth 사용자는 비밀번호 로그인이 불가능합니다."
      );
    }

    const pwcheck = await bcryptjs.compare(password, user.password);
    if (!pwcheck) {
      throw new ConflictException("잘못된 비밀번호입니다.");
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
        secret: this.configService.get<string>("jwtRefreshSecret"),
      });

      const newAccessToken = this.getAccessToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      return { token: newAccessToken };
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new UnauthorizedException("리프레시 토큰 만료");
      }
      throw new UnauthorizedException("리프레시 토큰이 유효하지 않음");
    }
  }

  async getCurrentUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException("존재하지 않는 회원입니다.");
    }

    return userDto(user);
  }

  async sendVerificationEmail(dto: SendVerificationEmailDto) {
    const { email } = dto;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date();

    const existingTempUser = await this.prisma.tempUser.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (existingTempUser) {
      const timeElapsed =
        (currentTime.getTime() - existingTempUser.createdAt.getTime()) / 1000;

      if (timeElapsed < 30) {
        throw new HttpException(
          "이전 전송 30초 이후 재전송 가능합니다.",
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      await this.prisma.tempUser.update({
        where: { id: existingTempUser.id },
        data: { verificationCode, createdAt: currentTime },
      });
    } else {
      await this.prisma.tempUser.create({
        data: {
          email,
          verificationCode,
          createdAt: currentTime,
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
        html: getEmailTemplete(verificationCode),
      });
      console.log("✅ sendMail success");
    } finally {
      smtpTransport.close();
    }

    return true;
  }

  async checkVerificationCode(dto: CheckVerificationCodeDto) {
    const { email, code } = dto;

    const tempUser = await this.prisma.tempUser.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (tempUser && tempUser.verificationCode === code) {
      return true;
    } else {
      throw new UnauthorizedException("인증에 실패했습니다.");
    }
  }

  async checkId(dto: CheckIdDto) {
    const { email } = dto;

    const isExistingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      throw new ConflictException("가입이 불가능한 이메일입니다.");
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
      throw new NotFoundException("해당 이메일의 유저를 찾을 수 없습니다.");
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
      throw new NotFoundException("존재하지 않는 회원입니다.");
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
      throw new NotFoundException("존재하지 않는 회원입니다.");
    }

    if (!file) {
      throw new BadRequestException("프로필 이미지가 필요합니다.");
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
      client_id: this.configService.get<string>("googleClientId")!,
      redirect_uri: this.configService.get<string>("googleRedirectUri")!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    }).toString();

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async handleGoogleCallback(code: string) {
    if (!code) {
      throw new BadRequestException("Authorization code가 없습니다.");
    }

    // access_token 요청
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: this.configService.get<string>("googleClientId")!,
          client_secret: this.configService.get<string>("googleClientSecret")!,
          redirect_uri: this.configService.get<string>("googleRedirectUri")!,
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
