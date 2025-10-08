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
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const guardId = searchParams.get('guardId');

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    if (guardId) whereClause.guardId = guardId;

    const incidents = await tenantDb.incident({
      where: whereClause,
      include: {
        guard: true,
        incidentReports: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { occurredAt: 'desc' }
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
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
      title,
      description,
      type,
      severity,
      location,
      latitude,
      longitude,
      guardId,
      witnesses,
      evidence
    } = body;

    // Validate required fields
    if (!title || !description || !type || !guardId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify guard exists and belongs to tenant
    const guard = await tenantDb.findUniqueGuard({
      where: { id: guardId }
    });

    if (!guard) {
      return NextResponse.json(
        { error: 'Guard not found' },
        { status: 404 }
      );
    }

    const incident = await tenantDb.createIncident({
      data: {
        title,
        description,
        type,
        severity: severity || 'medium',
        location,
        latitude,
        longitude,
        witnesses,
        evidence,
        userId: session.user.id,
        guardId
      },
      include: {
        guard: true,
        incidentReports: true
      }
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    );
  }
}