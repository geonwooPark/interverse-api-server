import { Router } from "express";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";
import {
  createCharacter,
  createMap,
  getCharacters,
  getMaps,
} from "@controllers/assets.controller";

const router = Router();

/**
 * @swagger
 * /assets/maps:
 *   get:
 *     summary: 모든 맵 리스트 조회
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 맵 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 성공적으로 맵 리스트를 가져왔습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                      - _id
 *                      - name
 *                      - thumbnail
 *                      - mapSrc
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 645f3d8f2345abcd12345680
 *                       name:
 *                         type: string
 *                         example: office
 *                       thumbnail:
 *                          type: string
 *                          example: https://pub-b1bcdfea0c06423d871965b53c9a3103.r2.dev/thumbnails/office.png
 *                       mapSrc:
 *                          type: string
 *                          example: https://pub-b1bcdfea0c06423d871965b53c9a3103.r2.dev/thumbnails/office.json
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
router.get("/maps", userGuardMiddleware, getMaps);

/**
 * @swagger
 * /assets/maps:
 *   post:
 *     summary: 새 맵 생성
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - thumbnail
 *               - mapSrc
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sample Map
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               mapSrc:
 *                 type: string
 *                 example: https://example.com/map-source
 *     responses:
 *       200:
 *         description: 맵 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 성공적으로 맵을 생성했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 645f3d8f2345abcd12345678
 *                     name:
 *                       type: string
 *                       example: Sample Map
 *                     thumbnail:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     mapSrc:
 *                       type: string
 *                       example: https://example.com/map-source
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
router.post("/maps", userGuardMiddleware, createMap);

/**
 * @swagger
 * /assets/characters:
 *   get:
 *     summary: 모든 캐릭터 리스트 조회
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 캐릭터 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 성공적으로 캐릭터 리스트를 가져왔습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required:
 *                      - _id
 *                      - name
 *                      - source
 *                      - width
 *                      - height
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       source:
 *                          type: string
 *                       width:
 *                          type: number
 *                       height:
 *                          type: number
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
router.get("/characters", userGuardMiddleware, getCharacters);

/**
 * @swagger
 * /assets/characters:
 *   post:
 *     summary: 새 캐릭터 생성
 *     tags:
 *       - Assets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - source
 *               - width
 *               - height
 *             properties:
 *               name:
 *                 type: string
 *               source:
 *                 type: string
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *     responses:
 *       200:
 *         description: 캐릭터 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     source:
 *                       type: string
 *                     width:
 *                       type: number
 *                     height:
 *                       type: number
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
router.post("/characters", userGuardMiddleware, createCharacter);

export default router;
