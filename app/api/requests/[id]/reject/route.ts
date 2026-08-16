import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueRequest, User, Venue, AuditLog, Notification } from '@/models';
import { verifyJWT } from '@/lib/auth';
import { rejectRequestSchema } from '@/schemas/request';
import { sendEmail } from '@/services/emailService';

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

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = rejectRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const request = await VenueRequest.findById(parsed.data.requestId)
      .populate('user', 'fullName email')
      .populate('venue', 'name code');

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Check if user is authorized to reject
    const venue = await Venue.findById(request.venue);
    if (!venue?.assignedAuthorities.includes(payload.userId)) {
      return NextResponse.json({ error: 'Forbidden: Not assigned to this venue' }, { status: 403 });
    }

    // Update request
    request.status = 'Rejected';
    request.rejectionReason = parsed.data.reason;
    request.rejectedBy = user._id;
    request.rejectedAt = new Date();
    request.approvalHistory.push({
      authority: user._id,
      status: 'Rejected',
      timestamp: new Date(),
      rejectionReason: parsed.data.reason,
    });

    await request.save();

    // Send email to requester
    const requester = await User.findById(request.user);
    if (requester) {
      const emailTemplate = {
        subject: `Venue Request Rejected - ${request.eventName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Request Rejected</h1>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <p>Hi ${requester.fullName},</p>
              <p>Unfortunately, your venue request has been rejected.</p>
              <p><strong>Request Details:</strong></p>
              <ul>
                <li>Request ID: ${request.requestId}</li>
                <li>Event: ${request.eventName}</li>
                <li>Venue: ${(request.venue as any).name}</li>
                <li>Status: <span style="color: #EF4444; font-weight: bold;">REJECTED</span></li>
              </ul>
              <p><strong>Reason for Rejection:</strong></p>
              <p style="background: #FEE2E2; padding: 12px; border-radius: 4px; border-left: 4px solid #EF4444;">
                ${parsed.data.reason}
              </p>
              <p style="margin-top: 20px;">You can submit a new request for a different date or venue.</p>
            </div>
            <div style="padding: 20px; background: #f3f4f6; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
              <p>Venue Management System</p>
            </div>
          </div>
        `,
      };

      await sendEmail({
        to: requester.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      // Create in-app notification
      await Notification.create({
        user: request.user,
        type: 'RequestRejected',
        title: 'Request Rejected',
        message: `Your request for ${(request.venue as any).name} has been rejected: ${parsed.data.reason.substring(0, 50)}...`,
        relatedId: request._id.toString(),
        relatedType: 'Request',
      });
    }

    // Log audit
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await AuditLog.create({
      user: user._id,
      role: user.role,
      action: 'Rejection',
      resource: 'VenueRequest',
      resourceId: request._id.toString(),
      details: `Rejected request ${request.requestId}: ${parsed.data.reason}`,
      ipAddress: clientIp,
      userAgent,
      timestamp: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Request rejected successfully',
        request,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reject request error:', error);
    return NextResponse.json({ error: 'Failed to reject request' }, { status: 500 });
  }
}
