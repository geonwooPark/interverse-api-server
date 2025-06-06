import { Router } from "express";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";
import {
  checkPassword,
  createRoom,
  deleteRoom,
  getRooms,
  getSingleRoom,
  joinRoom,
} from "@controllers/rooms.controller";

const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: 사용자가 참여한 방 리스트 조회
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 참여한 방 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 참여한 방 리스트입니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         format: objectId
 *                         example: 645f3d8f2345abcd12340001
 *                       joinedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-05-20T14:00:00Z
 *                       room:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 645f3d8f2345abcd12345679
 *                           title:
 *                             type: string
 *                             example: Sample Room
 *                           host:
 *                             type: string
 *                             example: abcd12345679
 *                           headCount:
 *                             type: number
 *                             example: 4
 *                           mapSrc:
 *                             type: string
 *                             example: https://example.com/map-source
 *                       map:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 645f3d8f2345abcd12345680
 *                           name:
 *                             type: string
 *                             example: office
 *                           thumbnail:
 *                             type: string
 *                             example: https://pub-b1bcdfea0c06423d871965b53c9a3103.r2.dev/thumbnails/office.png
 *                           source:
 *                             type: string
 *                             example: https://pub-b1bcdfea0c06423d871965b53c9a3103.r2.dev/thumbnails/office.json
 *       401:
 *         description: 인증 실패
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
router.get("/", userGuardMiddleware, getRooms);

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: 특정 방의 정보 조회
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 방의 ID
 *     responses:
 *       200:
 *         description: 방 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "abc123방 정보입니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     host:
 *                       type: string
 *                     isHost:
 *                       type: boolean
 *                     title:
 *                       type: string
 *                     mapSrc:
 *                       type: string
 *                     headCount:
 *                       type: number
 *       401:
 *         description: 인증 실패
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
router.get("/:roomId", userGuardMiddleware, getSingleRoom);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: 방 생성
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - password
 *               - headCount
 *               - mapSrc
 *             properties:
 *               title:
 *                 type: string
 *                 example: "새로운 방"
 *               password:
 *                 type: string
 *                 example: "1234"
 *               headCount:
 *                 type: number
 *                 example: 6
 *               mapSrc:
 *                 type: string
 *                 example: "office"
 *     responses:
 *       201:
 *         description: 방 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "방이 생성되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     headCount:
 *                       type: number
 *                     host:
 *                       type: string
 *                     mapSrc:
 *                       type: string
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
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
router.post("/", userGuardMiddleware, createRoom);

/**
 * @swagger
 * /rooms/{roomId}/join:
 *   post:
 *     summary: 방 입장
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: 입장할 방의 ID
 *     responses:
 *       200:
 *         description: 방 입장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 방에 입장했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     headCount:
 *                       type: number
 *                     host:
 *                       type: string
 *                     mapSrc:
 *                       type: string
 *       404:
 *         description: 방을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 방을 찾을 수 없습니다.
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
router.post("/:roomId/join", userGuardMiddleware, joinRoom);

/**
 * @swagger
 * /rooms/{roomId}:
 *   delete:
 *     summary: 방 삭제
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 방의 ID
 *     responses:
 *       200:
 *         description: 방 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 방이 성공적으로 삭제되었습니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: 삭제 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 방을 삭제할 권한이 없습니다.
 *       404:
 *         description: 방 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 해당 방을 찾을 수 없습니다.
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
router.delete("/:roomId", userGuardMiddleware, deleteRoom);

/**
 * @swagger
 * /rooms/{roomId}/password:
 *   post:
 *     summary: 방 비밀번호 확인
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: 비밀번호를 확인할 방의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 비밀번호 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 일치합니다.
 *                 data:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 방 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 방을 찾을 수 없습니다.
 *       409:
 *         description: 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 일치하지 않습니다.
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
router.post("/:roomId/check-password", userGuardMiddleware, checkPassword);

export default router;
