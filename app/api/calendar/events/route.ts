import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueRequest, VenueBlock, Venue } from '@/models';
import { verifyJWT } from '@/lib/auth';

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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const venueId = searchParams.get('venueId');
    const view = searchParams.get('view') || 'month'; // month, week, day

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get approved requests
    const requests = await VenueRequest.find({
      status: 'Approved',
      dateStart: { $gte: start, $lte: end },
      ...(venueId && { venue: venueId }),
    })
      .populate('venue', 'name code')
      .populate('user', 'fullName email');

    // Get blocks
    const blocks = await VenueBlock.find({
      dateStart: { $gte: start, $lte: end },
      ...(venueId && { venue: venueId }),
      isExpired: false,
    })
      .populate('venue', 'name code')
      .populate('blockedBy', 'fullName');

    // Transform to calendar events
    const events = [
      ...requests.map((req) => ({
        id: req._id.toString(),
        title: `${req.eventName} (${(req.user as any).fullName})`,
        start: new Date(req.dateStart),
        end: new Date(req.dateEnd),
        resource: {
          type: 'request',
          requestId: req.requestId,
          venueName: (req.venue as any).name,
          organizer: (req.user as any).fullName,
          status: req.status,
          purpose: req.purpose,
          participants: req.expectedParticipants,
        },
        backgroundColor: '#3b82f6', // blue for approved requests
        borderColor: '#1e40af',
        textColor: 'white',
      })),
      ...blocks.map((block) => ({
        id: block._id.toString(),
        title: `BLOCKED: ${block.reason}`,
        start: new Date(block.dateStart),
        end: new Date(block.dateEnd),
        resource: {
          type: 'block',
          reason: block.reason,
          venueName: (block.venue as any).name,
          blockedBy: (block.blockedBy as any).fullName,
          notes: block.notes,
        },
        backgroundColor: '#ef4444', // red for blocks
        borderColor: '#dc2626',
        textColor: 'white',
        overlap: false,
        allDay: true,
      })),
    ];

    // Get pending requests (shown differently)
    const pendingRequests = await VenueRequest.find({
      status: 'Pending',
      dateStart: { $gte: start, $lte: end },
      ...(venueId && { venue: venueId }),
    })
      .populate('venue', 'name code')
      .populate('user', 'fullName email');

    const pendingEvents = pendingRequests.map((req) => ({
      id: req._id.toString(),
      title: `${req.eventName} (PENDING)`,
      start: new Date(req.dateStart),
      end: new Date(req.dateEnd),
      resource: {
        type: 'pending',
        requestId: req.requestId,
        venueName: (req.venue as any).name,
        organizer: (req.user as any).fullName,
        status: req.status,
      },
      backgroundColor: '#f59e0b', // amber for pending
      borderColor: '#d97706',
      textColor: 'white',
      opacity: 0.6,
    }));

    return NextResponse.json(
      {
        events,
        pending: pendingEvents,
        summary: {
          approved: requests.length,
          pending: pendingRequests.length,
          blocked: blocks.length,
          total: requests.length + pendingRequests.length + blocks.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get calendar events error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}
