import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
    try {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Check if user is admin
        const user = await User.findById(session.id);
        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Only admins can generate QR codes' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const memorial = await Memorial.findById(id);

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        // Enable QR code generation
        memorial.qrGenerated = true;
        await memorial.save();

        return NextResponse.json({
            success: true,
            data: memorial,
            message: 'QR Code generation enabled'
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
