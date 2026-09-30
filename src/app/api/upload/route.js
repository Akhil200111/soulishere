import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST - Upload single image
export async function POST(request) {
    try {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('image');

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'Please upload a file' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'soulishere',
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                filename: result.original_filename
            }
        });
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        return NextResponse.json(
            { success: false, message: err.message || 'Error uploading image' },
            { status: 500 }
        );
    }
}
