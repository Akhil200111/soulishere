
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getSession } from '@/lib/auth';

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
                }
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
        // Basic auth check - in a real app check for admin role
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();

        // Update the single settings document
        // We use findOneAndUpdate with upsert to ensure we handle the singleton correctly
        const settings = await SiteSettings.findOneAndUpdate(
            {},
            {
                $set: {
                    seo: body.seo,
                    images: body.images,
                    updatedAt: new Date()
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating site settings:', error);
        return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
    }
}
