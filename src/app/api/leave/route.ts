import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

// GET /api/leave - Get all leave requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const guardId = searchParams.get('guardId');

    let whereClause: any = {};
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (type && type !== 'all') {
      whereClause.leaveType = type;
    }
    
    if (guardId) {
      whereClause.guardId = guardId;
    }

    const leaveRequests = await db.leave.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave requests' },
      { status: 500 }
    );
  }
}

// POST /api/leave - Create new leave request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { guardId, leaveType, startDate, endDate, reason } = body;

    if (!guardId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check for overlapping leave requests
    const overlappingLeave = await db.leave.findFirst({
      where: {
        guardId,
        status: { in: ['pending', 'approved'] },
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } }
            ]
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } }
            ]
          },
          {
            AND: [
              { startDate: { gte: startDate } },
              { endDate: { lte: endDate } }
            ]
          }
        ]
      }
    });

    if (overlappingLeave) {
      return NextResponse.json(
        { error: 'Guard already has leave during this period' },
        { status: 400 }
      );
    }

    const leaveRequest = await db.leave.create({
      data: {
        guardId,
        leaveType,
        startDate,
        endDate,
        reason,
        days,
        status: 'pending',
        userId: session.user.id
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        }
      }
    });

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json(
      { error: 'Failed to create leave request' },
      { status: 500 }
    );
  }
}