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
    const trainingId = searchParams.get('trainingId');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (guardId) {
      where.guardId = guardId;
    }

    if (trainingId) {
      where.trainingId = trainingId;
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
        trainingRecords: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    where.guardId = { in: guards.map(g => g.id) };

    const [trainingRecords, total] = await Promise.all([
      db.pSARATrainingRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { completionDate: 'desc' },
        include: {
          guard: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          training: {
            select: {
              id: true,
              title: true,
              trainingType: true,
              duration: true,
            },
          },
        },
      }),
      db.pSARATrainingRecord.count({ where }),
    ]);

    return NextResponse.json({
      trainingRecords,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA training records:', error);
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
      trainingId,
      completionDate,
      expiryDate,
      score,
      certificateUrl,
      instructor,
      notes,
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

    // Verify training belongs to tenant
    const training = await db.pSARATraining.findFirst({
      where: {
        id: trainingId,
        tenantId: session.user.tenantId,
      },
    });

    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }

    // Check if record already exists
    const existingRecord = await db.pSARATrainingRecord.findUnique({
      where: {
        guardId_trainingId: {
          guardId,
          trainingId,
        },
      },
    });

    if (existingRecord) {
      return NextResponse.json(
        { error: 'Training record already exists for this guard and training' },
        { status: 400 }
      );
    }

    const trainingRecord = await db.pSARATrainingRecord.create({
      data: {
        guardId,
        trainingId,
        completionDate: new Date(completionDate),
        expiryDate: new Date(expiryDate),
        score,
        certificateUrl,
        instructor,
        notes,
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        training: {
          select: {
            id: true,
            title: true,
            trainingType: true,
            duration: true,
          },
        },
      },
    });

    return NextResponse.json(trainingRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA training record:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}