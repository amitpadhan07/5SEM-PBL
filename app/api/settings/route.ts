import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SystemSettings } from '@/models';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let settings = await SystemSettings.findOne();

    if (!settings) {
      // Create default settings if they don't exist
      settings = new SystemSettings({
        collegeInfo: {
          name: 'Your College Name',
          timezone: 'Asia/Kolkata',
        },
        auth: {
          otpExpiry: 10,
          sessionTimeout: 24,
        },
        booking: {
          requestExpiry: 48,
          maxAdvanceBookingDays: 365,
          maxBookingDuration: 8,
        },
      });
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded || decoded.role !== 'Admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const updates = body;

    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(updates);
    } else {
      Object.assign(settings, updates);
    }

    settings.updatedAt = new Date();
    settings.updatedBy = decoded.userId;
    await settings.save();

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
