import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ErrorCode } from "../../constants/error-codes";
import { CustomException } from "../../common/exceptions/custom.exception";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { User } from "../../common/decorators/user.decorator";
import type { JwtPayload } from "../../common/decorators/user.decorator";
import { ResponseMessage } from "../../common/decorators/response-message.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { ChangeNicknameDto } from "./dto/change-nickname.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import {
  SendVerificationEmailDto,
  CheckVerificationCodeDto,
  CheckIdDto,
} from "./dto/verification.dto";
import { LoginResponseDto } from "./dto/login-response.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { RefreshTokenResponseDto } from "./dto/refresh-token-response.dto";
import { MessageOnlyResponseDto } from "../../common/dto/message-only-response.dto";
import { profileMulterOptions } from "./configs/profile-multer.options";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "사용자 로그인" })
  @ApiResponse({
    status: 200,
    description: "로그인 성공",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: "요청 데이터 유효성 검사 실패" })
  @ApiResponse({
    status: 409,
    description: "존재하지 않는 회원이거나 비밀번호 불일치",
  })
  @ResponseMessage("환영해요! 기다리고 있었어요 😊")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie("interverse_refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return {
      token: result.token,
      user: result.user,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "액세스 토큰 재발급 (리프레시 토큰 사용)" })
  @ApiResponse({
    status: 200,
    description: "새 액세스 토큰 발급 성공",
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "리프레시 토큰 없음 또는 유효하지 않음",
  })
  @ResponseMessage("토큰이 성공적으로 재발급되었습니다.")
  async refreshToken(
    @Req() req: any,
    @Body("refreshToken") refreshToken?: string,
  ) {
    const token = req.cookies?.interverse_refreshToken || refreshToken;

    if (!token) {
      throw new CustomException(
        ErrorCode.REFRESH_TOKEN_INVALID,
        "리프레시 토큰 없음",
      );
    }

    return await this.authService.refreshToken(token);
  }

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("profile", profileMulterOptions))
  @ApiOperation({ summary: "회원가입" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        profile: {
          type: "string",
          format: "binary",
        },
        email: { type: "string" },
        password: { type: "string" },
        nickname: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "회원가입 성공",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "요청 데이터 유효성 검사 실패" })
  @ApiResponse({ status: 409, description: "이미 존재하는 이메일" })
  @ResponseMessage("가입이 완료됐어요! 지금부터 함께해요 🙌")
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.authService.createUser(createUserDto, file);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("bearerAuth")
  @ApiOperation({ summary: "현재 로그인한 사용자 정보 조회" })
  @ApiResponse({
    status: 200,
    description: "사용자 정보 반환",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: "인증 실패 (토큰 없음 또는 만료)" })
  @ApiResponse({ status: 409, description: "존재하지 않는 회원" })
  @ResponseMessage("사용자 정보를 성공적으로 가져왔습니다.")
  async getCurrentUser(@User() user: JwtPayload) {
    return await this.authService.getCurrentUser(user.email);
  }

  @Post("send-verification-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일 인증 코드 전송" })
  @ApiResponse({
    status: 200,
    description: "이메일 전송 성공",
    type: MessageOnlyResponseDto,
  })
  @ApiResponse({ status: 429, description: "30초 이내 재전송 제한" })
  @ResponseMessage("이메일 전송에 성공했습니다.")
  async sendVerificationEmail(@Body() dto: SendVerificationEmailDto) {
    return await this.authService.sendVerificationEmail(dto);
  }

  @Post("check-verification-code")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일 인증 코드 확인" })
  @ApiResponse({
    status: 200,
    description: "인증 성공",
    type: MessageOnlyResponseDto,
  })
  @ApiResponse({ status: 401, description: "인증 실패 (코드 불일치)" })
  @ResponseMessage("인증에 성공했습니다.")
  async checkVerificationCode(@Body() dto: CheckVerificationCodeDto) {
    return await this.authService.checkVerificationCode(dto);
  }

  @Post("check-id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "이메일 가입 가능 여부 확인" })
  @ApiResponse({
    status: 200,
    description: "가입 가능한 이메일일 경우",
    type: MessageOnlyResponseDto,
  })
  @ApiResponse({ status: 409, description: "이미 존재하는 이메일일 경우" })
  @ResponseMessage("가입 가능한 이메일입니다.")
  async checkId(@Body() dto: CheckIdDto) {
    return await this.authService.checkId(dto);
  }

  @Patch("change-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "비밀번호 변경" })
  @ApiResponse({
    status: 200,
    description: "비밀번호 변경 성공",
    type: MessageOnlyResponseDto,
  })
  @ApiResponse({ status: 404, description: "해당 이메일 유저 없음" })
  @ResponseMessage("비밀번호가 성공적으로 변경되었어요!")
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(dto);
    return null;
  }

  @Patch("change-nickname")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("bearerAuth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "닉네임 변경" })
  @ApiResponse({
    status: 200,
    description: "닉네임 변경 성공",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "요청 데이터 유효성 검사 실패" })
  @ApiResponse({ status: 401, description: "인증 실패 (토큰 없음 또는 만료)" })
  @ApiResponse({ status: 404, description: "존재하지 않는 회원" })
  @ResponseMessage("닉네임이 성공적으로 변경되었어요!")
  async changeNickname(
    @User() user: JwtPayload,
    @Body() dto: ChangeNicknameDto,
  ) {
    return await this.authService.changeNickname(user.email, dto);
  }

  @Patch("change-profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("bearerAuth")
  @UseInterceptors(FileInterceptor("profile", profileMulterOptions))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "프로필 이미지 변경" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        profile: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "프로필 이미지 변경 성공",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: "프로필 이미지가 없음" })
  @ApiResponse({ status: 401, description: "인증 실패 (토큰 없음 또는 만료)" })
  @ApiResponse({ status: 404, description: "존재하지 않는 회원" })
  @ResponseMessage("프로필 이미지가 성공적으로 변경되었어요!")
  async changeProfile(
    @User() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authService.changeProfile(user.email, file);
  }

  @Get("google")
  @ApiOperation({ summary: "구글 OAuth 로그인 시작" })
  @ApiResponse({ status: 302, description: "구글 로그인 페이지로 리디렉션" })
  async startGoogleOAuth(@Res() res: Response) {
    const url = await this.authService.startGoogleOAuth();
    return res.redirect(url);
  }

  @Get("google/callback")
  @ApiOperation({ summary: "구글 OAuth 콜백" })
  async handleGoogleCallback(
    @Query("code") code: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleGoogleCallback(code);

    res.cookie("interverse_refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    const message = encodeURIComponent(result.message);
    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth?token=${result.accessToken}&message=${message}`,
    );
  }
}
