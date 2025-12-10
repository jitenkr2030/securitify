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
    const guardId = searchParams.get('guardId');
    const month = searchParams.get('month');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = { year };

    if (guardId) {
      where.guardId = guardId;
    }

    if (month) {
      where.month = month;
    }

    if (status) {
      where.status = status;
    }

    // Filter by tenant through guard relationship
    const guardWhere = guardId ? { id: guardId } : {};
    const guards = await db.guard.findMany({
      where: {
        ...guardWhere,
        user: {
          tenantId: session.user.tenantId,
        },
      },
      select: { id: true },
    });

    if (guards.length === 0) {
      return NextResponse.json({
        wageRegisters: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    where.guardId = { in: guards.map(g => g.id) };

    const [wageRegisters, total] = await Promise.all([
      db.pSARAWageRegister.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          guard: {
            select: {
              id: true,
              name: true,
              phone: true,
              salary: true,
            },
          },
        },
      }),
      db.pSARAWageRegister.count({ where }),
    ]);

    return NextResponse.json({
      wageRegisters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching PSARA wage registers:', error);
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
      guardId,
      month,
      year,
      basicWages,
      overtimeHours,
      overtimeWages,
      deductions,
      netWages,
      paymentDate,
      paymentMode,
      utrNumber,
      remarks,
    } = data;

    // Verify guard belongs to tenant
    const guard = await db.guard.findFirst({
      where: {
        id: guardId,
        user: {
          tenantId: session.user.tenantId,
        },
      },
    });

    if (!guard) {
      return NextResponse.json({ error: 'Guard not found' }, { status: 404 });
    }

    // Check if wage register already exists for this guard, month, and year
    const existingRegister = await db.pSARAWageRegister.findUnique({
      where: {
        guardId_month_year: {
          guardId,
          month,
          year,
        },
      },
    });

    if (existingRegister) {
      return NextResponse.json(
        { error: 'Wage register already exists for this guard, month, and year' },
        { status: 400 }
      );
    }

    const wageRegister = await db.pSARAWageRegister.create({
      data: {
        guardId,
        month,
        year,
        basicWages,
        overtimeHours: overtimeHours || 0,
        overtimeWages: overtimeWages || 0,
        deductions: deductions || 0,
        netWages,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        paymentMode,
        utrNumber,
        remarks,
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
            salary: true,
          },
        },
      },
    });

    return NextResponse.json(wageRegister, { status: 201 });
  } catch (error) {
    console.error('Error creating PSARA wage register:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}