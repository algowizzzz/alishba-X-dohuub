import { prisma } from '@doohub/database';
import crypto from 'crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

export function generateOtp(): string {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp.padStart(OTP_LENGTH, '0');
}

export async function createOtp(email: string): Promise<string> {
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Delete any existing OTPs for this email
  await prisma.otpVerification.deleteMany({
    where: { email },
  });

  // Create new OTP
  await prisma.otpVerification.create({
    data: {
      email,
      otp,
      expiresAt,
    },
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

  if (!record) {
    return false;
  }

  // Mark OTP as verified
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return true;
}

export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // In development, just log the OTP
  console.log(`📧 OTP for ${email}: ${otp}`);
  
  // TODO: In production, use nodemailer or a service like SendGrid
  // const transporter = nodemailer.createTransport({...});
  // await transporter.sendMail({
  //   to: email,
  //   subject: 'Your DoHuub Verification Code',
  //   html: `Your verification code is: <strong>${otp}</strong>`,
  // });
}

