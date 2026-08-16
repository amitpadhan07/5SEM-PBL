import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Venue, VenueRequest, Department } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();
    const type = searchParams.get('type');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { results: [] },
      });
    }

    const results: any = { venues: [], users: [], requests: [], departments: [] };

    // Search venues
    if (!type || type === 'venue') {
      const venues = await Venue.find(
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
            { building: { $regex: query, $options: 'i' } },
          ],
        },
        'name code building floor capacity type status'
      ).limit(10);
      results.venues = venues;
    }

    // Search users
    if (!type || type === 'user') {
      const users = await User.find(
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { studentId: { $regex: query, $options: 'i' } },
            { employeeId: { $regex: query, $options: 'i' } },
          ],
        },
        'name email role studentId employeeId department'
      ).limit(10);
      results.users = users;
    }

    // Search requests
    if (!type || type === 'request') {
      const requests = await VenueRequest.find(
        {
          $or: [
            { requestId: { $regex: query, $options: 'i' } },
            { eventName: { $regex: query, $options: 'i' } },
            { purpose: { $regex: query, $options: 'i' } },
          ],
        },
        'requestId eventName purpose dateStart status'
      ).limit(10);
      results.requests = requests;
    }

    // Search departments
    if (!type || type === 'department') {
      const departments = await Department.find(
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { code: { $regex: query, $options: 'i' } },
          ],
        },
        'name code head'
      ).limit(10);
      results.departments = departments;
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
