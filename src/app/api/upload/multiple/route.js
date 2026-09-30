import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getSession } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST - Upload multiple images
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
        const files = formData.getAll('images');

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Please upload files' },
                { status: 400 }
            );
        }

        const uploadPromises = files.map(async (file) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            return new Promise((resolve, reject) => {
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
        });

        const results = await Promise.all(uploadPromises);

        const uploadedFiles = results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id,
            filename: result.original_filename
        }));

        return NextResponse.json({
            success: true,
            data: uploadedFiles
        });
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        return NextResponse.json(
            { success: false, message: err.message || 'Error uploading images' },
            { status: 500 }
        );
    }
}
