// backend/src/utils/mailer.js
import nodemailer from "nodemailer";

let transporter;

export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration is missing (SMTP_HOST, SMTP_USER, SMTP_PASS)");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587/25 (STARTTLS)
    requireTLS: port === 587, // enforce STARTTLS on 587
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const t = getTransporter();
  return t.sendMail({ from, to, subject, text, html });
}

