import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, OTP } from '@/models';
import { hashPassword, generateOTP, hashOTP, generateJWT } from '@/lib/auth';
import { signupSchema } from '@/schemas/auth';
import { sendEmail, emailTemplates } from '@/services/emailService';
import { AuditLog } from '@/models';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { fullName, email, designation, studentId, employeeId, password } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        // Invalidate old OTPs & generate fresh OTP
        await OTP.updateMany(
          { email, purpose: 'email_verification', isUsed: false },
          { $set: { isUsed: true } }
        );

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
        const emailTemplate = emailTemplates.verificationOTP(existingUser.fullName, otp, collegeName);

        const emailSent = await sendEmail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        if (!emailSent) {
          console.warn(`[Signup] Could not send email to ${email}. Development Verification OTP: ${otp}`);
        }

        return NextResponse.json(
          {
            error: 'An account with this email already exists but is not verified.',
            isEmailVerified: false,
            email,
            message: 'A new verification OTP has been sent to your email. Click "Verify Email" to proceed.',
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: designation,
      studentId: designation === 'Student' ? studentId : undefined,
      employeeId: designation !== 'Student' ? employeeId : undefined,
      isEmailVerified: false,
      profileCompletionPercentage: 30,
    });

    await newUser.save();

    // Generate and send OTP
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
    const emailTemplate = emailTemplates.verificationOTP(fullName, otp, collegeName);

    const emailSent = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (!emailSent) {
      console.warn(`[Signup] Could not send email to ${email}. Development Verification OTP: ${otp}`);
    }

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: newUser._id,
      role: designation,
      action: 'Signup',
      resource: 'User',
      resourceId: newUser._id.toString(),
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Signup successful. OTP sent to email.',
        userId: newUser._id,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
