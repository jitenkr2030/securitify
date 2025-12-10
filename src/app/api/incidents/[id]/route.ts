import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createTenantContext } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);
    const incidentId = (await context.params).id;

    const incident = await tenantDb.findUniqueIncident({
      where: { id: incidentId },
      include: {
        guard: true,
        incidentReports: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);
    const incidentId = (await context.params).id;

    const body = await request.json();
    const {
      status,
      resolution,
      actionTaken,
      severity
    } = body;

    const incident = await tenantDb.updateIncident({
      where: { id: incidentId },
      data: {
        ...(status && { status }),
        ...(resolution && { resolution }),
        ...(actionTaken && { actionTaken }),
        ...(severity && { severity }),
        ...(status === 'resolved' && { resolvedAt: new Date() })
      },
      include: {
        guard: true,
        incidentReports: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error('Error updating incident:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);
    const incidentId = (await context.params).id;

    await tenantDb.deleteIncident({
      where: { id: incidentId }
    });

    return NextResponse.json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.error('Error deleting incident:', error);
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    );
  }
}