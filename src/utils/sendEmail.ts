import nodemailer from "nodemailer";

const smtpTransport = nodemailer.createTransport({
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

export const sendEmail = (options: {
  from: string;
  to: any;
  subject: string;
  html: string;
}) => {
  try {
    smtpTransport.sendMail(options);
  } catch (error) {
    console.log(error);
  } finally {
    smtpTransport.close();
  }
};
