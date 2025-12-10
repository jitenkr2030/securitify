import { NextRequest, NextResponse } from 'next/server';
import { systemMonitor, logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const alertManager = systemMonitor.getAlertManager();
    
    if (activeOnly) {
      const activeAlerts = alertManager.getActiveAlerts();
      return NextResponse.json({
        alerts: activeAlerts,
        count: activeAlerts.length,
      });
    } else {
      const allAlerts = alertManager.getAlertHistory();
      return NextResponse.json({
        alerts: allAlerts,
        count: allAlerts.length,
      });
    }
  } catch (error) {
    logger.error('Monitoring alerts endpoint error', { error });
    
    return NextResponse.json({
      error: 'Failed to retrieve alerts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId, action } = body;
    
    if (!alertId || !action) {
      return NextResponse.json({
        error: 'Missing required fields: alertId and action',
      }, { status: 400 });
    }
    
    const alertManager = systemMonitor.getAlertManager();
    
    if (action === 'resolve') {
      alertManager.resolveAlert(alertId);
      logger.info('Alert resolved via API', { alertId });
      
      return NextResponse.json({
        message: 'Alert resolved successfully',
        alertId,
      });
    } else {
      return NextResponse.json({
        error: 'Invalid action. Supported actions: resolve',
      }, { status: 400 });
    }
  } catch (error) {
    logger.error('Monitoring alerts patch error', { error });
    
    return NextResponse.json({
      error: 'Failed to update alert',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}