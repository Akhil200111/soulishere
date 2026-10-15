
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getSession } from '@/lib/auth';

import User from '@/models/User';
import { validatePricingData, DEFAULT_PRICING } from '@/lib/pricingService';

export async function GET() {
    try {
        await connectDB();
        let settings = await SiteSettings.findOne();

        if (!settings) {
            // Create default settings if none exist
            settings = await SiteSettings.create({
                seo: {
                    title: 'Soulishere - Digital Memorial Platform',
                    description: 'Create beautiful, lasting digital memorials for your loved ones.',
                    keywords: 'memorial, tribute, digital memorial'
                },
                images: {
                    logo: '/logo.png',
                    favicon: '/logo.png',
                    homeHeroFamily: '/images/home_hero_family.png',
                    memorialSample: '/images/memorial_sample.png',
                    processFlow: '/images/process_flow.png',
                    pricingIllustration: '/images/pricing_illustration.png',
                    heartIcon: '/images/heart_icon.png',
                    gallery: [
                        '/images/gallery_1.png',
                        '/images/gallery_2.png',
                        '/images/gallery_3.png',
                        '/images/gallery_4.png'
                    ]
                },
                pricing: { ...DEFAULT_PRICING }
            });
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.id);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();

        // Update the single settings document
        const updateFields = {
            seo: body.seo,
            images: body.images,
            updatedAt: new Date()
        };

        if (body.pricing) {
            const validation = validatePricingData(body.pricing);
            if (!validation.isValid) {
                return NextResponse.json({ success: false, error: validation.errors.join(' ') }, { status: 400 });
            }
            updateFields.pricing = {
                ...body.pricing,
                amount: Number(body.pricing.amount),
                updatedAt: new Date()
            };
        }

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: updateFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating site settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
