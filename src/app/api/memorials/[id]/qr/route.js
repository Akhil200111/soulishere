import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function checkQRAuth(request, params) {
    const session = await getSession(request);

    if (!session) {
        return { error: 'Not authorized', status: 401 };
    }

    const currentUserId = (session.id || session._id)?.toString();
    if (!currentUserId) {
        return { error: 'Not authorized', status: 401 };
    }

    await connectDB();

    const { id } = await params;
    const memorial = await Memorial.findById(id);

    if (!memorial) {
        return { error: 'Memorial not found', status: 404 };
    }

    // Only published memorials can have an active QR code
    if (memorial.status !== 'published') {
        return { error: 'QR code is only available for published memorials', status: 400 };
    }

    const user = await User.findById(currentUserId);
    if (!user) {
        return { error: 'User not found', status: 401 };
    }

    const isAdmin = user.role === 'admin';

    if (!isAdmin) {
        return { error: 'Only super admin is authorized to access QR code for memorials', status: 403 };
    }

    return { session, user, memorial, isAdmin };
}

// GET - Check/Fetch QR code authorization and status
export async function GET(request, { params }) {
    try {
        const auth = await checkQRAuth(request, params);
        if (auth.error) {
            return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
        }

        return NextResponse.json({
            success: true,
            data: {
                qrGenerated: auth.memorial.qrGenerated,
                status: auth.memorial.status
            }
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

// POST - Generate / Enable QR code
export async function POST(request, { params }) {
    try {
        const auth = await checkQRAuth(request, params);
        if (auth.error) {
            return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
        }

        auth.memorial.qrGenerated = true;
        await auth.memorial.save();

        return NextResponse.json({
            success: true,
            data: auth.memorial,
            message: 'QR Code enabled successfully'
        });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
