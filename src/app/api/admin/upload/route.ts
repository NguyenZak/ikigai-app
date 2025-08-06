import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateSession } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

interface CloudinaryUploadOptions {
  folder: string;
  resource_type: 'image';
  transformation: Array<{
    quality?: string;
    fetch_format?: string;
    width?: string;
    height?: string;
    crop?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle file upload
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Check file size limit (Allow up to 15MB, but will compress if > 10MB)
    const maxFileSize = 15 * 1024 * 1024; // 15MB in bytes
    if (file.size > maxFileSize) {
      return NextResponse.json({ 
        error: `File size too large. Maximum allowed is 15MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Please compress the image before uploading.` 
      }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Determine upload options based on file size
    const fileSizeMB = file.size / (1024 * 1024);
    const uploadOptions: CloudinaryUploadOptions = {
      folder: `ikigaivilla/${type}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    };

    // If file is larger than 5MB, add compression to reduce size
    if (fileSizeMB > 5) {
      uploadOptions.transformation.push({
        quality: 'auto:low',
        fetch_format: 'auto'
      });
      
      // Add size limit transformation - remove invalid height: 'auto'
      uploadOptions.transformation.push({
        width: 'auto',
        crop: 'limit',
        quality: 'auto:low'
      });
    }

    // For files larger than 10MB, add extra compression to ensure they fit within Cloudinary's limit
    if (fileSizeMB > 10) {
      uploadOptions.transformation.push({
        quality: 'auto:eco',
        fetch_format: 'auto'
      });
      
      // Add more aggressive compression
      uploadOptions.transformation.push({
        width: 'auto',
        crop: 'limit',
        quality: 'auto:eco'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    const result = uploadResult as Record<string, unknown>;

    // Return file info
    return NextResponse.json({
      success: true,
      file: {
        originalName: file.name,
        filename: result.public_id,
        url: result.secure_url,
        size: file.size,
        originalSize: file.size,
        compressedSize: result.bytes,
        type: file.type,
        cloudinaryId: result.public_id,
        wasCompressed: fileSizeMB > 5 || fileSizeMB > 10
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 