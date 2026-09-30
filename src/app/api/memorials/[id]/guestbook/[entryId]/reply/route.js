import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// POST - Add reply to a tribute
export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id, entryId } = await params;
        const session = await getSession(request);

        const body = await request.json();
        const { message, name, email } = body;

        if (!message || message.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Reply message cannot be empty' },
                { status: 400 }
            );
        }

        let userId = null;
        let authorName = name || 'Anonymous Guest';
        let authorEmail = email || '';
        let avatarUrl = '';

        if (session) {
            userId = session.id;
            const user = await User.findById(session.id);
            if (user) {
                authorName = user.name || authorName;
                authorEmail = user.email || authorEmail;
                avatarUrl = user.profilePicture || '';
            }
        }

        if (!authorName || !authorEmail) {
            return NextResponse.json(
                { success: false, message: 'Please provide your name and email to reply' },
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

        if (!tribute.replies) {
            tribute.replies = [];
        }

        const newReply = {
            userId,
            name: authorName,
            email: authorEmail,
            avatarUrl,
            message: message.trim(),
            status: 'APPROVED',
            likes: [],
            date: new Date()
        };

        tribute.replies.push(newReply);
        await memorial.save();

        const createdReply = tribute.replies[tribute.replies.length - 1];

        return NextResponse.json({
            success: true,
            data: createdReply
        }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete a reply
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id, entryId } = await params;
        const { searchParams } = new URL(request.url);
        const replyId = searchParams.get('replyId');

        if (!replyId) {
            return NextResponse.json(
                { success: false, message: 'replyId query parameter is required' },
                { status: 400 }
            );
        }

        const session = await getSession(request);
        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please sign in to delete a reply' },
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

        const reply = tribute.replies.id(replyId);
        if (!reply) {
            return NextResponse.json(
                { success: false, message: 'Reply not found' },
                { status: 404 }
            );
        }

        const isAuthor = reply.userId && reply.userId.toString() === session.id;
        const isAdmin = user?.role === 'admin';

        if (!isAuthor && !isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Not authorized to delete this reply' },
                { status: 403 }
            );
        }

        reply.deleteOne();
        await memorial.save();

        return NextResponse.json({
            success: true,
            message: 'Reply deleted successfully'
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
