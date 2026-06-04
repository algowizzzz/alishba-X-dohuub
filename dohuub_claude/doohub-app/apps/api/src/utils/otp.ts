import { prisma } from '@doohub/database';
import nodemailer from 'nodemailer';
import { logger } from '../lib/logger';

const isProd = process.env.NODE_ENV === 'production';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (isProd) {
      logger.error('SMTP not configured in production — OTP emails will not be sent');
    }
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export async function createOtp(email: string): Promise<string> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // Invalidate any prior unverified OTPs for this address.
  await prisma.otpVerification.deleteMany({ where: { email, verified: false } });

  await prisma.otpVerification.create({
    data: { email, otp, expiresAt, verified: false },
  });

  return otp;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const record = await prisma.otpVerification.findFirst({
    where: {
      email,
      otp,
      verified: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) return false;

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return true;
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const tx = getTransporter();
  if (!tx) {
    // Dev fallback — log to console so you can read it from the terminal.
    if (!isProd) logger.info({ email, otp }, '[dev] OTP (SMTP not configured)');
    return;
  }

  const from = process.env.SMTP_FROM || `DoHuub <${process.env.SMTP_USER}>`;
  await tx.sendMail({
    from,
    to: email,
    subject: 'Your DoHuub verification code',
    text: `Your DoHuub verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;">
        <h2 style="color:#2E7AD9;margin:0 0 16px;">DoHuub</h2>
        <p>Your verification code is:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:16px 0;">${otp}</p>
        <p style="color:#666;font-size:13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}
