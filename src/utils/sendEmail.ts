import nodemailer from "nodemailer";

export const createSmtpTransport = () =>
  nodemailer.createTransport({
    pool: true,
    maxConnections: 5,
    service: "naver",
    host: "smtp.naver.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
