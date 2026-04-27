import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});``




export const sendEmail = async (to, subject, html) => {
    try {
      console.log("inside");
    const info = await transporter.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    // console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};