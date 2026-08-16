import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Department, User } from '@/models';
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

    const departments = await Department.find({ isActive: true })
      .populate('hodId', 'fullName email')
      .sort({ name: 1 });

    return NextResponse.json({ departments }, { status: 200 });
  } catch (error) {
    console.error('Get departments error:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
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
    const { name, code, description, hodId } = body;

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if department code already exists
    const existingDept = await Department.findOne({ code });
    if (existingDept) {
      return NextResponse.json({ error: 'Department code already exists' }, { status: 400 });
    }

    const newDept = new Department({
      name,
      code: code.toUpperCase(),
      description,
      hodId: hodId || undefined,
    });

    await newDept.save();

    return NextResponse.json(
      {
        message: 'Department created successfully',
        department: newDept,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create department error:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
