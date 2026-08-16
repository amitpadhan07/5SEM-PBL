import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User, AuditLog } from '@/models';
import { comparePassword, generateJWT, generateRefreshToken } from '@/lib/auth';
import { loginSchema } from '@/schemas/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, rememberMe } = parsed.data;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in.',
          isEmailVerified: false,
          email: user.email,
        },
        { status: 400 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate tokens
    const token = generateJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());

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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token as httpOnly cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          profileCompletionPercentage: user.profileCompletionPercentage,
        },
      },
      { status: 200 }
    );

    // Set auth token cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
