import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET - Get approved tributes for memorial
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sort = searchParams.get('sort') || 'newest'; // newest, oldest, featured

        const session = await getSession(request);
        let currentUser = null;
        if (session?.id) {
            currentUser = await User.findById(session.id);
        }

        const memorial = await Memorial.findById(id);
        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        let entries = memorial.guestBookEntries || [];

        // Filter status: approved items are public; authors see their own pending items; admins see all
        entries = entries.filter(entry => {
            const entryStatus = entry.status || 'APPROVED';
            if (entryStatus === 'APPROVED') return true;
            if (currentUser?.role === 'admin') return true;
            if (session?.id && entry.userId?.toString() === session.id) return true;
            return false;
        });

        // Sorting
        entries.sort((a, b) => {
            if (sort === 'featured') {
                if (a.isFeatured && !b.isFeatured) return -1;
                if (!a.isFeatured && b.isFeatured) return 1;
            }
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return sort === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        // Pagination
        const total = entries.length;
        const startIndex = (page - 1) * limit;
        const paginatedEntries = entries.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            success: true,
            data: paginatedEntries,
            pagination: {
                total,
                page,
                limit,
                hasMore: startIndex + limit < total
            }
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// POST - Create new tribute
export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const { name, email, message } = body;

        if (!message || message.trim() === '') {
            return NextResponse.json(
                { success: false, message: 'Please write a tribute message' },
                { status: 400 }
            );
        }

        const session = await getSession(request);
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
                { success: false, message: 'Please provide your name and email' },
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

        if (memorial.status !== 'published') {
            return NextResponse.json(
                { success: false, message: 'Cannot add tributes to draft memorials' },
                { status: 400 }
            );
        }

        const newTribute = {
            userId,
            name: authorName,
            email: authorEmail,
            avatarUrl,
            message: message.trim(),
            status: 'APPROVED',
            isFeatured: false,
            likes: [],
            replies: [],
            date: new Date()
        };

        memorial.guestBookEntries.push(newTribute);
        await memorial.save();

        const created = memorial.guestBookEntries[memorial.guestBookEntries.length - 1];

        return NextResponse.json({
            success: true,
            data: created
        }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
