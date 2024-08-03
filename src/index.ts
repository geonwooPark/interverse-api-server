require("dotenv").config();
import "./db";
import express from "express";
import postingRouter from "./routers/posting.router";
import commentRouter from "./routers/comment.router";
import replyCommentRouter from "./routers/replyComment.router";
import like from "./routers/like.router";
import checklist from "./routers/checklist.router";
import user from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/posting", postingRouter);
app.use("/comment", commentRouter);
app.use("/reply-comment", replyCommentRouter);
app.use("/like", like);
app.use("/checklist", checklist);
app.use("/user", user);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행중..");
});
