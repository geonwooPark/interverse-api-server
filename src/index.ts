require("dotenv").config();
import "./db";
import express from "express";
import postingRouter from "./routers/posting.router";
import commentRouter from "./routers/comment.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/posting", postingRouter);
app.use("/comment", commentRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 실행중..");
});
