import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { getSession } from '@/lib/auth';

// POST - Toggle like on a tribute
export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id, entryId } = await params;
        const session = await getSession(request);

        let body = {};
        try {
            body = await request.json();
        } catch {}

        const visitorId = body.visitorId || request.headers.get('x-visitor-id');
        const likerKey = session?.id 
            ? String(session.id) 
            : (session?._id ? String(session._id) : (visitorId ? String(visitorId) : null));

        if (!likerKey) {
            return NextResponse.json(
                { success: false, message: 'Unable to identify device for like action' },
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

        const currentLikes = (tribute.likes || []).map(k => String(k));
        const likeIndex = currentLikes.indexOf(likerKey);
        let hasLiked = false;

        if (likeIndex > -1) {
            // Remove like
            currentLikes.splice(likeIndex, 1);
            hasLiked = false;
        } else {
            // Add like
            currentLikes.push(likerKey);
            hasLiked = true;
        }

        tribute.likes = currentLikes;
        memorial.markModified('guestBookEntries');
        await memorial.save();

        return NextResponse.json({
            success: true,
            hasLiked,
            likeCount: currentLikes.length,
            likes: currentLikes
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
