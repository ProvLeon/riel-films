import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { authOptions } from '@/lib/auth'; // Assuming auth setup
import { getServerSession } from 'next-auth/next';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  fileName: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: fileName.split('.')[0], // Use original filename without extension
        resource_type: 'auto', // Detect resource type (image, video, raw)
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["admin", "editor"].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Check file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Check file type (allow common image types)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, GIF, WEBP allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'riel-films';

    const result = await uploadToCloudinary(buffer, uploadFolder, file.name);

    if (!result?.secure_url) {
      throw new Error('Cloudinary upload failed to return a secure URL.');
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'File upload failed', details: error.message }, { status: 500 });
  }
}
