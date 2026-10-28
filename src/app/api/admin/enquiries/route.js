import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
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
                { success: false, message: 'Not authorized as admin' },
                { status: 403 }
            );
        }

        const enquiries = await Enquiry.find({})
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: enquiries
        });
    } catch (err) {
        console.error('Error fetching enquiries for admin:', err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
