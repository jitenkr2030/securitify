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
    const status = searchParams.get('status');
    const agreementType = searchParams.get('agreementType');

    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: session.user.tenantId,
    };

    if (status) {
      where.status = status;
    }

    if (agreementType) {
      where.agreementType = agreementType;
    }

    const [agreements, total] = await Promise.all([
      db.pSARAClientAgreement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.pSARAClientAgreement.count({ where }),
    ]);

    return NextResponse.json({
      agreements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA client agreements:', error);
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
      agreementNumber,
      clientName,
      clientAddress,
      clientContact,
      startDate,
      endDate,
      agreementType,
      services,
      terms,
      value,
      renewalReminder,
      documentUrl,
    } = data;

    // Check if agreement already exists
    const existingAgreement = await db.pSARAClientAgreement.findFirst({
      where: {
        agreementNumber,
        tenantId: session.user.tenantId,
      },
    });

    if (existingAgreement) {
      return NextResponse.json(
        { error: 'Agreement with this number already exists' },
        { status: 400 }
      );
    }

    const agreement = await db.pSARAClientAgreement.create({
      data: {
        agreementNumber,
        clientName,
        clientAddress,
        clientContact,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        agreementType,
        services: JSON.stringify(services || []),
        terms,
        value,
        renewalReminder: renewalReminder || 30,
        documentUrl,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(agreement, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA client agreement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}