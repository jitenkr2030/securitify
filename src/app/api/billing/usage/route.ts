import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  let session: any = null;
  
  try {
    session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    
    // For now, return mock usage data
    // In a real implementation, you would calculate actual usage
    const mockUsage = {
      guards: {
        current: 5,
        limit: 10,
        percentage: 50
      },
      storage: {
        current: 2.5,
        limit: 10,
        unit: 'GB',
        percentage: 25
      },
      apiCalls: {
        current: 15000,
        limit: 50000,
        percentage: 30
      },
      reports: {
        current: 45,
        limit: 100,
        percentage: 45
      }
    };

    logger.info('Usage data retrieved successfully', { tenantId });

    return NextResponse.json(mockUsage);

  } catch (error) {
    logger.error('Failed to get usage data', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: session?.user?.tenantId || "unknown" 
    });

    return NextResponse.json(
      { error: 'Failed to get usage data' },
      { status: 500 }
    );
  }
}
