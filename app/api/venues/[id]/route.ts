import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Venue, User, AuditLog } from '@/models';
import { verifyJWT } from '@/lib/auth';

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

    const venue = await Venue.findById(id)
      .populate('building', 'name code')
      .populate('assignedAuthorities', 'fullName email role')
      .populate('createdBy', 'fullName email');

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    return NextResponse.json({ venue }, { status: 200 });
  } catch (error) {
    console.error('Get venue error:', error);
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await req.json();
    const venue = await Venue.findByIdAndUpdate(id, { ...body, updatedBy: user._id }, { new: true })
      .populate('building', 'name code')
      .populate('assignedAuthorities', 'fullName email role');

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'VenueUpdate',
      resource: 'Venue',
      resourceId: venue._id.toString(),
      details: `Updated venue: ${venue.name}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Venue updated', venue }, { status: 200 });
  } catch (error) {
    console.error('Update venue error:', error);
    return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const venue = await Venue.findByIdAndUpdate(id, { isArchived: true }, { new: true });

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'VenueDelete',
      resource: 'Venue',
      resourceId: venue._id.toString(),
      details: `Archived venue: ${venue.name}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Venue deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete venue error:', error);
    return NextResponse.json({ error: 'Failed to delete venue' }, { status: 500 });
  }
}
