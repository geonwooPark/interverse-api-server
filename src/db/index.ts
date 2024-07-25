import mongoose from "mongoose";

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => console.log("DB 연결 성공"))
  .catch((err) => console.log("DB 연결 실패", err));
