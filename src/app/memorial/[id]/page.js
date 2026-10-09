'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import MemorialContent from '@/components/MemorialContent';
import { FaQrcode, FaLock, FaHome, FaUser } from 'react-icons/fa';

function MemorialViewContent({ memorialId }) {
    const searchParams = useSearchParams();
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRestricted, setIsRestricted] = useState(false);
    const [submittingGuestbook, setSubmittingGuestbook] = useState(false);

    useEffect(() => {
        const fetchMemorial = async () => {
            const urlKey = searchParams.get('key');
            let keyToUse = urlKey;

            if (urlKey) {
                try {
                    sessionStorage.setItem(`memorial_access_${memorialId}`, urlKey);
                    localStorage.setItem(`memorial_access_${memorialId}`, urlKey);
                } catch (e) {
                    console.error('Storage error:', e);
                }
            } else {
                try {
                    keyToUse = sessionStorage.getItem(`memorial_access_${memorialId}`) || localStorage.getItem(`memorial_access_${memorialId}`);
                } catch (e) {
                    console.error('Storage error:', e);
                }
            }

            try {
                const config = keyToUse ? {
                    params: { key: keyToUse },
                    headers: { 'x-qr-key': keyToUse }
                } : {};

                const res = await axios.get(`/api/memorials/${memorialId}`, config);
                setMemorial(res.data.data);
                setIsRestricted(false);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.data?.isRestricted) {
                    setIsRestricted(true);
                } else {
                    console.error('Error fetching memorial:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        if (memorialId) {
            fetchMemorial();
        }
    }, [memorialId, searchParams]);

    const handleHug = async () => {
        try {
            const urlKey = searchParams.get('key') || sessionStorage.getItem(`memorial_access_${memorialId}`);
            const config = urlKey ? { params: { key: urlKey }, headers: { 'x-qr-key': urlKey } } : {};
            const res = await axios.post(`/api/memorials/${memorialId}/hug`, {}, config);
            if (res.data && typeof res.data.hugCount === 'number') {
                setMemorial(prev => prev ? { ...prev, hugCount: res.data.hugCount } : prev);
            }
        } catch (err) {
            console.error('Error adding hug:', err.response?.data?.message || err.message);
        }
    };

    const handleGuestbookSubmit = async (guestbookForm) => {
        setSubmittingGuestbook(true);
        try {
            const urlKey = searchParams.get('key') || sessionStorage.getItem(`memorial_access_${memorialId}`);
            const config = urlKey ? { params: { key: urlKey }, headers: { 'x-qr-key': urlKey } } : {};
            await axios.post(`/api/memorials/${memorialId}/guestbook`, guestbookForm, config);
            
            // Refetch memorial to get updated guestbook
            const res = await axios.get(`/api/memorials/${memorialId}`, config);
            setMemorial(res.data.data);
        } catch (err) {
            console.error('Error submitting guestbook entry:', err);
        } finally {
            setSubmittingGuestbook(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (isRestricted) {
        return (
            <div style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem',
                background: 'linear-gradient(135deg, #faf7fd 0%, #f3e8ff 100%)'
            }}>
                <div style={{
                    maxWidth: '520px',
                    width: '100%',
                    background: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(129, 91, 181, 0.12)',
                    border: '1px solid #eedbfa',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f3e8ff 0%, #eedbfa 100%)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        boxShadow: '0 8px 20px rgba(129, 91, 181, 0.15)'
                    }}>
                        <FaLock style={{ fontSize: '2.5rem', color: '#815bb5' }} />
                    </div>

                    <h2 style={{
                        fontSize: '1.8rem',
                        color: '#2d1b4e',
                        fontFamily: 'serif',
                        marginBottom: '0.75rem',
                        fontWeight: '700'
                    }}>
                        QR Code Required
                    </h2>

                    <p style={{ color: '#665e75', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                        This memorial is private and can only be accessed by scanning its official physical QR code. Direct link sharing is restricted.
                    </p>

                    <div style={{
                        background: '#faf7fd',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid #eedbfa',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textAlign: 'left'
                    }}>
                        <FaQrcode style={{ fontSize: '1.8rem', color: '#815bb5', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', color: '#523773', lineHeight: '1.4' }}>
                            Scan the QR code on the memorial plaque or printout to view this page.
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <Link href="/auth" style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            padding: '0.9rem 1.5rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 6px 20px rgba(61, 37, 86, 0.2)'
                        }}>
                            <FaUser /> Log In as Owner / Admin
                        </Link>
                        
                        <Link href="/" style={{
                            width: '100%',
                            background: '#faf7fd',
                            color: '#6c43a6',
                            padding: '0.9rem 1.5rem',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            border: '1px solid #eedbfa',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaHome /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!memorial) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center', color: '#665e75' }}>
                <h2>Memorial not found</h2>
                <Link href="/" style={{ color: '#815bb5', marginTop: '1rem', display: 'inline-block' }}>Back to Home</Link>
            </div>
        );
    }

    return (
        <MemorialContent 
            memorial={memorial}
            onHug={handleHug}
            onGuestbookSubmit={handleGuestbookSubmit}
            submittingGuestbook={submittingGuestbook}
            adminControls={null}
        />
    );
}

export default function MemorialView({ params }) {
    const { id } = use(params);

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <MemorialViewContent memorialId={id} />
        </Suspense>
    );
}

