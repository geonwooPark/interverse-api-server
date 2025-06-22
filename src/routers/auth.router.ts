import { Router } from "express";
import {
  changePassword,
  checkId,
  checkVerificationCode,
  createUser,
  getCurrentUser,
  handleGoogleCallback,
  loginUser,
  sendVerificationEmail,
  startGoogleOAuth,
} from "@controllers/auth.controller";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인에 성공했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT 토큰
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 608c1f9b4f1a4629a4e9c8a1
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         role:
 *                           type: string
 *                           example: user
 *       400:
 *         description: 요청 데이터 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일 형식이 올바르지 않습니다.
 *       409:
 *         description: 존재하지 않는 회원이거나 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 잘못된 비밀번호입니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: 회원가입
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nickname
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               nickname:
 *                 type: string
 *                 example: cooluser
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 회원가입 성공!
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 608c1f9b4f1a4629a4e9c8a1
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         nickname:
 *                           type: string
 *                           example: cooluser
 *       400:
 *         description: 요청 데이터 유효성 검사 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일 형식이 올바르지 않습니다.
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 존재하는 이메일입니다.
 *                 user:
 *                   type: "null"
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.post("/signup", createUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 현재 로그인한 사용자 정보 조회
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ""
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 608c1f9b4f1a4629a4e9c8a1
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         nickname:
 *                           type: string
 *                           example: cooluser
 *                         role:
 *                           type: string
 *                           example: user
 *       409:
 *         description: 존재하지 않는 회원
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 존재하지 않는 회원입니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 만료)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.get("/me", userGuardMiddleware, getCurrentUser);

/**
 * @swagger
 * /auth/send-verification-email:
 *   post:
 *     summary: 이메일 인증 코드 전송
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 이메일 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일 전송에 성공했습니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       429:
 *         description: 30초 이내 재전송 제한
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이전 전송 30초 이후 재전송 가능합니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.post("/send-verification-email", sendVerificationEmail);

/**
 * @swagger
 * /auth/check-verification-code:
 *   post:
 *     summary: 이메일 인증 코드 확인
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               code:
 *                 type: integer
 *                 example: 123456
 *     responses:
 *       200:
 *         description: 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증에 성공했습니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: 인증 실패 (코드 불일치)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증에 실패했습니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.post("/check-verification-code", checkVerificationCode);

/**
 * @swagger
 * /auth/check-id:
 *   post:
 *     summary: 이메일 가입 가능 여부 확인
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 가입 가능한 이메일일 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 가입 가능한 이메일입니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       409:
 *         description: 이미 존재하는 이메일일 경우
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 가입이 불가능한 이메일입니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.post("/check-id", checkId);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: 비밀번호 변경
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 example: newStrongPassword123
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 성공적으로 변경되었습니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 해당 이메일 유저 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 이메일의 유저를 찾을 수 없습니다.
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류
 */
router.patch("/change-password", changePassword);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: 구글 OAuth 로그인 시작
 *     description: 사용자를 구글 로그인 페이지로 리디렉션합니다.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: 구글 로그인 페이지로 리디렉션
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Google OAuth redirection failed
 */
router.get("/google", startGoogleOAuth);

router.get("/google/callback", handleGoogleCallback);

export default router;
