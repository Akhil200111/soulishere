import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// POST - Publish memorial after payment
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

        const { id } = await params;
        const { paymentId, paymentAmount } = await request.json();

        let memorial = await Memorial.findById(id);

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        // Check ownership
        const user = await User.findById(session.id);
        if (memorial.userId.toString() !== session.id && user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not authorized to publish this memorial' },
                { status: 401 }
            );
        }

        // Update memorial to published
        memorial = await Memorial.findByIdAndUpdate(
            id,
            {
                status: 'published',
                paymentId: paymentId,
                paymentStatus: 'completed',
                paymentAmount: paymentAmount || 1999,
                paidAt: new Date()
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Memorial published successfully',
            data: memorial
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
