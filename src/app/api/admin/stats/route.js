import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET - Get admin stats
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

        const totalUsers = await User.countDocuments();
        const totalMemorials = await Memorial.countDocuments();
        const publishedMemorials = await Memorial.countDocuments({ status: 'published' });
        const draftMemorials = await Memorial.countDocuments({ status: 'draft' });

        const totalRevenue = await Memorial.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalMemorials,
                publishedMemorials,
                draftMemorials,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
