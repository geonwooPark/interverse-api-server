require("dotenv").config();
import "./db";
import express from "express";
import cors from "cors";
import postingRouter from "./routers/posting.router";
import commentRouter from "./routers/comment.router";
import replyCommentRouter from "./routers/replyComment.router";
import likeRouter from "./routers/like.router";
import checklistRouter from "./routers/checklist.router";
import userRouter from "./routers/user.router";

const app = express();

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
