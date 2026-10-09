import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { updateMemorialService } from '@/lib/memorialService';
import crypto from 'crypto';

// GET - Get single memorial with QR access key verification
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

        // Allow access for public dummy memorial
        if (memorial.isDummy) {
            return NextResponse.json({
                success: true,
                data: memorial
            });
        }

        // Ensure memorial has a qrAccessKey
        if (!memorial.qrAccessKey) {
            memorial.qrAccessKey = crypto.randomBytes(16).toString('hex');
            await memorial.save();
        }

        // 1. Check logged in session (Super Admin or Memorial Owner)
        const session = await getSession(request);
        if (session?.id) {
            const user = await User.findById(session.id);
            const memorialOwnerId = memorial.userId?._id 
                ? memorial.userId._id.toString() 
                : (memorial.userId ? memorial.userId.toString() : null);

            const isOwner = Boolean(memorialOwnerId && memorialOwnerId === session.id);
            const isAdmin = Boolean(user && user.role === 'admin');

            if (isOwner || isAdmin) {
                return NextResponse.json({
                    success: true,
                    data: memorial
                });
            }
        }

        // 2. Check QR key from query param or header
        const { searchParams } = new URL(request.url);
        const providedKey = searchParams.get('key') || request.headers.get('x-qr-key');

        if (providedKey && providedKey === memorial.qrAccessKey) {
            return NextResponse.json({
                success: true,
                data: memorial
            });
        }

        // 3. Unauthorized - Access Restricted
        return NextResponse.json({
            success: false,
            isRestricted: true,
            message: 'Access restricted. You must scan the official QR code to view this memorial.'
        }, { status: 403 });

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
