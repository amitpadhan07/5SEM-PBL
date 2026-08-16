import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { VenueRequest, Venue, User, VenueBlock } from '@/models';
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
    const timeRange = searchParams.get('timeRange') || '30'; // days

    const daysAgo = parseInt(timeRange);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Total statistics
    const totalVenues = await Venue.countDocuments({ isArchived: false });
    const totalUsers = await User.countDocuments();
    const totalRequests = await VenueRequest.countDocuments();
    const approvedRequests = await VenueRequest.countDocuments({ status: 'Approved' });
    const pendingRequests = await VenueRequest.countDocuments({ status: 'Pending' });
    const rejectedRequests = await VenueRequest.countDocuments({ status: 'Rejected' });

    // Recent requests
    const recentRequests = await VenueRequest.find({ createdAt: { $gte: startDate } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName email')
      .populate('venue', 'name code');

    // Approval rate
    const totalDecided = approvedRequests + rejectedRequests;
    const approvalRate = totalDecided > 0 ? ((approvedRequests / totalDecided) * 100).toFixed(2) : 0;

    // Top venues by requests
    const topVenues = await VenueRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$venue', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'venues', localField: '_id', foreignField: '_id', as: 'venueInfo' } },
    ]);

    // Requests by status
    const requestsByStatus = await VenueRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Requests over time (daily)
    const requestsOverTime = await VenueRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Department-wise requests
    const departmentWiseRequests = await VenueRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'deptInfo' } },
    ]);

    // Peak hours
    const peakHours = await VenueRequest.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: '$dateStart' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Venue utilization
    const approvedByVenue = await VenueRequest.aggregate([
      { $match: { status: 'Approved', createdAt: { $gte: startDate } } },
      { $group: { _id: '$venue', count: { $sum: 1 } } },
    ]);

    const utilization = approvedByVenue.map((item) => ({
      venue: item._id,
      requests: item.count,
      utilizationRate: ((item.count / totalRequests) * 100).toFixed(2),
    }));

    return NextResponse.json(
      {
        summary: {
          totalVenues,
          totalUsers,
          totalRequests,
          approvedRequests,
          pendingRequests,
          rejectedRequests,
          approvalRate,
        },
        recentRequests: recentRequests.map((req) => ({
          id: req._id.toString(),
          requestId: req.requestId,
          eventName: req.eventName,
          status: req.status,
          user: (req.user as any)?.fullName,
          venue: (req.venue as any)?.name,
          createdAt: req.createdAt,
        })),
        topVenues: topVenues.map((v) => ({
          venueId: v._id,
          venueName: v.venueInfo[0]?.name || 'Unknown',
          requests: v.count,
        })),
        requestsByStatus,
        requestsOverTime,
        departmentWiseRequests: departmentWiseRequests.map((d) => ({
          departmentId: d._id,
          departmentName: d.deptInfo[0]?.name || 'Unknown',
          requests: d.count,
        })),
        peakHours,
        utilization,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
