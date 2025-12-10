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

    const tenantId = session.user.tenantId;

    // Get guards that might have offline data (guards who haven't synced recently)
    const guards = await db.guard.findMany({
      where: {
        user: {
          tenantId: tenantId
        }
      },
      include: {
        locations: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        },
        attendances: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    // Generate mock offline data
    const offlineData = guards
      .filter(guard => Math.random() > 0.7) // 30% chance of having offline data
      .map(guard => {
        const dataTypes = ['location', 'attendance', 'alert', 'message'];
        const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        
        return {
          id: `${guard.id}-${Date.now()}`,
          guardName: guard.name,
          dataType: dataType as any,
          dataCount: Math.floor(Math.random() * 50) + 1,
          dataSize: Math.random() * 5 + 0.1, // 0.1-5.1 MB
          createdAt: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString(), // Within last 12 hours
          syncStatus: Math.random() > 0.5 ? 'pending' : Math.random() > 0.3 ? 'synced' : 'failed' as any,
        };
      });

    return NextResponse.json(offlineData);
  } catch (error) {
    console.error('Error fetching offline data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, dataIds } = body;

    if (action === 'sync') {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      return NextResponse.json({ 
        message: 'Sync completed successfully',
        syncedCount: dataIds?.length || 0,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing offline data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}