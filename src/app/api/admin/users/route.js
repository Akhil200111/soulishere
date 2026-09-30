
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

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

        const currentUser = await User.findById(session.id);
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        const users = await User.find({})
            .select('name email role googleId createdAt')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
