import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Notification } from '@/models';
import { verifyJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await req.json();
    const { isRead } = body;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: isRead !== undefined ? isRead : true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Verify ownership
    if (notification.user.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Verify ownership
    if (notification.user.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Notification.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Notification deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete notification error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
