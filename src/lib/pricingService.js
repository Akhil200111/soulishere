import connectDB from './mongodb.js';
import SiteSettings from '../models/SiteSettings.js';
import User from '../models/User.js';

export const DEFAULT_PRICING = {
    packageName: 'Complete Memorial Package',
    description: 'One complete package to preserve your legacy forever. No hidden fees, no subscriptions, just a single one-time payment.',
    amount: 1499,
    currency: '₹',
    currencyCode: 'INR',
    minPrice: 100,
    maxPrice: 50000,
    originalAmount: null,
    features: [
        'YouTube Video Embedding',
        'Profile & Cover Pictures',
        'Complete Guest Book',
        'Family Tree Documentation',
        'Life Timeline & Events',
        'Premium Design Templates',
        'Permanent Memorial Page'
    ],
    isActive: true,
    updatedAt: new Date()
};

/**
 * Validates pricing inputs according to business rules.
 */
export function validatePricingData(data) {
    const errors = [];
    if (!data) {
        return { isValid: false, errors: ['No pricing data provided.'] };
    }

    const amount = Number(data.amount);
    const minPrice = Number(data.minPrice !== undefined ? data.minPrice : DEFAULT_PRICING.minPrice);
    const maxPrice = Number(data.maxPrice !== undefined ? data.maxPrice : DEFAULT_PRICING.maxPrice);

    if (isNaN(amount) || amount <= 0) {
        errors.push('Price amount must be a positive number greater than 0.');
    }

    if (isNaN(minPrice) || minPrice < 1) {
        errors.push('Minimum price must be at least 1.');
    }

    if (isNaN(maxPrice) || maxPrice < minPrice) {
        errors.push(`Maximum price (${maxPrice}) must be greater than or equal to minimum price (${minPrice}).`);
    }

    if (!isNaN(amount) && !isNaN(minPrice) && amount < minPrice) {
        errors.push(`Price amount (${amount}) cannot be lower than the minimum price limit (${minPrice}).`);
    }

    if (!isNaN(amount) && !isNaN(maxPrice) && amount > maxPrice) {
        errors.push(`Price amount (${amount}) cannot exceed the maximum price limit (${maxPrice}).`);
    }

    if (data.originalAmount !== undefined && data.originalAmount !== null && data.originalAmount !== '') {
        const orig = Number(data.originalAmount);
        if (isNaN(orig) || orig < 0) {
            errors.push('Original price must be a valid positive number.');
        }
    }

    if (!data.packageName || !String(data.packageName).trim()) {
        errors.push('Package name is required.');
    }

    if (data.features && !Array.isArray(data.features)) {
        errors.push('Features must be an array of strings.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Centralized fetch for active memorial pricing configuration.
 * Always returns a validated pricing object with fallbacks.
 */
export async function getMemorialPricing() {
    try {
        await connectDB();
        const settings = await SiteSettings.findOne();

        if (!settings || !settings.pricing) {
            return { ...DEFAULT_PRICING };
        }

        const p = settings.pricing;
        return {
            packageName: p.packageName || DEFAULT_PRICING.packageName,
            description: p.description || DEFAULT_PRICING.description,
            amount: typeof p.amount === 'number' && p.amount > 0 ? p.amount : DEFAULT_PRICING.amount,
            currency: p.currency || DEFAULT_PRICING.currency,
            currencyCode: p.currencyCode || DEFAULT_PRICING.currencyCode,
            minPrice: typeof p.minPrice === 'number' ? p.minPrice : DEFAULT_PRICING.minPrice,
            maxPrice: typeof p.maxPrice === 'number' ? p.maxPrice : DEFAULT_PRICING.maxPrice,
            originalAmount: typeof p.originalAmount === 'number' ? p.originalAmount : null,
            features: Array.isArray(p.features) && p.features.length > 0 ? p.features : DEFAULT_PRICING.features,
            isActive: p.isActive !== undefined ? p.isActive : true,
            updatedAt: p.updatedAt || settings.updatedAt || new Date()
        };
    } catch (err) {
        console.error('Error in getMemorialPricing, using fallback defaults:', err);
        return { ...DEFAULT_PRICING };
    }
}

/**
 * Updates memorial pricing configuration with admin authentication and validation.
 */
export async function updateMemorialPricing(pricingData, sessionUser) {
    if (!sessionUser || !sessionUser.id) {
        return { success: false, status: 401, message: 'Authentication required' };
    }

    await connectDB();
    const adminUser = await User.findById(sessionUser.id);
    if (!adminUser || adminUser.role !== 'admin') {
        return { success: false, status: 403, message: 'Admin authorization required' };
    }

    const validation = validatePricingData(pricingData);
    if (!validation.isValid) {
        return { success: false, status: 400, message: validation.errors.join(' ') };
    }

    const sanitizedFeatures = Array.isArray(pricingData.features)
        ? pricingData.features.map(f => String(f).trim()).filter(Boolean)
        : DEFAULT_PRICING.features;

    const updatedPricing = {
        packageName: String(pricingData.packageName || DEFAULT_PRICING.packageName).trim(),
        description: String(pricingData.description || DEFAULT_PRICING.description).trim(),
        amount: Number(pricingData.amount),
        currency: String(pricingData.currency || DEFAULT_PRICING.currency).trim(),
        currencyCode: String(pricingData.currencyCode || DEFAULT_PRICING.currencyCode).trim().toUpperCase(),
        minPrice: Number(pricingData.minPrice !== undefined ? pricingData.minPrice : DEFAULT_PRICING.minPrice),
        maxPrice: Number(pricingData.maxPrice !== undefined ? pricingData.maxPrice : DEFAULT_PRICING.maxPrice),
        originalAmount: (pricingData.originalAmount !== undefined && pricingData.originalAmount !== null && pricingData.originalAmount !== '')
            ? Number(pricingData.originalAmount)
            : null,
        features: sanitizedFeatures,
        isActive: pricingData.isActive !== undefined ? Boolean(pricingData.isActive) : true,
        updatedAt: new Date()
    };

    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = new SiteSettings({
            pricing: updatedPricing
        });
        await settings.save();
    } else {
        settings.pricing = updatedPricing;
        settings.updatedAt = new Date();
        await settings.save();
    }

    return {
        success: true,
        data: settings.pricing,
        message: 'Memorial pricing configuration updated successfully'
    };
}
