import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

// GET - Admin list all tributes for moderation
export async function GET(request) {
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

        const { searchParams } = new URL(request.url);
        const memorialId = searchParams.get('memorialId');
        const statusFilter = searchParams.get('status');

        let query = {};
        if (memorialId) {
            query._id = memorialId;
        }

        const memorials = await Memorial.find(query).select('firstName lastName profilePicture guestBookEntries');

        let allTributes = [];
        memorials.forEach(mem => {
            if (mem.guestBookEntries && mem.guestBookEntries.length > 0) {
                mem.guestBookEntries.forEach(entry => {
                    if (!statusFilter || entry.status === statusFilter) {
                        allTributes.push({
                            ...entry.toObject(),
                            memorialId: mem._id,
                            memorialName: `${mem.firstName} ${mem.lastName}`
                        });
                    }
                });
            }
        });

        // Sort newest first
        allTributes.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        return NextResponse.json({
            success: true,
            data: allTributes
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
