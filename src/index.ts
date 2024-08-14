require("dotenv").config();
import "./db";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import cors from "cors";
import postingRouter from "./routers/posting.router";
import commentRouter from "./routers/comment.router";
import replyCommentRouter from "./routers/replyComment.router";
import likeRouter from "./routers/like.router";
import checklistRouter from "./routers/checklist.router";
import userRouter from "./routers/user.router";

const app = express();

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

app.use(express.static("public"));
app.use(
  cors({ origin: ["http://localhost:3000", "https://www.ventileco.site"] })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/posting", postingRouter);
app.use("/comment", commentRouter);
app.use("/reply-comment", replyCommentRouter);
app.use("/like", likeRouter);
app.use("/checklist", checklistRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행중..");
});
http.createServer(app).listen(3000);
https.createServer(options, app).listen(443);
