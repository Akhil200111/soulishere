
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
        packageName: {
            type: String,
            default: 'Complete Memorial Package',
            trim: true
        },
        description: {
            type: String,
            default: 'One complete package to preserve your legacy forever. No hidden fees, no subscriptions, just a single one-time payment.',
            trim: true
        },
        amount: {
            type: Number,
            default: 1499,
            min: [1, 'Price amount must be at least 1']
        },
        currency: {
            type: String,
            default: '₹',
            trim: true
        },
        currencyCode: {
            type: String,
            default: 'INR',
            trim: true
        },
        originalAmount: {
            type: Number,
            default: null
        },
        minPrice: {
            type: Number,
            default: 100,
            min: [1, 'Minimum price must be at least 1']
        },
        maxPrice: {
            type: Number,
            default: 50000
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
        },
        isActive: {
            type: Boolean,
            default: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Delete existing model in development to prevent schema caching issues
if (mongoose.models.SiteSettings) {
    delete mongoose.models.SiteSettings;
}

export default mongoose.model('SiteSettings', siteSettingsSchema);
