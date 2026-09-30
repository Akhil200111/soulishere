import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123';

        // Check if admin already exists
        let user = await User.findOne({ email: adminEmail });

        if (user) {
            // Update to ensure role is admin
            user.role = 'admin';
            user.password = adminPassword; // This will be hashed by the pre-save hook
            await user.save();
            return NextResponse.json({
                success: true,
                message: 'Admin user updated',
                credentials: {
                    email: adminEmail,
                    password: adminPassword
                }
            });
        }

        // Create new admin user
        user = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created',
            credentials: {
                email: adminEmail,
                password: adminPassword
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
