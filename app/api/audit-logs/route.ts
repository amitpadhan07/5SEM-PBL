import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { AuditLog } from '@/models';
import { verifyJWT } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AuditLog.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, action, resource, details, previousValue, newValue, ip, browser, device } = body;

    const log = new AuditLog({
      userId,
      action,
      resource,
      details,
      previousValue,
      newValue,
      ip,
      browser,
      device,
      timestamp: new Date(),
    });

    await log.save();

    return NextResponse.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Audit log creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
