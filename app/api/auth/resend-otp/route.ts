import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, OTP } from '@/models';
import { generateOTP, hashOTP } from '@/lib/auth';
import { sendEmail, emailTemplates } from '@/services/emailService';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Invalidate previous unexpired OTPs for email verification
    await OTP.updateMany(
      { email, purpose: 'email_verification', isUsed: false },
      { $set: { isUsed: true } }
    );

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({
      email,
      otp: hashedOTP,
      purpose: 'email_verification',
      expiresAt,
    });

    const collegeName = process.env.NEXT_PUBLIC_COLLEGE_NAME || 'College';
    const emailTemplate = emailTemplates.verificationOTP(user.fullName, otp, collegeName);

    const emailSent = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (!emailSent) {
      console.warn(`[Resend OTP] Could not send email to ${email}. Development Verification OTP: ${otp}`);
    }

    return NextResponse.json(
      {
        message: 'Verification OTP sent successfully to your email.',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Failed to resend OTP' }, { status: 500 });
  }
}
