import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// PATCH - Admin update tribute status or feature state
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        const user = await User.findById(session.id);
        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        const { id: entryId } = await params;
        const { memorialId, status, isFeatured } = await request.json();

        if (!memorialId) {
            return NextResponse.json(
                { success: false, message: 'memorialId is required' },
                { status: 400 }
            );
        }

        const memorial = await Memorial.findById(memorialId);
        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        const tribute = memorial.guestBookEntries.id(entryId);
        if (!tribute) {
            return NextResponse.json(
                { success: false, message: 'Tribute not found' },
                { status: 404 }
            );
        }

        if (status !== undefined) {
            tribute.status = status;
        }
        if (isFeatured !== undefined) {
            tribute.isFeatured = isFeatured;
        }

        await memorial.save();

        return NextResponse.json({
            success: true,
            data: tribute
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// DELETE - Admin delete tribute
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        const user = await User.findById(session.id);
        if (user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Admin access required' },
                { status: 403 }
            );
        }

        const { id: entryId } = await params;
        const { searchParams } = new URL(request.url);
        const memorialId = searchParams.get('memorialId');

        if (!memorialId) {
            return NextResponse.json(
                { success: false, message: 'memorialId query param is required' },
                { status: 400 }
            );
        }

        const memorial = await Memorial.findById(memorialId);
        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        const tribute = memorial.guestBookEntries.id(entryId);
        if (!tribute) {
            return NextResponse.json(
                { success: false, message: 'Tribute not found' },
                { status: 404 }
            );
        }

        tribute.deleteOne();
        await memorial.save();

        return NextResponse.json({
            success: true,
            message: 'Tribute removed by admin'
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
