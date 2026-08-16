import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Venue, User, AuditLog } from '@/models';
import { verifyJWT } from '@/lib/auth';
import { assignAuthoritySchema } from '@/schemas/venue';

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
    const parsed = assignAuthoritySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, venues } = parsed.data;

    // Check if user exists and has appropriate role
    const authorityUser = await User.findById(userId);
    if (!authorityUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const validRoles = ['Faculty', 'HOD', 'Exam Cell'];
    if (!validRoles.includes(authorityUser.role)) {
      return NextResponse.json(
        { error: 'User must have Faculty, HOD, or Exam Cell role' },
        { status: 400 }
      );
    }

    // Update venues with new authority
    await Venue.updateMany(
      { _id: { $in: venues } },
      {
        $addToSet: { assignedAuthorities: userId },
      }
    );

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'AuthorityAssign',
      resource: 'Venue',
      details: `Assigned authority ${authorityUser.fullName} to ${venues.length} venue(s)`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Authority assigned successfully',
        authority: {
          id: authorityUser._id,
          name: authorityUser.fullName,
          email: authorityUser.email,
          role: authorityUser.role,
        },
        venuesCount: venues.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assign authority error:', error);
    return NextResponse.json({ error: 'Failed to assign authority' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    const { userId, venues } = body;

    if (!userId || !venues || !Array.isArray(venues)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Remove authority from venues
    await Venue.updateMany(
      { _id: { $in: venues } },
      {
        $pull: { assignedAuthorities: userId },
      }
    );

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'AuthorityAssign',
      resource: 'Venue',
      details: `Removed authority from ${venues.length} venue(s)`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Authority removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Remove authority error:', error);
    return NextResponse.json({ error: 'Failed to remove authority' }, { status: 500 });
  }
}
