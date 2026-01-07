import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

export default prisma;
