
import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
    seo: {
        title: {
            type: String,
            default: 'Soulishere - Digital Memorial Platform'
        },
        description: {
            type: String,
            default: 'Create beautiful, lasting digital memorials for your loved ones.'
        },
        keywords: {
            type: String,
            default: 'memorial, tribute, digital memorial, remembrance'
        }
    },
    images: {
        logo: String,
        favicon: String,
        homeHeroBg: String,
        homeHeroFamily: String,
        memorialSample: String,
        processFlow: String,
        pricingIllustration: String,
        heartIcon: String,
        testimonials: [{
            name: String,
            role: String,
            text: String,
            image: String
        }],
        gallery: [String]
    },
    pricing: {
        amount: {
            type: Number,
            default: 1999
        },
        currency: {
            type: String,
            default: '₹'
        },
        features: {
            type: [String],
            default: [
                'YouTube Video Embedding',
                'Profile & Cover Pictures',
                'Complete Guest Book',
                'Family Tree Documentation',
                'Life Timeline & Events',
                'Premium Design Templates',
                'Permanent Memorial Page'
            ]
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
