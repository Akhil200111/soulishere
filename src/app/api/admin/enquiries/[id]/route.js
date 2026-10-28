import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// Mark as viewed (or toggle viewed status)
export async function PATCH(request, { params }) {
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

        const { id } = await params;
        const body = await request.json().catch(() => ({}));
        
        // If viewed is explicitly sent, use that; otherwise set viewed to true
        const nextViewed = typeof body.viewed === 'boolean' ? body.viewed : true;

        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            { viewed: nextViewed },
            { new: true }
        );

        if (!updatedEnquiry) {
            return NextResponse.json(
                { success: false, message: 'Enquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: nextViewed ? 'Enquiry marked as viewed' : 'Enquiry marked as unviewed',
            data: updatedEnquiry
        });
    } catch (err) {
        console.error('Error updating enquiry status:', err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// Delete enquiry
export async function DELETE(request, { params }) {
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

        const { id } = await params;

        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

        if (!deletedEnquiry) {
            return NextResponse.json(
                { success: false, message: 'Enquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Enquiry deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting enquiry:', err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
