
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/auth?error=Google_auth_failed', request.url));
    }

    try {
        console.log('Google Callback: Connecting to DB...');
        await dbConnect();
        console.log('Google Callback: DB Connected');

        // Exchange code for tokens
        console.log('Google Callback: Exchanging code for tokens...');
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Google Callback: Tokens received');

        // Get user info
        console.log('Google Callback: Fetching user info...');
        const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
        const { data } = await oauth2.userinfo.get();
        console.log('Google Callback: User info received:', data.email);

        if (!data.email || !data.id) {
            throw new Error('No email or ID found in Google profile');
        }

        // Find or create user
        console.log('Google Callback: Finding/Creating user...');
        let user = await User.findOne({ email: data.email });

        if (user) {
            console.log('Google Callback: User found');
            if (!user.googleId) {
                // Link Google account to existing user
                user.googleId = data.id;
                await user.save();
                console.log('Google Callback: Linked Google ID');
            }
        } else {
            console.log('Google Callback: Creating new user');
            // Create new user
            user = await User.create({
                name: data.name || data.email.split('@')[0],
                email: data.email,
                googleId: data.id,
            });
        }

        // Create JWT token
        console.log('Google Callback: Signing token...');
        const token = await signToken({ id: user._id.toString(), role: user.role });
        console.log('Google Callback: Token signed');

        // Redirect to dashboard with token
        const response = NextResponse.redirect(new URL(`/dashboard?token=${token}`, request.url));

        // Also set token in cookie for middleware
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        console.log('Google Callback: Redirecting to dashboard');
        return response;

    } catch (error) {
        console.error('Google Auth Error:', error);
        return NextResponse.redirect(new URL('/auth?error=Google_auth_error', request.url));
    }
}

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
