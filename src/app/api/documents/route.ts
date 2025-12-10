import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { join } from 'path';
import { writeFile, unlinkSync, existsSync, mkdirSync } from 'fs';
import { writeFile as writeFileAtomic } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface DocumentUpload {
  guardId: string;
  type: 'aadhaar' | 'police_verification' | 'training_certificate' | 'license' | 'other';
  name: string;
  file: File;
  expiryDate?: string;
  userId: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guardId = searchParams.get('guardId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const expiringSoon = searchParams.get('expiringSoon') === 'true';

    let whereClause: any = {};
    
    if (guardId) {
      whereClause.guardId = guardId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.type = type;
    }

    if (expiringSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      whereClause.expiryDate = {
        lte: thirtyDaysFromNow,
        gte: new Date()
      };
    }

    const documents = await db.document.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const guardId = formData.get('guardId') as string;
    const type = formData.get('type') as DocumentUpload['type'];
    const name = formData.get('name') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;

    if (!guardId || !type || !name || !file || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, PNG, and DOC files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);
    const fileUrl = `/uploads/documents/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFileAtomic(filePath, buffer);

    // Create document record in database
    const document = await db.document.create({
      data: {
        guardId,
        type,
        name,
        fileUrl,
        status: 'pending',
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        userId
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, rejectionReason, expiryDate } = body;

    const updateData: any = { status };
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (expiryDate) {
      updateData.expiryDate = new Date(expiryDate);
    }

    const document = await db.document.update({
      where: { id },
      data: updateData,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    // Get document info before deletion
    const document = await db.document.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filePath = join(process.cwd(), 'public', document.fileUrl);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    // Delete from database
    await db.document.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}