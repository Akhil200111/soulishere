import { NextResponse } from 'next/server';
import crypto from 'crypto';

import Memorial from '@/models/Memorial';
import connectDB from '@/lib/mongodb';
import { getMemorialPricing } from '@/lib/pricingService';

// POST - Verify Razorpay payment
export async function POST(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, memorialId, amount } = await request.json();

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            await connectDB();
            if (memorialId) {
                const pricing = await getMemorialPricing();
                const recordedAmount = (amount && Number(amount) > 0) ? Number(amount) : Number(pricing.amount);

                await Memorial.findByIdAndUpdate(memorialId, {
                    status: 'requested',
                    qrGenerated: false,
                    paymentId: razorpay_payment_id,
                    paymentStatus: 'completed',
                    paymentAmount: recordedAmount,
                    paidAt: Date.now()
                });
            }

            return NextResponse.json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Payment verification failed' },
                { status: 400 }
            );
        }
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
