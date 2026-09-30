
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaImage, FaSearch, FaUpload, FaSpinner, FaTag, FaPlus, FaTrash } from 'react-icons/fa';

export default function AdminSettings({ token }) {
    const [settings, setSettings] = useState({
        seo: { title: '', description: '', keywords: '' },
        images: { gallery: [] },
        pricing: { amount: 1999, currency: '₹', features: [] }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('seo');
    const [uploading, setUploading] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/site-settings');
            if (res.data.success) {
                setSettings(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            alert('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSeoChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            seo: { ...prev.seo, [name]: value }
        }));
    };

    const handleImageChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            images: { ...prev.images, [key]: value }
        }));

    };

    const handlePricingChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [name]: value }
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...(settings.pricing.features || [])];
        newFeatures[index] = value;
        setSettings(prev => ({
            ...prev,
            pricing: { ...prev.pricing, features: newFeatures }
        }));
    };

    const addFeature = () => {
        setSettings(prev => ({
            ...prev,
            pricing: { ...prev.pricing, features: [...(prev.pricing.features || []), ''] }
        }));
    };

    const removeFeature = (index) => {
        const newFeatures = [...(settings.pricing.features || [])];
        newFeatures.splice(index, 1);
        setSettings(prev => ({
            ...prev,
            pricing: { ...prev.pricing, features: newFeatures }
        }));
    };

    // Handle nested array for gallery or testimonials if needed, 
    // but for now keeping it simple with direct replacement of single images
    // and a simple logic for gallery inputs.

    const handleUpload = async (e, key) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(key);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                handleImageChange(key, res.data.data.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put('/api/site-settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    const imageFields = [
        { key: 'homeHeroFamily', label: 'Home Hero Image' },
        { key: 'memorialSample', label: 'Memorial Sample' },
        { key: 'processFlow', label: 'Process Flow Diagram' },
        { key: 'pricingIllustration', label: 'Pricing Illustration' },
        { key: 'heartIcon', label: 'Heart Icon' },
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>Site Settings & Configuration</h2>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {saving ? <FaSpinner className="spin" /> : <FaSave />} Save Changes
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', flexWrap: 'wrap' }}>
                <button
                    style={{
                        padding: '1rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'seo' ? '2px solid var(--deep-purple)' : 'none',
                        color: activeTab === 'seo' ? 'var(--deep-purple)' : 'var(--gray)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onClick={() => setActiveTab('seo')}
                >
                    <FaSearch /> SEO Optimization
                </button>
                <button
                    style={{
                        padding: '1rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'images' ? '2px solid var(--deep-purple)' : 'none',
                        color: activeTab === 'images' ? 'var(--deep-purple)' : 'var(--gray)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onClick={() => setActiveTab('images')}
                >
                    <FaImage /> Image Management
                </button>
                <button
                    style={{
                        padding: '1rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'pricing' ? '2px solid var(--deep-purple)' : 'none',
                        color: activeTab === 'pricing' ? 'var(--deep-purple)' : 'var(--gray)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onClick={() => setActiveTab('pricing')}
                >
                    <FaTag /> Pricing & Features
                </button>
            </div>

            {activeTab === 'seo' && (
                <div style={{ maxWidth: '800px' }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meta Title</label>
                        <input
                            type="text"
                            name="title"
                            value={settings.seo?.title || ''}
                            onChange={handleSeoChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <small style={{ color: '#666' }}>Default title for the application</small>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Meta Description</label>
                        <textarea
                            name="description"
                            value={settings.seo?.description || ''}
                            onChange={handleSeoChange}
                            rows={4}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Keywords</label>
                        <input
                            type="text"
                            name="keywords"
                            value={settings.seo?.keywords || ''}
                            onChange={handleSeoChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                        <small style={{ color: '#666' }}>Comma separated keywords</small>
                    </div>
                </div>
            )}

            {activeTab === 'images' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {imageFields.map(field => (
                        <div key={field.key} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h4 style={{ margin: '0 0 1rem 0' }}>{field.label}</h4>
                            <div style={{ marginBottom: '1rem', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                {settings.images?.[field.key] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={settings.images[field.key]}
                                        alt={field.label}
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <span style={{ color: '#aaa' }}>No Image</span>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={settings.images?.[field.key] || ''}
                                    onChange={(e) => handleImageChange(field.key, e.target.value)}
                                    placeholder="Image URL"
                                    style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }}
                                />
                                <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', minWidth: '40px' }}>
                                    {uploading === field.key ? <FaSpinner className="spin" /> : <FaUpload />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleUpload(e, field.key)}
                                        disabled={uploading === field.key}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}

                    {/* Gallery Section currently just handled as a list of inputs would be better, but simplified for now */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <h3>Gallery Images</h3>
                        <p style={{ color: '#666' }}>Edit gallery images below.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                            {settings.images?.gallery?.map((url, idx) => (
                                <div key={idx} style={{ position: 'relative' }}>
                                    <div style={{ marginBottom: '0.5rem', height: '100px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => {
                                            const newGallery = [...(settings.images.gallery || [])];
                                            newGallery[idx] = e.target.value;
                                            setSettings(prev => ({ ...prev, images: { ...prev.images, gallery: newGallery } }));
                                        }}
                                        style={{ width: '100%', padding: '0.3rem', fontSize: '0.8rem' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'pricing' && (
                <div style={{ maxWidth: '800px' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Currency Symbol</label>
                            <input
                                type="text"
                                name="currency"
                                value={settings.pricing?.currency || '₹'}
                                onChange={handlePricingChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={settings.pricing?.amount || 1999}
                                onChange={handlePricingChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Package Features</label>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>List the features included in this package.</p>

                        {(settings.pricing?.features || []).map((feature, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    placeholder="Feature description"
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                />
                                <button
                                    onClick={() => removeFeature(index)}
                                    style={{
                                        padding: '0.8rem',
                                        background: '#ffebee',
                                        color: '#d32f2f',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addFeature}
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                background: '#f5f5f5',
                                border: '1px dashed #bdbdbd',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--deep-purple)',
                                fontWeight: '500'
                            }}
                        >
                            <FaPlus /> Add Feature
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
