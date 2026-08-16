import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueRequest, User, Venue, VenueBlock, AuditLog, Notification } from '@/models';
import { verifyJWT, generateRequestId } from '@/lib/auth';
import { createVenueRequestSchema } from '@/schemas/request';
import { sendEmail, emailTemplates } from '@/services/emailService';

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
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const query: any = {};

    if (status) query.status = status;
    if (userId) query.user = userId;
    else query.user = payload.userId; // Default to own requests for non-admins

    const user = await User.findById(payload.userId);
    if (user?.role === 'Admin') {
      delete query.user; // Admins see all
    }

    const skip = (page - 1) * limit;

    const requests = await VenueRequest.find(query)
      .populate('user', 'fullName email role')
      .populate('venue', 'name code')
      .populate('department', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await VenueRequest.countDocuments(query);

    return NextResponse.json(
      {
        requests,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
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

    const body = await req.json();
    const parsed = createVenueRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const venue = await Venue.findById(parsed.data.venue);
    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    // Check for blocks
    const blocks = await VenueBlock.findOne({
      venue: parsed.data.venue,
      $or: [
        {
          dateStart: { $lte: new Date(parsed.data.dateEnd) },
          dateEnd: { $gte: new Date(parsed.data.dateStart) },
        },
      ],
    });

    if (blocks) {
      return NextResponse.json(
        { error: 'Venue is blocked during this period' },
        { status: 400 }
      );
    }

    // Check for overlapping requests
    const overlap = await VenueRequest.findOne({
      venue: parsed.data.venue,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        {
          dateStart: { $lte: new Date(parsed.data.dateEnd) },
          dateEnd: { $gte: new Date(parsed.data.dateStart) },
        },
      ],
    });

    if (overlap) {
      return NextResponse.json(
        {
          error: 'Venue already booked for this time period',
          conflictingRequest: overlap.requestId,
        },
        { status: 400 }
      );
    }

    const requestId = generateRequestId();
    const expiryHours = parseInt(process.env.REQUEST_EXPIRY_HOURS || '48');
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    const newRequest = new VenueRequest({
      requestId,
      user: user._id,
      venue: parsed.data.venue,
      eventName: parsed.data.eventName,
      purpose: parsed.data.purpose,
      organizer: parsed.data.organizer,
      department: parsed.data.department,
      expectedParticipants: parsed.data.expectedParticipants,
      chiefGuest: parsed.data.chiefGuest,
      dateStart: new Date(parsed.data.dateStart),
      dateEnd: new Date(parsed.data.dateEnd),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      requirements: parsed.data.requirements || [],
      remarks: parsed.data.remarks,
      attachments: parsed.data.attachments || [],
      status: 'Pending',
      expiresAt,
    });

    await newRequest.save();

    // Get authorities for venue
    const authorities = venue.assignedAuthorities;

    // Send notifications to authorities
    for (const authorityId of authorities) {
      const authority = await User.findById(authorityId);
      if (authority) {
        const emailTemplate = {
          subject: `New Venue Request - ${parsed.data.eventName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #2563EB 0%, #14B8A6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">New Venue Request</h1>
              </div>
              <div style="padding: 20px; background: #f9fafb;">
                <p>Hi ${authority.fullName},</p>
                <p>A new venue request has been submitted and requires your approval.</p>
                <p><strong>Request Details:</strong></p>
                <ul>
                  <li>Request ID: ${requestId}</li>
                  <li>Event: ${parsed.data.eventName}</li>
                  <li>Venue: ${venue.name}</li>
                  <li>Date: ${new Date(parsed.data.dateStart).toLocaleDateString()}</li>
                  <li>Time: ${parsed.data.startTime} - ${parsed.data.endTime}</li>
                  <li>Requester: ${user.fullName}</li>
                </ul>
                <p style="margin-top: 20px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/requests/${requestId}" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Review Request
                  </a>
                </p>
              </div>
              <div style="padding: 20px; background: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
                <p>Venue Management System</p>
              </div>
            </div>
          `,
        };

        await sendEmail({
          to: authority.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        });

        // Create in-app notification
        await Notification.create({
          user: authorityId,
          type: 'RequestReceived',
          title: 'New Venue Request',
          message: `${user.fullName} requested ${venue.name} for ${parsed.data.eventName}`,
          relatedId: newRequest._id.toString(),
          relatedType: 'Request',
        });
      }
    }

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'RequestSubmit',
      resource: 'VenueRequest',
      resourceId: newRequest._id.toString(),
      details: `Submitted request for ${parsed.data.eventName} at ${venue.name}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Request submitted successfully',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
