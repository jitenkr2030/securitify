import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
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
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const guardId = searchParams.get('guardId');

    const whereClause: any = {};
    if (type) whereClause.type = type;
    if (severity) whereClause.severity = severity;
    if (status) whereClause.status = status;
    if (guardId) whereClause.guardId = guardId;

    const healthRecords = await db.healthRecord.findMany({
      where: { ...whereClause, tenantId },
      include: {
        guard: true,
        healthReports: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { reportedAt: 'desc' }
    });

    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health records' },
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
      description,
      severity,
      guardId,
      vitals,
      symptoms,
      treatment,
      followUpRequired,
      followUpDate
    } = body;

    // Validate required fields
    if (!type || !description || !guardId) {
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

    const healthRecord = await db.healthRecord.create({
      data: {
        type,
        description,
        severity: severity || 'medium',
        guardId,
        userId: session.user.id,
        vitals,
        symptoms,
        treatment,
        followUpRequired: followUpRequired || false,
        followUpDate
      },
      include: {
        guard: true,
        healthReports: true
      }
    });

    return NextResponse.json(healthRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating health record:', error);
    return NextResponse.json(
      { error: 'Failed to create health record' },
      { status: 500 }
    );
  }
}