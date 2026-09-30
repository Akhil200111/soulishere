import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Validate
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

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
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
