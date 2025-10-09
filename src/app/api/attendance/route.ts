import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guardId = searchParams.get('guardId');
    const shiftId = searchParams.get('shiftId');
    const date = searchParams.get('date');

    let whereClause: any = {};
    
    if (guardId) {
      whereClause.guardId = guardId;
    }
    
    if (shiftId) {
      whereClause.shiftId = shiftId;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.createdAt = {
        gte: startDate,
        lt: endDate
      };
    }

    const attendances = await db.attendance.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        shift: {
          include: {
            post: {
              select: {
                name: true,
                address: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, guardId, shiftId, latitude, longitude, userId } = body;

    // Check if attendance record exists
    let attendance = await db.attendance.findFirst({
      where: {
        guardId,
        shiftId
      }
    });

    if (type === 'check-in') {
      if (attendance && attendance.checkInTime) {
        return NextResponse.json(
          { error: 'Already checked in for this shift' },
          { status: 400 }
        );
      }

      const now = new Date();
      const shift = await db.shift.findUnique({
        where: { id: shiftId },
        include: {
          guard: true
        }
      });

      if (!shift) {
        return NextResponse.json(
          { error: 'Shift not found' },
          { status: 404 }
        );
      }

      // Check if late
      const shiftStartTime = new Date(shift.startTime);
      const isLate = now > shiftStartTime;
      const lateMinutes = isLate ? Math.floor((now.getTime() - shiftStartTime.getTime()) / (1000 * 60)) : 0;

      attendance = await db.attendance.upsert({
        where: {
          id: attendance?.id || 'temp'
        },
        create: {
          guardId,
          shiftId,
          userId,
          checkInTime: now,
          checkInLat: latitude,
          checkInLng: longitude,
          status: isLate ? 'late' : 'present'
        },
        update: {
          checkInTime: now,
          checkInLat: latitude,
          checkInLng: longitude,
          status: isLate ? 'late' : 'present'
        },
        include: {
          guard: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          shift: {
            include: {
              post: {
                select: {
                  name: true,
                  address: true
                }
              }
            }
          }
        }
      });

      // Create late arrival alert if applicable
      if (isLate && lateMinutes > 15) {
        await db.alert.create({
          data: {
            type: 'late_arrival',
            message: `Guard ${shift.guard.name} arrived ${lateMinutes} minutes late`,
            severity: 'medium',
            guardId,
            userId
          }
        });
      }

    } else if (type === 'check-out') {
      if (!attendance || !attendance.checkInTime) {
        return NextResponse.json(
          { error: 'Must check in first' },
          { status: 400 }
        );
      }

      if (attendance.checkOutTime) {
        return NextResponse.json(
          { error: 'Already checked out for this shift' },
          { status: 400 }
        );
      }

      const now = new Date();
      const shift = await db.shift.findUnique({
        where: { id: shiftId },
        include: {
          guard: true
        }
      });

      if (!shift) {
        return NextResponse.json(
          { error: 'Shift not found' },
          { status: 404 }
        );
      }

      // Check if early departure
      const shiftEndTime = new Date(shift.endTime);
      const isEarly = now < shiftEndTime;
      const earlyMinutes = isEarly ? Math.floor((shiftEndTime.getTime() - now.getTime()) / (1000 * 60)) : 0;

      attendance = await db.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOutTime: now,
          checkOutLat: latitude,
          checkOutLng: longitude
        },
        include: {
          guard: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          },
          shift: {
            include: {
              post: {
                select: {
                  name: true,
                  address: true
                }
              }
            }
          }
        }
      });

      // Create early departure alert if applicable
      if (isEarly && earlyMinutes > 15) {
        await db.alert.create({
          data: {
            type: 'early_departure',
            message: `Guard ${shift.guard.name} left ${earlyMinutes} minutes early`,
            severity: 'medium',
            guardId,
            userId
          }
        });
      }
    }

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error processing attendance:', error);
    return NextResponse.json(
      { error: 'Failed to process attendance' },
      { status: 500 }
    );
  }
}