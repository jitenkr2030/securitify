import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

// GET /api/leave/balances - Get all guard leave balances
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const guardId = searchParams.get('guardId');

    let whereClause: any = {};
    
    if (guardId) {
      whereClause.id = guardId;
    }

    const guards = await db.guard.findMany({
      where: whereClause,
      include: {
        leaves: {
          where: {
            status: 'approved',
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1) // Start of current year
            }
          }
        }
      }
    });

    const leaveBalances = guards.map(guard => {
      const usedLeave = guard.leaves.reduce((total, request) => total + request.days, 0);
      
      // Default leave balances (can be configured per guard in the future)
      const casualLeave = 12;
      const sickLeave = 10;
      const vacationLeave = 15;
      const totalLeave = casualLeave + sickLeave + vacationLeave;
      const remainingLeave = totalLeave - usedLeave;

      return {
        guardId: guard.id,
        guardName: guard.name,
        casualLeave,
        sickLeave,
        vacationLeave,
        totalLeave,
        usedLeave,
        remainingLeave
      };
    });

    return NextResponse.json(leaveBalances);
  } catch (error) {
    console.error('Error fetching leave balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave balances' },
      { status: 500 }
    );
  }
}