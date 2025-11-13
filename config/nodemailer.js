// config/nodemailer.js
import nodemailer from "nodemailer";

const bool = (v, d=false) => {
  if (v === undefined) return d;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  return s === "1" || s === "true" || s === "yes";
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false otherwise
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: !bool(process.env.SMTP_TLS_ALLOW_INSECURE, false),
  },
});

export const sendEmail = async (to, subject, html) => {
  const fromName = process.env.MAIL_FROM_NAME || "Heritage and Culture";
  const fromAddr = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `${fromName} <${fromAddr}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending error:", error?.message);
  }
};

export default sendEmail;
