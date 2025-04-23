require("dotenv").config();
import "./db";
import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import authRouter from "./routers/auth.router";
import roomsRouter from "./routers/rooms.router";

const app = express();

app.use(cors({ origin: ["http://localhost:5173"] }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);
app.use("/rooms", roomsRouter);

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
  });
}
