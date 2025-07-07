import nodemailer from 'nodemailer';
import * as DOTENV from './dotEnv.js';

const transporter = nodemailer.createTransport({
  host: DOTENV.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: DOTENV.SMTP_USER,
    pass: DOTENV.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // for development only
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: DOTENV.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};

export default sendMail;
