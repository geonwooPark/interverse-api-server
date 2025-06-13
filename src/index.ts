require("dotenv").config();
import "./module-alias";
import "./db";
import express from "express";
import cors from "cors";
import authRouter from "@routers/auth.router";
import roomsRouter from "@routers/rooms.router";
import assetsRouter from "@routers/assets.router";
import healthRouter from "@routers/health.router";
import { swaggerUi, swaggerSpec } from "./swagger";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://interverse.site"]
    : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  console.log("📘 Swagger UI: http://localhost:8000/api-docs");
});
