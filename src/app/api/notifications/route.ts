import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const guardId = searchParams.get('guardId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    let whereClause: any = {};
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (guardId) {
      whereClause.guardId = guardId;
    }
    
    if (unreadOnly) {
      whereClause.read = false;
    }

    const notifications = await db.notification.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, userId, guardId, priority } = body;

    const notification = await db.notification.create({
      data: {
        title,
        message,
        type,
        priority: priority || 'medium',
        userId,
        guardId,
        read: false
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send push notification via WebSocket
    const { Server } = await import('socket.io');
    const io = new Server();

    if (userId) {
      io.to(`user-${userId}`).emit('notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    }

    if (guardId) {
      io.to(`guard-${guardId}`).emit('notification', {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    const notification = await db.notification.update({
      where: { id },
      data: { read },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}