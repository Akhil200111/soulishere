import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';

export default function MemorialCard({ memorial, showActions = true }) {
    const [loadingPayment, setLoadingPayment] = useState(false);

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
            const { orderId, amount, currency, keyId } = orderRes.data;

            const options = {
                key: keyId,
                amount: amount.toString(),
                currency: currency,
                name: 'Soulishere',
                description: 'Memorial QR Code Generation',
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

    return (
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
                            <button onClick={handlePayment} disabled={loadingPayment} style={{
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
                                {loadingPayment ? 'Processing...' : 'Pay ₹1499 & Request QR Code'}
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
    );
}

