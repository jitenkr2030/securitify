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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const guardId = searchParams.get('guardId');

    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (guardId) whereClause.guardId = guardId;

    const safetyChecks = await tenantDb.safetyCheck({
      where: whereClause,
      include: {
        guard: true,
        post: true,
        shift: true
      },
      orderBy: { checkedAt: 'desc' }
    });

    return NextResponse.json(safetyChecks);
  } catch (error) {
    console.error('Error fetching safety checks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch safety checks' },
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
      type,
      status,
      guardId,
      shiftId,
      postId,
      score,
      issues,
      recommendations
    } = body;

    // Validate required fields
    if (!type || !status || !guardId) {
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

    const safetyCheck = await tenantDb.createSafetyCheck({
      data: {
        type,
        status,
        guardId,
        userId: session.user.id,
        shiftId,
        postId,
        score,
        issues,
        recommendations
      },
      include: {
        guard: true,
        post: true,
        shift: true
      }
    });

    return NextResponse.json(safetyCheck, { status: 201 });
  } catch (error) {
    console.error('Error creating safety check:', error);
    return NextResponse.json(
      { error: 'Failed to create safety check' },
      { status: 500 }
    );
  }
}