import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { getSession } from '@/lib/auth';
import User from '@/models/User';

// PUT - Reject Memorial
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

        memorial.status = 'rejected';
        memorial.qrGenerated = false;
        
        await memorial.save();

        return NextResponse.json({
            success: true,
            data: memorial,
            message: 'Memorial rejected successfully'
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
