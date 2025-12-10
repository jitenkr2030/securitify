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
    const trainingType = searchParams.get('trainingType');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: session.user.tenantId,
    };

    if (trainingType) {
      where.trainingType = trainingType;
    }

    if (status) {
      where.status = status;
    }

    const [trainings, total] = await Promise.all([
      db.pSARATraining.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          trainingRecords: {
            include: {
              guard: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      db.pSARATraining.count({ where }),
    ]);

    return NextResponse.json({
      trainings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA trainings:', error);
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
      title,
      description,
      trainingType,
      duration,
      validFor,
      provider,
      certificate,
    } = data;

    const training = await db.pSARATraining.create({
      data: {
        title,
        description,
        trainingType,
        duration,
        validFor,
        provider,
        certificate,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA training:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}