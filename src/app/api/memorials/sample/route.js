import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';

// GET - Get sample published memorial for home page
export async function GET() {
    try {
        await connectDB();

        const memorial = await Memorial.findOne({ status: 'published' }).sort({ createdAt: 1 });

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'No sample memorial available' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: memorial
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
