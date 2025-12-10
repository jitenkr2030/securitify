import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 4096; // Maximum width/height

interface OptimizationOptions {
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  width?: number;
  height?: number;
  enableWebP?: boolean;
  enableCompression?: boolean;
}

interface OptimizationResult {
  success: boolean;
  optimizedUrl?: string;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
  error?: string;
  processingTime?: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const options = JSON.parse(formData.get('options') as string || '{}') as OptimizationOptions;

    // Validate file
    if (!file) {
      return NextResponse.json<OptimizationResult>({
        success: false,
        error: 'No image file provided'
      }, { status: 400 });
    }

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return NextResponse.json<OptimizationResult>({
        success: false,
        error: `Unsupported file type: ${file.type}`
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<OptimizationResult>({
        success: false,
        error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 });
    }

    // Set default options
    const optimizationOptions: OptimizationOptions = {
      quality: options.quality || 75,
      format: options.format || 'webp',
      width: options.width,
      height: options.height,
      enableWebP: options.enableWebP ?? true,
      enableCompression: options.enableCompression ?? true,
    };

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create optimized image
    const result = await optimizeImage(buffer, file.name, optimizationOptions);
    
    const processingTime = Date.now() - startTime;

    return NextResponse.json<OptimizationResult>({
      success: true,
      optimizedUrl: result.optimizedUrl,
      originalSize: file.size,
      optimizedSize: result.optimizedSize,
      compressionRatio: ((file.size - result.optimizedSize) / file.size) * 100,
      processingTime,
    });

  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json<OptimizationResult>({
      success: false,
      error: 'Internal server error during image optimization'
    }, { status: 500 });
  }
}

async function optimizeImage(
  buffer: Buffer,
  originalName: string,
  options: OptimizationOptions
): Promise<{ optimizedUrl: string; optimizedSize: number }> {
  // In a real implementation, this would use Sharp or another image processing library
  // For now, we'll simulate the optimization process
  
  const optimizedSize = Math.floor(buffer.length * (options.quality! / 100));
  const optimizedBuffer = buffer.slice(0, optimizedSize); // Simulate compression
  
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = options.format === 'webp' ? 'webp' : 'jpg';
  const optimizedFilename = `optimized_${timestamp}_${randomId}.${extension}`;
  
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'optimized');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  
  // Save optimized image
  const filePath = join(uploadsDir, optimizedFilename);
  await writeFile(filePath, optimizedBuffer);
  
  return {
    optimizedUrl: `/uploads/optimized/${optimizedFilename}`,
    optimizedSize: optimizedBuffer.length,
  };
}

// Batch optimization endpoint
export async function PUT(request: NextRequest) {
  try {
    const { imageUrls, options } = await request.json();
    
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No image URLs provided'
      }, { status: 400 });
    }

    if (imageUrls.length > 10) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 10 images can be optimized at once'
      }, { status: 400 });
    }

    const results = await Promise.all(
      imageUrls.map(async (url: string) => {
        try {
          // In a real implementation, this would download and optimize each image
          // For now, we'll simulate the optimization
          await new Promise(resolve => setTimeout(resolve, 100));
          
          return {
            url,
            success: true,
            optimizedUrl: `${url}${url.includes('?') ? '&' : '?'}optimized=true`,
            compressionRatio: 25, // Simulated
          };
        } catch (error) {
          return {
            url,
            success: false,
            error: 'Failed to optimize image',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results,
      totalProcessed: imageUrls.length,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
    });

  } catch (error) {
    console.error('Batch optimization error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during batch optimization'
    }, { status: 500 });
  }
}

// Get optimization statistics
export async function GET() {
  try {
    // In a real implementation, this would query a database for optimization stats
    // For now, we'll return simulated statistics
    const stats = {
      totalImagesOptimized: 1250,
      totalSizeSaved: 450, // MB
      averageCompressionRatio: 68.5,
      popularFormats: {
        webp: 45,
        jpeg: 35,
        png: 20,
      },
      monthlyStats: [
        { month: 'Jan', optimizations: 120, sizeSaved: 42 },
        { month: 'Feb', optimizations: 145, sizeSaved: 51 },
        { month: 'Mar', optimizations: 168, sizeSaved: 59 },
        { month: 'Apr', optimizations: 189, sizeSaved: 66 },
        { month: 'May', optimizations: 210, sizeSaved: 74 },
        { month: 'Jun', optimizations: 198, sizeSaved: 69 },
      ],
    };

    return NextResponse.json({
      success: true,
      stats,
    });

  } catch (error) {
    console.error('Error fetching optimization stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch optimization statistics'
    }, { status: 500 });
  }
}