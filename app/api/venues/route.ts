import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Venue, User, Building, AuditLog } from '@/models';
import { verifyJWT } from '@/lib/auth';
import { createVenueSchema } from '@/schemas/venue';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const query: any = { isArchived: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const venues = await Venue.find(query)
      .populate('building', 'name code')
      .populate('assignedAuthorities', 'fullName email role')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Venue.countDocuments(query);

    return NextResponse.json(
      {
        venues,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get venues error:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createVenueSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Check if venue code already exists
    const existingVenue = await Venue.findOne({ code: parsed.data.code });
    if (existingVenue) {
      return NextResponse.json({ error: 'Venue code already exists' }, { status: 400 });
    }

    // Check if building exists
    const building = await Building.findById(parsed.data.building);
    if (!building) {
      return NextResponse.json({ error: 'Building not found' }, { status: 404 });
    }

    const newVenue = new Venue({
      ...parsed.data,
      createdBy: user._id,
      statistics: {
        totalBookings: 0,
        averageMonthlyUsage: 0,
      },
    });

    await newVenue.save();

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'VenueCreate',
      resource: 'Venue',
      resourceId: newVenue._id.toString(),
      details: `Created venue: ${newVenue.name}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Venue created successfully',
        venue: newVenue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create venue error:', error);
    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 });
  }
}
