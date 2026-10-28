'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
    FaCheck, 
    FaShieldAlt, 
    FaQrcode, 
    FaHeart, 
    FaInfinity, 
    FaLock, 
    FaArrowRight, 
    FaChevronDown,
    FaCreditCard
} from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PricingPage() {
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const fetchPricing = async () => {
            try {
                const res = await axios.get('/api/pricing');
                if (res.data.success) {
                    setPricing(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load pricing:', err);
                // Fallback
                setPricing({
                    packageName: 'Complete Memorial Package',
                    description: 'One complete package to preserve your legacy forever. No hidden fees, no subscriptions, just a single one-time payment.',
                    amount: 1499,
                    currency: '₹',
                    currencyCode: 'INR',
                    originalAmount: 2499,
                    features: [
                        'YouTube Video Embedding',
                        'Profile & Cover Pictures',
                        'Complete Guest Book',
                        'Family Tree Documentation',
                        'Life Timeline & Events',
                        'Premium Design Templates',
                        'Permanent Memorial Page'
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPricing();
    }, []);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    if (loading) return <LoadingSpinner />;

    const currency = pricing?.currency || '₹';
    const amount = Number(pricing?.amount || 1499);
    const originalAmount = pricing?.originalAmount ? Number(pricing.originalAmount) : null;
    const savings = (originalAmount && originalAmount > amount) 
        ? Math.round(((originalAmount - amount) / originalAmount) * 100) 
        : null;

    const faqs = [
        {
            q: 'Is this a monthly subscription or a one-time fee?',
            a: 'It is strictly a single, one-time payment. Once paid, your memorial page is hosted permanently without recurring charges or maintenance fees.'
        },
        {
            q: 'What is included in the QR Code generation?',
            a: 'Each approved memorial generates a high-resolution 1024x1024 PNG, scalable vector SVG, and printable plaque template. You can engrave or print this QR code on physical markers, headstones, and memorial plaques.'
        },
        {
            q: 'Can I edit the memorial after making the payment?',
            a: 'Yes, absolutely. You can update life stories, add new gallery photos, embed YouTube videos, and update the family tree anytime from your dashboard.'
        },
        {
            q: 'How is payment processed and verified?',
            a: 'All transactions are processed securely through certified Razorpay payment gateways using 256-bit SSL encryption. Payment verification is cryptographically confirmed on the server in real-time.'
        }
    ];

    return (
        <div style={{ background: '#faf7fd', minHeight: '100vh', paddingTop: '7rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#eedbfa',
                        color: '#6c43a6',
                        padding: '0.4rem 1.25rem',
                        borderRadius: '50px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        marginBottom: '1.25rem',
                        border: '1px solid #d8b4fe'
                    }}>
                        <FaShieldAlt /> Single One-Time Payment
                    </div>

                    <h1 style={{ fontSize: '3rem', color: '#2d1b4e', fontFamily: 'serif', fontWeight: '500', marginBottom: '1rem', lineHeight: 1.2 }}>
                        Simple, Transparent <span style={{ color: '#815bb5' }}>Pricing</span>
                    </h1>

                    <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                        {pricing?.description || 'One complete package to preserve your loved one\'s story forever. No hidden fees or recurring subscriptions.'}
                    </p>
                </div>

                {/* Main Pricing Showcase Card */}
                <div className="pricing-page-card">
                    {/* Ribbon */}
                    <div className="pricing-page-ribbon">
                        ALL FEATURES<br />INCLUDED
                    </div>

                    <span className="pricing-page-subtitle">
                        Lifetime Remembrance
                    </span>

                    <h2 className="pricing-page-title">
                        {pricing?.packageName || 'Complete Memorial Package'}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="pricing-page-amount">
                            {currency}{amount.toLocaleString()}
                        </span>
                        <span style={{ color: '#815bb5', fontSize: '1.1rem', fontWeight: '600' }}>/ one-time</span>
                    </div>

                    {originalAmount && originalAmount > amount && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                            <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '1.2rem' }}>
                                {currency}{originalAmount.toLocaleString()}
                            </span>
                            {savings && (
                                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                                    Save {savings}%
                                </span>
                            )}
                        </div>
                    )}

                    <div style={{ width: '100%', height: '1px', background: '#eedbfa', margin: '1.5rem 0 2rem 0' }}></div>

                    {/* Features List */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: '#2d1b4e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem', fontWeight: '700' }}>
                            Included Features:
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {(pricing?.features || []).map((feat, i) => (
                                <li key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: '#faf7fd',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '14px',
                                    border: '1px solid #eedbfa',
                                    fontSize: '0.95rem',
                                    color: '#4a2574',
                                    fontWeight: '500'
                                }}>
                                    <div style={{ background: '#eedbfa', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FaCheck size={12} style={{ color: '#6c43a6' }} />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href="/create-memorial"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            padding: '1.15rem 2rem',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            boxShadow: '0 12px 25px rgba(61, 37, 86, 0.25)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Create Memorial Now <FaArrowRight />
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', color: '#665e75', fontSize: '0.85rem' }}>
                        <FaShieldAlt style={{ color: '#10b981' }} />
                        <span>Encrypted SSL & PCI-DSS Compliant via Razorpay</span>
                    </div>
                </div>

                {/* Value Highlights Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eedbfa', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.5rem' }}>
                            <FaInfinity />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#2d1b4e', marginBottom: '0.5rem', fontWeight: '700' }}>Lifetime Permanent Hosting</h3>
                        <p style={{ color: '#665e75', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                            Never worry about recurring hosting bills or link expirations. Your memorial lives forever.
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eedbfa', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.5rem' }}>
                            <FaQrcode />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#2d1b4e', marginBottom: '0.5rem', fontWeight: '700' }}>Physical QR Code Plaque</h3>
                        <p style={{ color: '#665e75', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                            Download print-ready vectors and images to engrave onto grave markers, cemetery plaques, or keepsake cards.
                        </p>
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #eedbfa', textAlign: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.5rem' }}>
                            <FaHeart />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', color: '#2d1b4e', marginBottom: '0.5rem', fontWeight: '700' }}>Interactive Guest Condolences</h3>
                        <p style={{ color: '#665e75', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                            Family and friends can leave messages, send virtual hugs, and connect across generations.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.2rem', color: '#2d1b4e', fontFamily: 'serif', marginBottom: '2.5rem' }}>
                        Frequently Asked Questions
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map((faq, idx) => (
                            <div key={idx} style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #eedbfa',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease'
                            }}>
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem 1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#2d1b4e' }}>{faq.q}</span>
                                    <FaChevronDown style={{
                                        color: '#815bb5',
                                        transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.2s ease',
                                        flexShrink: 0
                                    }} />
                                </button>
                                {openFaq === idx && (
                                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', color: '#665e75', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
