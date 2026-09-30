import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { updateMemorialService } from '@/lib/memorialService';

// GET - Get single memorial
export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const memorial = await Memorial.findById(id);

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: memorial
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// PUT - Update memorial
export async function PUT(request, { params }) {
    try {
        const session = await getSession(request);

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Not authorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const result = await updateMemorialService(session, id, body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: result.status }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete memorial
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

        const { id } = await params;
        const memorial = await Memorial.findById(id);

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        // Check ownership
        const user = await User.findById(session.id);
        if (memorial.userId.toString() !== session.id && user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not authorized to delete this memorial' },
                { status: 401 }
            );
        }

        if (memorial.isDummy) {
            return NextResponse.json(
                { success: false, message: 'Dummy memorial cannot be deleted' },
                { status: 403 }
            );
        }

        await memorial.deleteOne();

        return NextResponse.json({
            success: true,
            data: {}
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
