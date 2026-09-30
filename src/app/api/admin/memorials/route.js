import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET - Get all memorials (admin only)
export async function GET(request) {
    try {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.id);

        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        const memorials = await Memorial.find({ isDummy: { $ne: true } })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: memorials.length,
            data: memorials
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
