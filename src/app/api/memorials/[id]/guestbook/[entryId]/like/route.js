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

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Please sign in to like a tribute' },
                { status: 401 }
            );
        }

        const userKey = String(session.id);

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
        const likeIndex = currentLikes.indexOf(userKey);
        let hasLiked = false;

        if (likeIndex > -1) {
            // Remove like
            currentLikes.splice(likeIndex, 1);
            hasLiked = false;
        } else {
            // Add like
            currentLikes.push(userKey);
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
