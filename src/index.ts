require("dotenv").config();
import "./module-alias";
import "./db";
import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import authRouter from "@routers/auth.router";
import roomsRouter from "@routers/rooms.router";
import assetsRouter from "@routers/assets.router";
import { swaggerUi, swaggerSpec } from "./swagger";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/rooms", roomsRouter);
app.use("/assets", assetsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

if (process.env.NODE_ENV == "production") {
  const options = {
    ca: fs.readFileSync(
      `/etc/letsencrypt/live/${process.env.DOMAIN as string}/fullchain.pem`
    ),
    key: fs.readFileSync(
      `/etc/letsencrypt/live/${process.env.DOMAIN as string}/privkey.pem`
    ),
    cert: fs.readFileSync(
      `/etc/letsencrypt/live/${process.env.DOMAIN as string}/cert.pem`
    ),
  };

  https.createServer(options, app).listen(process.env.PORT || 443, () => {
    console.log(`${process.env.PORT || 443}PORT 실행중..`);
  });
} else {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`${process.env.PORT || 8000}PORT 실행중..`);
    console.log("📘 Swagger UI: http://localhost:8000/api-docs");
  });
}
