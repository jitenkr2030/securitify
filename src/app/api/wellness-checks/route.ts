import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createTenantContext } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);

    const { searchParams } = new URL(request.url);
    const guardId = searchParams.get('guardId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const whereClause: any = {};
    if (guardId) whereClause.guardId = guardId;
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const wellnessChecks = await tenantDb.wellnessCheck({
      where: whereClause,
      include: {
        guard: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(wellnessChecks);
  } catch (error) {
    console.error('Error fetching wellness checks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wellness checks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);

    const body = await request.json();
    const {
      guardId,
      mood,
      energy,
      stress,
      sleep,
      notes
    } = body;

    // Validate required fields
    if (!guardId || !mood || !energy || !stress || !sleep) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify guard exists
    const guard = await tenantDb.findUniqueGuard({
      where: { id: guardId }
    });

    if (!guard) {
      return NextResponse.json(
        { error: 'Guard not found' },
        { status: 404 }
      );
    }

    const wellnessCheck = await tenantDb.createWellnessCheck({
      data: {
        guardId,
        mood,
        energy,
        stress,
        sleep,
        notes
      },
      include: {
        guard: true
      }
    });

    return NextResponse.json(wellnessCheck, { status: 201 });
  } catch (error) {
    console.error('Error creating wellness check:', error);
    return NextResponse.json(
      { error: 'Failed to create wellness check' },
      { status: 500 }
    );
  }
}