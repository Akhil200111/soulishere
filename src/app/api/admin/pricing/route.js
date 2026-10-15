import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getMemorialPricing, updateMemorialPricing } from '@/lib/pricingService';

export const dynamic = 'force-dynamic';

// GET - Admin fetch pricing configuration
export async function GET(request) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        const pricing = await getMemorialPricing();
        return NextResponse.json({
            success: true,
            data: pricing
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message || 'Failed to fetch pricing' },
            { status: 500 }
        );
    }
}

// PUT - Admin update memorial package pricing
export async function PUT(request) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        const body = await request.json();
        const result = await updateMemorialPricing(body, session);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: result.status || 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: result.message
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message || 'Failed to update pricing' },
            { status: 500 }
        );
    }
}
