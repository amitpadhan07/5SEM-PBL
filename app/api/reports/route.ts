import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VenueRequest, Venue, User } from '@/models';
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
    const reportType = searchParams.get('type'); // daily, monthly, utilization, department, peak-hours
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    let report: any = {};

    if (reportType === 'daily') {
      // Daily bookings
      const bookings = await VenueRequest.find({
        dateStart: { $gte: start, $lte: end },
        status: 'Approved',
      })
        .populate('venueId', 'name code')
        .populate('userId', 'name email')
        .lean();

      report = {
        type: 'Daily Bookings',
        date: start,
        total: bookings.length,
        bookings,
      };
    } else if (reportType === 'monthly') {
      // Monthly bookings
      const bookings = await VenueRequest.aggregate([
        {
          $match: {
            dateStart: { $gte: start, $lte: end },
            status: 'Approved',
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$dateStart' },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      report = {
        type: 'Monthly Bookings',
        startDate: start,
        endDate: end,
        bookings,
      };
    } else if (reportType === 'utilization') {
      // Venue utilization
      const totalVenues = await Venue.countDocuments({ status: { $ne: 'Archived' } });
      const venueUtilization = await VenueRequest.aggregate([
        {
          $match: {
            dateStart: { $gte: start, $lte: end },
            status: 'Approved',
          },
        },
        {
          $group: {
            _id: '$venueId',
            bookingCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'venues',
            localField: '_id',
            foreignField: '_id',
            as: 'venue',
          },
        },
      ]);

      report = {
        type: 'Venue Utilization',
        startDate: start,
        endDate: end,
        totalVenues,
        venueUtilization,
      };
    } else if (reportType === 'department') {
      // Department-wise bookings
      const departmentBookings = await VenueRequest.aggregate([
        {
          $match: {
            dateStart: { $gte: start, $lte: end },
            status: 'Approved',
          },
        },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
      ]);

      report = {
        type: 'Department-wise Bookings',
        startDate: start,
        endDate: end,
        departments: departmentBookings,
      };
    } else if (reportType === 'peak-hours') {
      // Peak booking hours
      const peakHours = await VenueRequest.aggregate([
        {
          $match: {
            dateStart: { $gte: start, $lte: end },
            status: 'Approved',
          },
        },
        {
          $group: {
            _id: { $hour: '$startTime' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      report = {
        type: 'Peak Booking Hours',
        startDate: start,
        endDate: end,
        hours: peakHours,
      };
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
