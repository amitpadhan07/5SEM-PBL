import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueBlock, User, Venue, AuditLog } from '@/models';
import { verifyJWT } from '@/lib/auth';
import { createVenueBlockSchema } from '@/schemas/venue';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const blocks = await VenueBlock.find({ venue: id })
      .populate('blockedBy', 'fullName email')
      .sort({ dateStart: -1 });

    return NextResponse.json({ blocks }, { status: 200 });
  } catch (error) {
    console.error('Get venue blocks error:', error);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

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

    // Check if venue exists
    const venue = await Venue.findById(id);
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createVenueBlockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const newBlock = new VenueBlock({
      venue: id,
      reason: parsed.data.reason,
      dateStart: new Date(parsed.data.dateStart),
      dateEnd: new Date(parsed.data.dateEnd),
      timeStart: parsed.data.timeStart,
      timeEnd: parsed.data.timeEnd,
      isFullDay: parsed.data.isFullDay,
      isRecurring: parsed.data.isRecurring || false,
      recurringPattern: parsed.data.recurringPattern,
      notes: parsed.data.notes,
      blockedBy: user._id,
    });

    await newBlock.save();

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'VenueBlock',
      resource: 'VenueBlock',
      resourceId: newBlock._id.toString(),
      details: `Blocked venue ${venue.name} for reason: ${parsed.data.reason}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Venue blocked successfully',
        block: newBlock,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create venue block error:', error);
    return NextResponse.json({ error: 'Failed to block venue' }, { status: 500 });
  }
}
