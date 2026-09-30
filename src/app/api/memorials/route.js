import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { getSession } from '@/lib/auth';
import { processFamilyMembers } from '@/lib/lineage';

// GET - Get all memorials for current user
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

        const memorials = await Memorial.find({ userId: session.id, isDummy: { $ne: true } }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: memorials.length,
            data: memorials
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// POST - Create new memorial
export async function POST(request) {
    try {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();
        body.userId = session.id;
        body.status = 'draft';
        body.paymentStatus = 'pending';

        if (body.familyMembers) {
            body.familyMembers = processFamilyMembers(body.familyMembers);
        }

        const memorial = await Memorial.create(body);

        return NextResponse.json({
            success: true,
            data: memorial
        }, { status: 201 });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, message: Object.values(err.errors).map(e => e.message).join(', ') },
                { status: 400 }
            );
        }
        if (err.name === 'CastError') {
            return NextResponse.json(
                { success: false, message: `Invalid data format for field: ${err.path}` },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
