import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await connectDB();

        const { name, email, password } = await request.json();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User already exists with this email' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({ name, email, password });

        // Generate token
        const token = await signToken({ id: user._id.toString() });

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
