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
    
    // For now, return mock invoice data
    // In a real implementation, you would fetch from Stripe or your database
    const mockInvoices = [
      {
        id: 'inv_123456789',
        amount: 99,
        currency: 'usd',
        status: 'paid',
        created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: 'https://stripe.com/invoice/pdf'
      },
      {
        id: 'inv_987654321',
        amount: 99,
        currency: 'usd',
        status: 'paid',
        created: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        pdfUrl: 'https://stripe.com/invoice/pdf'
      }
    ];

    logger.info('Invoices retrieved successfully', { tenantId, count: mockInvoices.length });

    return NextResponse.json(mockInvoices);

  } catch (error) {
    logger.error('Failed to get invoices', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: session?.user?.tenantId || "unknown" 
    });

    return NextResponse.json(
      { error: 'Failed to get invoices' },
      { status: 500 }
    );
  }
}
