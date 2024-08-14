import mongoose from "mongoose";

let connection: mongoose.Connection;

export const connectDB = async () => {
  if (connection) return;

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL as string);

    connection = db.connection;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};
