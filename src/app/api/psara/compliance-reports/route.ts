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
    const reportType = searchParams.get('reportType');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: session.user.tenantId,
    };

    if (reportType) {
      where.reportType = reportType;
    }

    if (status) {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      db.pSARAComplianceReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { generatedAt: 'desc' },
      }),
      db.pSARAComplianceReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA compliance reports:', error);
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
      reportType,
      period,
      data: reportData,
      remarks,
    } = data;

    // Check if report already exists for this type and period
    const existingReport = await db.pSARAComplianceReport.findFirst({
      where: {
        reportType,
        period,
        tenantId: session.user.tenantId,
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'Report already exists for this type and period' },
        { status: 400 }
      );
    }

    const report = await db.pSARAComplianceReport.create({
      data: {
        reportType,
        period,
        generatedBy: session.user.id,
        data: JSON.stringify(reportData || {}),
        remarks,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA compliance report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}