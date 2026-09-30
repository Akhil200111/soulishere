import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { getSession } from '@/lib/auth';

// GET - Get user's draft memorials
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

        const drafts = await Memorial.find({
            userId: session.id,
            status: 'draft'
        }).sort({ updatedAt: -1 });

        return NextResponse.json({
            success: true,
            count: drafts.length,
            data: drafts
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
