import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const guards = await db.guard.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        shifts: {
          where: {
            status: 'in_progress'
          },
          include: {
            post: {
              select: {
                name: true,
                address: true
              }
            }
          },
          take: 1
        },
        locations: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(guards);
  } catch (error) {
    console.error('Error fetching guards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, address, salary, hourlyRate, userId } = body;

    // Check if guard with phone already exists
    const existingGuard = await db.guard.findFirst({
      where: { phone }
    });

    if (existingGuard) {
      return NextResponse.json(
        { error: 'Guard with this phone number already exists' },
        { status: 400 }
      );
    }

    const guard = await db.guard.create({
      data: {
        name,
        phone,
        email,
        address,
        salary: parseFloat(salary),
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(guard, { status: 201 });
  } catch (error) {
    console.error('Error creating guard:', error);
    return NextResponse.json(
      { error: 'Failed to create guard' },
      { status: 500 }
    );
  }
}