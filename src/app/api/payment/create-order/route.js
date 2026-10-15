import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import Memorial from '@/models/Memorial';
import connectDB from '@/lib/mongodb';
import { getSession } from '@/lib/auth';

import { getMemorialPricing } from '@/lib/pricingService';

// POST - Create Razorpay order
export async function POST(request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
        });

        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        const { memorialId } = await request.json();
        
        await connectDB();
        const memorial = await Memorial.findById(memorialId);

        if (!memorial || memorial.userId.toString() !== session.id) {
            return NextResponse.json({ success: false, message: 'Memorial not found or unauthorized' }, { status: 404 });
        }

        if (memorial.status !== 'draft') {
            return NextResponse.json({ success: false, message: 'Only draft memorials can be submitted for QR generation' }, { status: 400 });
        }

        // Fetch dynamic pricing from database - never trust amount from client
        const pricing = await getMemorialPricing();
        const unitAmount = Number(pricing.amount);
        const amountInPaise = Math.round(unitAmount * 100);
        const currencyCode = pricing.currencyCode || 'INR';

        const options = {
            amount: amountInPaise, // Razorpay expects amount in paise
            currency: currencyCode,
            receipt: `receipt_memorial_${memorialId.toString()}`
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            packageName: pricing.packageName,
            unitAmount: unitAmount,
            currencySymbol: pricing.currency || '₹',
            formattedPrice: `${pricing.currency || '₹'}${unitAmount.toLocaleString()}`
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
