import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createTenantContext } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);

    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId');
    const receiverId = searchParams.get('receiverId');
    const guardSenderId = searchParams.get('guardSenderId');
    const guardReceiverId = searchParams.get('guardReceiverId');

    const whereClause: any = {};
    if (senderId) whereClause.senderId = senderId;
    if (receiverId) whereClause.receiverId = receiverId;
    if (guardSenderId) whereClause.guardSenderId = guardSenderId;
    if (guardReceiverId) whereClause.guardReceiverId = guardReceiverId;

    const messages = await tenantDb.message({
      where: whereClause,
      include: {
        sender: true,
        receiver: true,
        guardSender: true,
        guardReceiver: true,
        attachments: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const tenantDb = createTenantContext(tenantId);

    const body = await request.json();
    const {
      content,
      type,
      receiverId,
      guardReceiverId,
      attachments
    } = body;

    // Validate required fields
    if (!content || !type || (!receiverId && !guardReceiverId)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const message = await tenantDb.createMessage({
      data: {
        content,
        type,
        senderId: session.user.id,
        receiverId,
        guardReceiverId,
        status: 'sent'
      },
      include: {
        sender: true,
        receiver: true,
        guardSender: true,
        guardReceiver: true,
        attachments: true
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}