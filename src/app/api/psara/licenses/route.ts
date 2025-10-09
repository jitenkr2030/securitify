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
    const state = searchParams.get('state');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: session.user.tenantId,
    };

    if (state) {
      where.state = state;
    }

    if (status) {
      where.status = status;
    }

    const [licenses, total] = await Promise.all([
      db.pSARALicense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.pSARALicense.count({ where }),
    ]);

    return NextResponse.json({
      licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA licenses:', error);
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
      licenseNumber,
      state,
      licenseType,
      issuedDate,
      expiryDate,
      renewalReminder,
      documentUrl,
      authority,
    } = data;

    // Check if license already exists
    const existingLicense = await db.pSARALicense.findFirst({
      where: {
        licenseNumber,
        state,
        tenantId: session.user.tenantId,
      },
    });

    if (existingLicense) {
      return NextResponse.json(
        { error: 'License with this number already exists for this state' },
        { status: 400 }
      );
    }

    const license = await db.pSARALicense.create({
      data: {
        licenseNumber,
        state,
        licenseType,
        issuedDate: new Date(issuedDate),
        expiryDate: new Date(expiryDate),
        renewalReminder: renewalReminder || 30,
        documentUrl,
        authority,
        tenantId: session.user.tenantId,
      },
    });

    return NextResponse.json(license, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA license:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}