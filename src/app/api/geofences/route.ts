import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = session.user.tenantId;

    const geofences = await db.geofence.findMany({
      where: { tenantId },
      include: {
        post: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(geofences);
  } catch (error) {
    console.error('Error fetching geofences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      latitude,
      longitude,
      radius,
      postId,
      alertTypes,
      schedule,
    } = body;

    const tenantId = session.user.tenantId;

    // Validate required fields
    if (!name || !latitude || !longitude || !radius || !postId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if post exists and belongs to tenant
    const post = await db.post.findFirst({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const geofence = await db.geofence.create({
      data: {
        name,
        latitude,
        longitude,
        radius,
        postId,
        tenantId,
        alertTypes: alertTypes || ['entry', 'exit'],
        schedule: schedule || {
          enabled: false,
          startTime: '09:00',
          endTime: '18:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
        isActive: true,
      },
      include: {
        post: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(geofence);
  } catch (error) {
    console.error('Error creating geofence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}