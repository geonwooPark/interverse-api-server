import { Router } from "express";
import { userGuardMiddleware } from "@middlewares/userGuard.middleware";
import { createMap, getMaps } from "@controllers/maps.controller";

const router = Router();

/**
 * @swagger
 * /maps:
 *   get:
 *     summary: 모든 맵 리스트 조회
 *     tags:
 *       - Maps
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
 *                      - source
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
 *                       source:
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
router.get("/", userGuardMiddleware, getMaps);

/**
 * @swagger
 * /maps:
 *   post:
 *     summary: 새 맵 생성
 *     tags:
 *       - Maps
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
 *               - source
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sample Map
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               source:
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
 *                     source:
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
router.post("/", userGuardMiddleware, createMap);

export default router;
