import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { getSession } from '@/lib/auth';
import User from '@/models/User';

// PUT - Approve Memorial & Generate QR
export async function PUT(request, { params }) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        await connectDB();
        
        // Verify admin
        const adminUser = await User.findById(session.id);
        if (!adminUser || adminUser.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const memorial = await Memorial.findById(id);

        if (!memorial) {
            return NextResponse.json({ success: false, message: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.status !== 'requested') {
            return NextResponse.json({ success: false, message: 'Memorial is not in requested status' }, { status: 400 });
        }

        memorial.status = 'published';
        memorial.qrGenerated = true;
        
        await memorial.save();

        return NextResponse.json({
            success: true,
            data: memorial,
            message: 'Memorial approved successfully'
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
