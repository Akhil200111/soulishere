'use client';

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { FaShieldAlt, FaCheckCircle, FaCheck, FaLock, FaQrcode } from 'react-icons/fa';
import Modal from '@/components/Modal';

export default function MemorialCard({ memorial, showActions = true, pricing: propPricing }) {
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [pricing, setPricing] = useState(propPricing || null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    useEffect(() => {
        if (propPricing) {
            setPricing(propPricing);
        } else if (!pricing) {
            axios.get('/api/pricing')
                .then(res => {
                    if (res.data?.success) {
                        setPricing(res.data.data);
                    }
                })
                .catch(err => console.error('Error loading pricing in MemorialCard:', err));
        }
    }, [propPricing]);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoadingPayment(true);
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Please check your connection.');
            setLoadingPayment(false);
            return;
        }

        try {
            const orderRes = await axios.post('/api/payment/create-order', { memorialId: memorial._id });
            const { orderId, amount, currency, keyId, packageName } = orderRes.data;

            const options = {
                key: keyId,
                amount: amount.toString(),
                currency: currency,
                name: 'Soulishere',
                description: `${packageName || 'Memorial'} - QR Code Generation`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/api/payment/verify', {
                            ...response,
                            memorialId: memorial._id,
                            amount: amount / 100
                        });

                        if (verifyRes.data.success) {
                            alert('Payment successful! Your request has been sent to the Admin.');
                            window.location.reload();
                        }
                    } catch (verifyErr) {
                        alert('Payment verification failed.');
                    }
                },
                theme: { color: '#815bb5' }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert('Payment failed. Please try again.');
            });
            paymentObject.open();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to initialize payment.');
        } finally {
            setLoadingPayment(false);
        }
    };

    const getStatusBadge = () => {
        if (memorial.status === 'draft') return { label: 'Draft', color: '#f59e0b', bg: '#fef3c7' };
        if (memorial.status === 'requested') return { label: 'Pending Admin', color: '#0284c7', bg: '#e0f2fe' };
        if (memorial.status === 'published') return { label: 'Published', color: '#059669', bg: '#d1fae5' };
        if (memorial.status === 'rejected') return { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' };
        return { label: memorial.status, color: '#665e75', bg: 'white' };
    };

    const badge = getStatusBadge();
    const currency = pricing?.currency || '₹';
    const amountVal = pricing?.amount !== undefined ? Number(pricing.amount) : 1499;
    const hasDiscount = pricing?.originalAmount && Number(pricing.originalAmount) > amountVal;
    const savingsPercent = hasDiscount
        ? Math.round(((Number(pricing.originalAmount) - amountVal) / Number(pricing.originalAmount)) * 100)
        : null;

    return (
        <>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(162, 118, 212, 0.08)',
                border: '1px solid #eedbfa',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(162, 118, 212, 0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(162, 118, 212, 0.08)'; }}
            >
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                    src={memorial.profilePicture || '/images/default_profile.png'}
                    alt={`${memorial.firstName} ${memorial.lastName}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: badge.bg,
                    color: badge.color,
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {badge.label}
                </div>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.3rem', color: '#2d1b4e', marginBottom: '0.5rem', fontFamily: 'serif' }}>
                    {memorial.firstName} {memorial.lastName}
                </h3>
                
                <p style={{ color: '#665e75', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                    {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
                </p>
                
                {showActions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <Link href={`/memorial/${memorial._id}`} style={{
                                flex: 1,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                            >
                                View
                            </Link>
                            
                            {memorial.status === 'draft' && (
                                <Link href={`/create-memorial?id=${memorial._id}`} style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    background: '#faf7fd',
                                    color: '#6c43a6',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    border: '1px solid #eedbfa',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#eedbfa'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#faf7fd'; }}
                                >
                                    Edit
                                </Link>
                            )}
                        </div>

                        {memorial.status === 'draft' && (
                            <button 
                                onClick={() => setShowCheckoutModal(true)} 
                                disabled={loadingPayment} 
                                style={{
                                    width: '100%',
                                    background: loadingPayment ? '#ccc' : '#10b981',
                                    color: 'white',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: loadingPayment ? 'not-allowed' : 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    transition: 'opacity 0.2s ease'
                                }}
                                onMouseEnter={(e) => { if(!loadingPayment) e.currentTarget.style.opacity = '0.9'; }}
                                onMouseLeave={(e) => { if(!loadingPayment) e.currentTarget.style.opacity = '1'; }}
                            >
                                {loadingPayment ? 'Processing...' : `Pay ${currency}${amountVal.toLocaleString()} & Request QR Code`}
                            </button>
                        )}

                        {memorial.status === 'requested' && (
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                background: '#e0f2fe',
                                color: '#0284c7',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                border: '1px solid #bae6fd'
                            }}>
                                ⌛ Payment Received. Pending Admin Approval
                            </div>
                        )}
                        
                        {memorial.status === 'published' && (
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                background: '#d1fae5',
                                color: '#059669',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                border: '1px solid #a7f3d0'
                            }}>
                                🎉 Memorial Published
                            </div>
                        )}

                        {memorial.status === 'rejected' && (
                            <div style={{
                                width: '100%',
                                textAlign: 'center',
                                background: '#fee2e2',
                                color: '#dc2626',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                border: '1px solid #fca5a5'
                            }}>
                                ❌ Request Rejected by Admin
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Checkout & Payment Summary Modal - Rendered outside card to ensure full viewport responsiveness */}
        <Modal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                title="Checkout & Order Summary"
                maxWidth="560px"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Recipient Profile Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #faf7fd 0%, #f4ecfb 100%)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid #eedbfa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid #815bb5',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(129, 91, 181, 0.2)'
                        }}>
                            <Image
                                src={memorial.profilePicture || '/images/default_profile.png'}
                                alt={`${memorial.firstName} ${memorial.lastName}`}
                                fill
                                sizes="56px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.75rem', color: '#6c43a6', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
                                Memorial Recipient
                            </div>
                            <div style={{
                                fontSize: '1.2rem',
                                color: '#2d1b4e',
                                fontWeight: '700',
                                fontFamily: 'serif',
                                margin: '0.15rem 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {memorial.firstName} {memorial.lastName}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#665e75' }}>
                                {formatDate(memorial.birthDate)} - {formatDate(memorial.deathDate)}
                            </div>
                        </div>
                    </div>

                    {/* Package Details & Inclusions */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #eedbfa',
                        borderRadius: '16px',
                        padding: '1.25rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2d1b4e', fontWeight: '700' }}>
                                    {pricing?.packageName || 'Complete Memorial Package'}
                                </h4>
                                <span style={{ fontSize: '0.78rem', color: '#059669', background: '#d1fae5', padding: '0.2rem 0.55rem', borderRadius: '50px', fontWeight: '600', display: 'inline-block', marginTop: '0.3rem' }}>
                                    Lifetime Access • No Subscriptions
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#2d1b4e', lineHeight: 1 }}>
                                    {currency}{amountVal.toLocaleString()}
                                </div>
                                {hasDiscount && (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.35rem' }}>
                                        <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85rem' }}>
                                            {currency}{Number(pricing.originalAmount).toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', fontWeight: '700', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                            Save {savingsPercent}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {pricing?.description && (
                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#665e75', lineHeight: '1.45' }}>
                                {pricing.description}
                            </p>
                        )}

                        {/* Inclusions Feature List */}
                        <div style={{ borderTop: '1px dashed #eedbfa', paddingTop: '0.75rem' }}>
                            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#815bb5', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Everything Included:
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.45rem' }}>
                                {(pricing?.features?.length > 0 ? pricing.features : [
                                    'Laser-Engraved QR Code Plaque',
                                    'Permanent Memorial Hosting',
                                    'Profile & Cover Gallery Photos',
                                    'YouTube Video Embedding',
                                    'Guest Tribute Book & Condolences',
                                    'Family Lineage & Events Timeline'
                                ]).map((feat, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#3d2556' }}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#eedbfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <FaCheck size={9} style={{ color: '#6c43a6' }} />
                                        </div>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Transparent Order Summary */}
                    <div style={{
                        background: '#faf7fd',
                        borderRadius: '16px',
                        padding: '1.1rem 1.25rem',
                        border: '1px solid #eedbfa'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#665e75', marginBottom: '0.4rem' }}>
                            <span>Memorial Package Fee</span>
                            <span style={{ color: '#2d1b4e', fontWeight: '600' }}>{currency}{amountVal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#665e75', marginBottom: '0.4rem' }}>
                            <span>QR Plaque Manufacturing & Assets</span>
                            <span style={{ color: '#059669', fontWeight: '600' }}>Included (Free)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#665e75', marginBottom: '0.6rem' }}>
                            <span>Taxes & Gateway Fees</span>
                            <span style={{ color: '#059669', fontWeight: '600' }}>Inclusive (₹0)</span>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: '#eedbfa', margin: '0.6rem 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#2d1b4e' }}>Total Payable Amount:</div>
                                <div style={{ fontSize: '0.75rem', color: '#665e75' }}>One-time payment • No renewal fees</div>
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#815bb5' }}>
                                {currency}{amountVal.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        fontSize: '0.8rem',
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <FaShieldAlt size={16} style={{ flexShrink: 0, color: '#16a34a' }} />
                        <span>Secured by Razorpay • 256-Bit SSL Encrypted • Instant Admin Notification</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => setShowCheckoutModal(false)}
                            style={{
                                flex: 1,
                                minWidth: '120px',
                                background: '#faf7fd',
                                color: '#665e75',
                                border: '1px solid #eedbfa',
                                padding: '0.85rem 1.25rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#eedbfa'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#faf7fd'; }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCheckoutModal(false);
                                handlePayment();
                            }}
                            disabled={loadingPayment}
                            style={{
                                flex: 2,
                                minWidth: '220px',
                                background: loadingPayment ? '#cbd5e1' : 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                color: 'white',
                                padding: '0.85rem 1.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: loadingPayment ? 'not-allowed' : 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 15px rgba(61, 37, 86, 0.25)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <FaLock size={13} />
                            {loadingPayment ? 'Processing...' : `Pay ${currency}${amountVal.toLocaleString()} & Request QR`}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
