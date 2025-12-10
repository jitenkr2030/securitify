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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const guardId = searchParams.get('guardId');
    const postId = searchParams.get('postId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (guardId) {
      where.guardId = guardId;
    }

    if (postId) {
      where.postId = postId;
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status;
    }

    // Filter by tenant through guard relationship
    const guardWhere = guardId ? { id: guardId } : {};
    const guards = await db.guard.findMany({
      where: {
        ...guardWhere,
        user: {
          tenantId: session.user.tenantId,
        },
      },
      select: { id: true },
    });

    if (guards.length === 0) {
      return NextResponse.json({
        dutyRegisters: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    where.guardId = { in: guards.map(g => g.id) };

    const [dutyRegisters, total] = await Promise.all([
      db.pSARADutyRegister.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          guard: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          post: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      }),
      db.pSARADutyRegister.count({ where }),
    ]);

    return NextResponse.json({
      dutyRegisters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA duty registers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      guardId,
      postId,
      date,
      shiftType,
      startTime,
      endTime,
      location,
      dutyType,
      supervisor,
      remarks,
    } = data;

    // Verify guard belongs to tenant
    const guard = await db.guard.findFirst({
      where: {
        id: guardId,
        user: {
          tenantId: session.user.tenantId,
        },
      },
    });

    if (!guard) {
      return NextResponse.json({ error: 'Guard not found' }, { status: 404 });
    }

    // Verify post belongs to tenant
    const post = await db.post.findFirst({
      where: {
        id: postId,
        user: {
          tenantId: session.user.tenantId,
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if duty register already exists for this guard, date, and shift
    const existingRegister = await db.pSARADutyRegister.findUnique({
      where: {
        guardId_date_shiftType: {
          guardId,
          date: new Date(date),
          shiftType,
        },
      },
    });

    if (existingRegister) {
      return NextResponse.json(
        { error: 'Duty register already exists for this guard, date, and shift type' },
        { status: 400 }
      );
    }

    const dutyRegister = await db.pSARADutyRegister.create({
      data: {
        guardId,
        postId,
        date: new Date(date),
        shiftType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        dutyType,
        supervisor,
        remarks,
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        post: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json(dutyRegister, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA duty register:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}