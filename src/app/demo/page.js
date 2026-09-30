'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import MemorialContent from '@/components/MemorialContent';

function DemoMemorialWrapper() {
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submittingGuestbook, setSubmittingGuestbook] = useState(false);

    useEffect(() => {
        const fetchDemoMemorial = async () => {
            try {
                const res = await axios.get('/api/memorials/dummy');
                setMemorial(res.data.data);
            } catch (err) {
                console.error('Error fetching demo memorial:', err);
                setError('Demo memorial not found or currently unavailable.');
            } finally {
                setLoading(false);
            }
        };
        fetchDemoMemorial();
    }, []);

    const handleHug = async () => {
        if (!memorial) return;
        try {
            const res = await axios.post(`/api/memorials/${memorial._id}/hug`);
            setMemorial({ ...memorial, hugCount: res.data.hugCount });
        } catch (err) {
            console.error('Error adding hug:', err);
        }
    };

    const handleGuestbookSubmit = async (guestbookForm) => {
        if (!memorial) return;
        setSubmittingGuestbook(true);
        try {
            await axios.post(`/api/memorials/${memorial._id}/guestbook`, guestbookForm);
            // Refetch memorial to get updated guestbook
            const res = await axios.get('/api/memorials/dummy');
            setMemorial(res.data.data);
        } catch (err) {
            console.error('Error submitting guestbook entry:', err);
        } finally {
            setSubmittingGuestbook(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    if (error || !memorial) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7fd' }}>
                <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ color: '#2d1b4e', fontFamily: 'serif', marginBottom: '1rem' }}>{error || 'Demo Memorial Not Found'}</h2>
                    <p style={{ color: '#665e75' }}>Please check back later.</p>
                </div>
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

export default function DemoMemorialPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DemoMemorialWrapper />
        </Suspense>
    );
}
