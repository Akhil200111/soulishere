import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, phone, email, enquiry } = body || {};

        // Validation for mandatory fields
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please provide your name.' },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== 'string' || !phone.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please provide your phone number.' },
                { status: 400 }
            );
        }

        if (!enquiry || typeof enquiry !== 'string' || !enquiry.trim()) {
            return NextResponse.json(
                { success: false, message: 'Please provide your enquiry message.' },
                { status: 400 }
            );
        }

        // Email is optional, but if provided, validate basic format
        const cleanEmail = email && typeof email === 'string' ? email.trim() : '';
        if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return NextResponse.json(
                { success: false, message: 'Please provide a valid email address or leave it empty.' },
                { status: 400 }
            );
        }

        const newEnquiry = await Enquiry.create({
            name: name.trim(),
            phone: phone.trim(),
            email: cleanEmail,
            enquiry: enquiry.trim(),
            viewed: false
        });

        return NextResponse.json({
            success: true,
            message: 'Your enquiry has been submitted successfully! We will get in touch with you shortly.',
            data: {
                id: newEnquiry._id,
                name: newEnquiry.name,
                createdAt: newEnquiry.createdAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Contact Form Submission Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Something went wrong while submitting your enquiry.' },
            { status: 500 }
        );
    }
}
