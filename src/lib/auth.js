import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'memorial-platform-secret-key'
);

// Sign a new JWT token
export async function signToken(payload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')
        .sign(JWT_SECRET);

    return token;
}

// Verify JWT token
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        return null;
    }
}

// Get user session from request headers or cookies
export async function getSession(request) {
    let token = null;

    const authHeader = request.headers?.get?.('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (request?.cookies?.get?.('token')) {
        token = request.cookies.get('token')?.value;
    }

    if (!token) {
        return null;
    }

    const payload = await verifyToken(token);
    return payload;
}

// Get user session from cookies (for server components)
export async function getSessionFromCookies() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    return await verifyToken(token);
}

/**
 * Reusable authorization check to verify if a session user can manage a memorial's gallery.
 * Rules:
 * 1. Admin can manage any memorial gallery.
 * 2. Memorial creator can manage only their own memorial gallery.
 * 3. Other authenticated users cannot modify the gallery.
 * 
 * @param {Object} session - Authenticated session payload containing user id
 * @param {Object|string} memorial - Memorial document or memorial creator userId string
 * @returns {Promise<{ authorized: boolean, user?: Object, message?: string, status?: number }>}
 */
export async function canManageMemorialGallery(session, memorial) {
    if (!session || !session.id) {
        return { authorized: false, status: 401, message: 'Not authorized' };
    }

    if (!memorial) {
        return { authorized: false, status: 404, message: 'Memorial not found' };
    }

    // Lazy load models and DB to prevent circular dependencies
    const connectDB = (await import('@/lib/mongodb')).default;
    const User = (await import('@/models/User')).default;

    await connectDB();

    const user = await User.findById(session.id);
    if (!user) {
        return { authorized: false, status: 401, message: 'User not found' };
    }

    // Rule 1: Admin can manage any memorial gallery
    if (user.role === 'admin') {
        return { authorized: true, user };
    }

    // Rule 2: Creator can manage only their own memorial
    const creatorId = typeof memorial === 'object' && memorial.userId 
        ? memorial.userId.toString() 
        : (typeof memorial === 'string' ? memorial : null);

    if (creatorId && creatorId === session.id) {
        return { authorized: true, user };
    }

    // Rule 3: Other users cannot modify the memorial media or gallery
    return {
        authorized: false,
        status: 403,
        message: 'Forbidden: You are not authorized to modify this memorial.'
    };
}

/**
 * Reusable authorization check to verify if a session user can manage a memorial's YouTube videos.
 * Alias for canManageMemorialGallery enforcing creator/owner or admin rule.
 */
export const canManageMemorialVideos = canManageMemorialGallery;
export const canManageMemorialMedia = canManageMemorialGallery;

