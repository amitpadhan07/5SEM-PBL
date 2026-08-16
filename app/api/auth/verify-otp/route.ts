import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, OTP, AuditLog } from '@/models';
import { verifyOTP, generateJWT } from '@/lib/auth';
import { verifyOTPSchema } from '@/schemas/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = verifyOTPSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      purpose: 'email_verification',
      isUsed: false,
    });

    if (!otpRecord) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 });
    }

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    // Update user
    user.isEmailVerified = true;
    user.profileCompletionPercentage = 50;
    await user.save();

    // Generate JWT
    const token = generateJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'Login',
      resource: 'User',
      resourceId: user._id.toString(),
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    user.lastLogin = new Date();
    await user.save();

    const response = NextResponse.json(
      {
        message: 'Email verified successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
