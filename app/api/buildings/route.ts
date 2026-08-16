import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Building, User } from '@/models';
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

    const buildings = await Building.find({ isActive: true }).sort({ name: 1 });

    return NextResponse.json({ buildings }, { status: 200 });
  } catch (error) {
    console.error('Get buildings error:', error);
    return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 });
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

    // Check if user is admin
    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, campus, floors, description } = body;

    if (!name || !code || !floors) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if building code already exists
    const existingBuilding = await Building.findOne({ code });
    if (existingBuilding) {
      return NextResponse.json({ error: 'Building code already exists' }, { status: 400 });
    }

    const newBuilding = new Building({
      name,
      code: code.toUpperCase(),
      campus,
      floors: parseInt(floors),
      description,
    });

    await newBuilding.save();

    return NextResponse.json(
      {
        message: 'Building created successfully',
        building: newBuilding,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create building error:', error);
    return NextResponse.json({ error: 'Failed to create building' }, { status: 500 });
  }
}
