import { NextResponse } from 'next/server';
import { getMemorialPricing } from '@/lib/pricingService';

export const dynamic = 'force-dynamic';

// GET - Publicly accessible active memorial pricing package
export async function GET() {
    try {
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
