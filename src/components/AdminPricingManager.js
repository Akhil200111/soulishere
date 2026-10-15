'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaTag, 
    FaSave, 
    FaPlus, 
    FaTrash, 
    FaCheck, 
    FaShieldAlt, 
    FaInfoCircle, 
    FaExclamationTriangle, 
    FaCheckCircle, 
    FaRedo,
    FaEye
} from 'react-icons/fa';

export default function AdminPricingManager({ token }) {
    const [pricing, setPricing] = useState({
        packageName: 'Complete Memorial Package',
        description: 'One complete package to preserve your legacy forever. No hidden fees, no subscriptions, just a single one-time payment.',
        amount: 1499,
        currency: '₹',
        currencyCode: 'INR',
        originalAmount: 2499,
        minPrice: 100,
        maxPrice: 50000,
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
        updatedAt: null
    });

    const [newFeatureText, setNewFeatureText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        setLoading(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await axios.get('/api/admin/pricing', config);
            if (res.data.success && res.data.data) {
                const data = res.data.data;
                setPricing({
                    packageName: data.packageName || '',
                    description: data.description || '',
                    amount: data.amount != null ? data.amount : '',
                    currency: data.currency || '₹',
                    currencyCode: data.currencyCode || 'INR',
                    originalAmount: data.originalAmount != null ? data.originalAmount : '',
                    minPrice: data.minPrice != null ? data.minPrice : 100,
                    maxPrice: data.maxPrice != null ? data.maxPrice : 50000,
                    features: Array.isArray(data.features) ? data.features : [],
                    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
                    updatedAt: data.updatedAt || null
                });
            }
        } catch (err) {
            console.error('Error fetching admin pricing:', err);
            setStatusMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to load pricing configuration. Using default values.'
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (dataToValidate) => {
        const errors = [];
        const amount = Number(dataToValidate.amount);
        const minPrice = Number(dataToValidate.minPrice);
        const maxPrice = Number(dataToValidate.maxPrice);

        if (isNaN(amount) || amount <= 0) {
            errors.push('Price amount must be a valid number greater than 0.');
        }
        if (isNaN(minPrice) || minPrice < 1) {
            errors.push('Minimum price limit must be at least 1.');
        }
        if (isNaN(maxPrice) || maxPrice < minPrice) {
            errors.push(`Maximum price limit must be equal to or greater than minimum price (${minPrice}).`);
        }
        if (!isNaN(amount) && !isNaN(minPrice) && amount < minPrice) {
            errors.push(`Price amount (${amount}) cannot be less than minimum allowed price (${minPrice}).`);
        }
        if (!isNaN(amount) && !isNaN(maxPrice) && amount > maxPrice) {
            errors.push(`Price amount (${amount}) cannot exceed maximum allowed price (${maxPrice}).`);
        }
        if (!dataToValidate.packageName || !String(dataToValidate.packageName).trim()) {
            errors.push('Package name cannot be empty.');
        }
        if (!dataToValidate.features || dataToValidate.features.length === 0) {
            errors.push('Please include at least one package feature.');
        }

        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleInputChange = (field, value) => {
        const updated = { ...pricing, [field]: value };
        setPricing(updated);
        // Live validation check
        validateForm(updated);
    };

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...pricing.features];
        updatedFeatures[index] = value;
        handleInputChange('features', updatedFeatures);
    };

    const handleAddFeature = () => {
        const trimmed = newFeatureText.trim();
        if (!trimmed) return;
        const updatedFeatures = [...pricing.features, trimmed];
        handleInputChange('features', updatedFeatures);
        setNewFeatureText('');
    };

    const handleRemoveFeature = (index) => {
        const updatedFeatures = pricing.features.filter((_, i) => i !== index);
        handleInputChange('features', updatedFeatures);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setStatusMessage(null);

        if (!validateForm(pricing)) {
            setStatusMessage({
                type: 'error',
                text: 'Please resolve the validation errors before saving.'
            });
            return;
        }

        setSaving(true);
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const payload = {
                packageName: pricing.packageName,
                description: pricing.description,
                amount: Number(pricing.amount),
                currency: pricing.currency,
                currencyCode: pricing.currencyCode,
                minPrice: Number(pricing.minPrice),
                maxPrice: Number(pricing.maxPrice),
                originalAmount: pricing.originalAmount ? Number(pricing.originalAmount) : null,
                features: pricing.features,
                isActive: pricing.isActive
            };

            const res = await axios.put('/api/admin/pricing', payload, config);
            if (res.data.success) {
                const data = res.data.data;
                setPricing(prev => ({
                    ...prev,
                    packageName: data.packageName || '',
                    description: data.description || '',
                    amount: data.amount != null ? data.amount : '',
                    currency: data.currency || '₹',
                    currencyCode: data.currencyCode || 'INR',
                    originalAmount: data.originalAmount != null ? data.originalAmount : '',
                    minPrice: data.minPrice != null ? data.minPrice : 100,
                    maxPrice: data.maxPrice != null ? data.maxPrice : 50000,
                    features: Array.isArray(data.features) ? data.features : (prev.features || []),
                    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
                    updatedAt: data.updatedAt || null
                }));
                setStatusMessage({
                    type: 'success',
                    text: 'Memorial package pricing successfully updated! Changes are now live across the platform.'
                });
            }
        } catch (err) {
            console.error('Error saving pricing:', err);
            setStatusMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to save pricing configuration.'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#665e75' }}>
                <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #eedbfa', borderTop: '3px solid #815bb5', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p>Loading pricing configuration...</p>
            </div>
        );
    }

    const calculatedSavings = (pricing.originalAmount && Number(pricing.originalAmount) > Number(pricing.amount))
        ? Math.round(((Number(pricing.originalAmount) - Number(pricing.amount)) / Number(pricing.originalAmount)) * 100)
        : null;

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif', margin: '0 0 0.5rem 0' }}>
                        Memorial Pricing & Package Management
                    </h2>
                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>
                        Control the public memorial package price, safety range boundaries, and feature highlights dynamically.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={fetchPricing}
                        disabled={saving}
                        style={{
                            background: '#faf7fd',
                            color: '#6c43a6',
                            border: '1px solid #eedbfa',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaRedo /> Refresh
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || validationErrors.length > 0}
                        style={{
                            background: validationErrors.length > 0 ? '#cbd5e1' : 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.75rem',
                            borderRadius: '12px',
                            cursor: validationErrors.length > 0 || saving ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 15px rgba(61, 37, 86, 0.2)'
                        }}
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Pricing Changes'}
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: statusMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fca5a5'}`
                }}>
                    {statusMessage.type === 'success' ? <FaCheckCircle size={18} /> : <FaExclamationTriangle size={18} />}
                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{statusMessage.text}</span>
                </div>
            )}

            {/* Validation Alerts */}
            {validationErrors.length > 0 && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    background: '#fffbeb',
                    color: '#92400e',
                    border: '1px solid #fde68a'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        <FaExclamationTriangle /> Please correct the following issues:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem' }}>
                        {validationErrors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Two-Column Grid: Left Edit Form, Right Live Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                
                {/* Form Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Card 1: Package Identification */}
                    <div style={{ background: '#faf7fd', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eedbfa' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#2d1b4e', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaTag style={{ color: '#815bb5' }} /> Package Details
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.4rem' }}>
                                Package Name
                            </label>
                            <input
                                type="text"
                                value={pricing.packageName || ''}
                                onChange={(e) => handleInputChange('packageName', e.target.value)}
                                placeholder="e.g. Complete Memorial Package"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d5c4e3', fontSize: '0.95rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.4rem' }}>
                                Package Description / Tagline
                            </label>
                            <textarea
                                rows={3}
                                value={pricing.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Short description displayed on landing and checkout pages..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d5c4e3', fontSize: '0.95rem', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="isActiveToggle"
                                checked={Boolean(pricing.isActive)}
                                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                style={{ width: '18px', height: '18px', accentColor: '#815bb5', cursor: 'pointer' }}
                            />
                            <label htmlFor="isActiveToggle" style={{ fontSize: '0.9rem', color: '#2d1b4e', cursor: 'pointer', fontWeight: '500' }}>
                                Package is Active (Available for new payments & checkout)
                            </label>
                        </div>
                    </div>

                    {/* Card 2: Price Configuration & Boundaries */}
                    <div style={{ background: '#faf7fd', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eedbfa' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#2d1b4e', margin: '0 0 0.5rem 0' }}>
                            Price & Range Guardrails
                        </h3>
                        <p style={{ color: '#665e75', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                            Sets the active price charged via Razorpay. Guardrail limits protect against accidental pricing errors.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.4rem' }}>
                                    Active Price Amount
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#815bb5' }}>
                                        {pricing.currency || '₹'}
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={pricing.amount != null ? pricing.amount : ''}
                                        onChange={(e) => handleInputChange('amount', e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2rem', borderRadius: '10px', border: '1px solid #815bb5', fontSize: '1.1rem', fontWeight: '700', color: '#2d1b4e' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.4rem' }}>
                                    Original Price (Strikethrough)
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: '600', color: '#9ca3af' }}>
                                        {pricing.currency || '₹'}
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={pricing.originalAmount != null ? pricing.originalAmount : ''}
                                        onChange={(e) => handleInputChange('originalAmount', e.target.value)}
                                        placeholder="Optional"
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2rem', borderRadius: '10px', border: '1px solid #d5c4e3', fontSize: '0.95rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Guardrails (Min / Max) */}
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px dashed #d5c4e3', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#6c43a6', fontSize: '0.88rem', fontWeight: '600' }}>
                                <FaShieldAlt /> Safety Price Guardrails
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#665e75', marginBottom: '0.25rem' }}>
                                        Minimum Allowed Price
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={pricing.minPrice != null ? pricing.minPrice : ''}
                                        onChange={(e) => handleInputChange('minPrice', e.target.value)}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #eedbfa', fontSize: '0.9rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#665e75', marginBottom: '0.25rem' }}>
                                        Maximum Allowed Price
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={pricing.maxPrice != null ? pricing.maxPrice : ''}
                                        onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #eedbfa', fontSize: '0.9rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Currency Code & Symbol */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.3rem' }}>
                                    Currency Symbol
                                </label>
                                <input
                                    type="text"
                                    value={pricing.currency || ''}
                                    onChange={(e) => handleInputChange('currency', e.target.value)}
                                    placeholder="₹"
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d5c4e3', fontSize: '0.95rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', marginBottom: '0.3rem' }}>
                                    Currency Code (ISO)
                                </label>
                                <input
                                    type="text"
                                    value={pricing.currencyCode || ''}
                                    onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                                    placeholder="INR"
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d5c4e3', fontSize: '0.95rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Features List */}
                    <div style={{ background: '#faf7fd', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eedbfa' }}>
                        <h3 style={{ fontSize: '1.15rem', color: '#2d1b4e', margin: '0 0 0.5rem 0' }}>
                            Package Feature Inclusions
                        </h3>
                        <p style={{ color: '#665e75', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                            These bullets appear on the landing page, the dedicated pricing page, and user checkout.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                            {(pricing.features || []).map((feature, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eedbfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FaCheck size={11} style={{ color: '#6c43a6' }} />
                                    </div>
                                    <input
                                        type="text"
                                        value={feature || ''}
                                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                        style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #eedbfa', background: 'white', fontSize: '0.9rem' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        title="Remove feature"
                                        style={{
                                             padding: '0.65rem',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={newFeatureText || ''}
                                onChange={(e) => setNewFeatureText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                                placeholder="Type a new feature..."
                                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #d5c4e3', fontSize: '0.9rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                style={{
                                    background: '#815bb5',
                                    color: 'white',
                                    padding: '0.7rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                <FaPlus /> Add
                            </button>
                        </div>
                    </div>

                </div>

                {/* Right Column: Live Interactive Preview */}
                <div>
                    <div style={{
                        position: 'sticky',
                        top: '1rem',
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem 2rem',
                        boxShadow: '0 20px 50px rgba(162, 118, 212, 0.12)',
                        border: '1px solid #eedbfa'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #faf7fd', paddingBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#815bb5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <FaEye /> Live User-Facing Preview
                            </span>
                            {pricing.isActive ? (
                                <span style={{ background: '#d1fae5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                                    Active
                                </span>
                            ) : (
                                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                                    Paused
                                </span>
                            )}
                        </div>

                        <h3 style={{ fontSize: '1.4rem', color: '#2d1b4e', fontFamily: 'serif', marginBottom: '0.5rem', fontWeight: '700' }}>
                            {pricing.packageName || 'Memorial Package'}
                        </h3>

                        <p style={{ color: '#665e75', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            {pricing.description}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: '800', color: '#2d1b4e', lineHeight: 1 }}>
                                {pricing.currency || '₹'}{Number(pricing.amount || 0).toLocaleString()}
                            </span>
                            <span style={{ color: '#815bb5', fontSize: '1rem', fontWeight: '600' }}>/ one-time</span>
                        </div>

                        {pricing.originalAmount && Number(pricing.originalAmount) > Number(pricing.amount) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1.1rem' }}>
                                    {pricing.currency || '₹'}{Number(pricing.originalAmount).toLocaleString()}
                                </span>
                                {calculatedSavings && (
                                    <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                                        Save {calculatedSavings}%
                                    </span>
                                )}
                            </div>
                        )}

                        <div style={{ width: '100%', height: '1px', background: '#eedbfa', margin: '1.5rem 0' }}></div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#3d2556', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                                Everything Included:
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {(pricing.features || []).map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#4a2574' }}>
                                        <div style={{ background: '#eedbfa', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <FaCheck size={10} style={{ color: '#6c43a6' }} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="button"
                            disabled={true}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '14px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 10px 25px rgba(61, 37, 86, 0.2)',
                                cursor: 'default'
                            }}
                        >
                            Pay {pricing.currency || '₹'}{Number(pricing.amount || 0).toLocaleString()} & Request QR Code
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', color: '#665e75', fontSize: '0.8rem' }}>
                            <FaShieldAlt style={{ color: '#10b981' }} />
                            <span>PCI-DSS Secured by Razorpay & SSL Encrypted</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
