import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import mongoose from 'mongoose';

// POST - Add hug to memorial
export async function POST(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        let memorial;

        if (id === 'dummy') {
            memorial = await Memorial.findOne({ isDummy: true });
        } else if (mongoose.Types.ObjectId.isValid(id)) {
            memorial = await Memorial.findById(id);
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid Memorial ID' },
                { status: 400 }
            );
        }

        if (!memorial) {
            return NextResponse.json(
                { success: false, message: 'Memorial not found' },
                { status: 404 }
            );
        }

        // Allow hugs for published, draft, or dummy memorials
        const updated = await Memorial.findByIdAndUpdate(
            memorial._id,
            { $inc: { hugCount: 1 } },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            hugCount: updated ? updated.hugCount : (memorial.hugCount || 0) + 1
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

