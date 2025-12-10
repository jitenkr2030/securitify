import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
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

    const reports = await db.incidentReport.findMany({
      where: { incidentId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching incident reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incident reports' },
      { status: 500 }
    );
  }
}

export async function POST(
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
      reportType,
      content,
      attachments
    } = body;

    // Validate required fields
    if (!reportType || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify incident exists
    const incident = await db.incident.findUnique({
      where: { id: incidentId }
    });

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    const report = await db.incidentReport.create({
      data: {
        reportType,
        content,
        attachments,
        reportedBy: session.user.name || 'Unknown',
        incidentId
      }
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating incident report:', error);
    return NextResponse.json(
      { error: 'Failed to create incident report' },
      { status: 500 }
    );
  }
}