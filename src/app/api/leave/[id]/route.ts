import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { createTenantContext } from '@/lib/db';

// PATCH /api/leave/[id] - Update leave request status (approve/reject)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const leaveId = (await context.params).id;

    const leaveRequest = await db.leave.findUnique({
      where: { id: leaveId },
      include: {
        guard: true
      }
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    if (leaveRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Leave request already processed' },
        { status: 400 }
      );
    }

    const updatedLeaveRequest = await db.leave.update({
      where: { id: leaveId },
      data: {
        status,
        approvedById: session.user.id,
        rejectionReason: status === 'rejected' ? rejectionReason : null
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            photo: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Update guard status if approved
    if (status === 'approved') {
      await db.guard.update({
        where: { id: leaveRequest.guardId },
        data: { status: 'on_leave' }
      });
    }

    return NextResponse.json(updatedLeaveRequest);
  } catch (error) {
    console.error('Error updating leave request:', error);
    return NextResponse.json(
      { error: 'Failed to update leave request' },
      { status: 500 }
    );
  }
}

// DELETE /api/leave/[id] - Delete leave request
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leaveId = (await context.params).id;

    const leaveRequest = await db.leave.findUnique({
      where: { id: leaveId }
    });

    if (!leaveRequest) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      );
    }

    if (leaveRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only delete pending leave requests' },
        { status: 400 }
      );
    }

    await db.leave.delete({
      where: { id: leaveId }
    });

    return NextResponse.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave request' },
      { status: 500 }
    );
  }
}