import "./config/env";
import "./module-alias";
import "./db";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "@routers/auth.router";
import roomsRouter from "@routers/rooms.router";
import assetsRouter from "@routers/assets.router";
import healthRouter from "@routers/health.router";
import { swaggerUi, swaggerSpec } from "./swagger";

console.log("NODE_ENV =", process.env.NODE_ENV);

const app = express();

const allowedOrigins = process.env.FRONTEND_URL;

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/rooms", roomsRouter);
app.use("/assets", assetsRouter);

app.use("/health", healthRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`${process.env.PORT || 8000}PORT 실행중..`);
  console.log(`📘 Swagger UI: ${process.env.DOMAIN}/api-docs`);
});
