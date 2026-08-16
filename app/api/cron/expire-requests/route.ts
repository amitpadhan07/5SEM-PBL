import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueRequest, User, AuditLog, Notification } from '@/models';
import { sendEmail } from '@/services/emailService';

// Verify cron secret
function verifyCronSecret(token: string): boolean {
  const secret = process.env.CRON_SECRET;
  return !!(secret && token === secret);
}

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (!verifyCronSecret(token)) {
      return NextResponse.json({ error: 'Invalid cron secret' }, { status: 401 });
    }

    await dbConnect();

    // Find all pending requests that have expired
    const now = new Date();
    const expiredRequests = await VenueRequest.find({
      status: 'Pending',
      expiresAt: { $lte: now },
    }).populate('user', 'fullName email').populate('venue', 'name code');

    console.log(`[v0] Found ${expiredRequests.length} expired requests to process`);

    let processedCount = 0;

    for (const request of expiredRequests) {
      try {
        // Update request status
        request.status = 'Expired';
        await request.save();

        // Send email to requester
        const requester = await User.findById(request.user);
        if (requester) {
          const emailTemplate = {
            subject: `Venue Request Expired - ${request.eventName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0;">Request Expired</h1>
                </div>
                <div style="padding: 20px; background: #f9fafb;">
                  <p>Hi ${requester.fullName},</p>
                  <p>Your venue request has expired due to no action from the authority.</p>
                  <p><strong>Request Details:</strong></p>
                  <ul>
                    <li>Request ID: ${request.requestId}</li>
                    <li>Event: ${request.eventName}</li>
                    <li>Venue: ${(request.venue as any).name}</li>
                    <li>Status: <span style="color: #F59E0B; font-weight: bold;">EXPIRED</span></li>
                  </ul>
                  <p>You can submit a new request to book the venue again.</p>
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

          // Create notification
          await Notification.create({
            user: request.user,
            type: 'RequestExpired',
            title: 'Request Expired',
            message: `Your request for ${(request.venue as any).name} has expired`,
            relatedId: request._id.toString(),
            relatedType: 'Request',
          });
        }

        // Notify authorities
        const venue = await (await dbConnect()).model('Venue').findById(request.venue);
        if (venue && venue.assignedAuthorities) {
          for (const authorityId of venue.assignedAuthorities) {
            const authority = await User.findById(authorityId);
            if (authority) {
              await Notification.create({
                user: authorityId,
                type: 'RequestExpired',
                title: 'Request Expired',
                message: `Request ${request.requestId} for ${(request.venue as any).name} has expired`,
                relatedId: request._id.toString(),
                relatedType: 'Request',
              });
            }
          }
        }

        // Log audit
        await AuditLog.create({
          user: null,
          role: 'System',
          action: 'Expiry',
          resource: 'VenueRequest',
          resourceId: request._id.toString(),
          details: `Auto-expired request ${request.requestId}`,
          timestamp: new Date(),
        });

        processedCount++;
      } catch (error) {
        console.error(`[v0] Error processing expired request ${request.requestId}:`, error);
      }
    }

    return NextResponse.json(
      {
        message: `Successfully processed ${processedCount} expired requests`,
        processedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Expire requests cron error:', error);
    return NextResponse.json({ error: 'Failed to process expired requests' }, { status: 500 });
  }
}

// Also support POST for Vercel Cron
export async function POST(req: NextRequest) {
  return GET(req);
}
