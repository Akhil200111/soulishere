import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// PUT - Update own tribute
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id, entryId } = await params;
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please sign in to update your tribute' },
                { status: 401 }
            );
        }

        const user = await User.findById(session.id);
        const { message } = await request.json();

        if (!message || message.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Tribute message cannot be empty' },
                { status: 400 }
            );
        }

        const memorial = await Memorial.findById(id);
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

        // Author or admin authorization check
        const isAuthor = tribute.userId && tribute.userId.toString() === session.id;
        const isAdmin = user?.role === 'admin';

        if (!isAuthor && !isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Not authorized to edit this tribute' },
                { status: 403 }
            );
        }

        tribute.message = message.trim();
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

// DELETE - Delete own tribute
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id, entryId } = await params;
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please sign in to delete your tribute' },
                { status: 401 }
            );
        }

        const user = await User.findById(session.id);
        const memorial = await Memorial.findById(id);

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

        const isAuthor = tribute.userId && tribute.userId.toString() === session.id;
        const isAdmin = user?.role === 'admin';

        if (!isAuthor && !isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Not authorized to delete this tribute' },
                { status: 403 }
            );
        }

        tribute.deleteOne();
        await memorial.save();

        return NextResponse.json({
            success: true,
            message: 'Tribute deleted successfully'
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
