'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import MemorialContent from '@/components/MemorialContent';

export default function MemorialView({ params }) {
    const { id } = use(params);
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingGuestbook, setSubmittingGuestbook] = useState(false);

    useEffect(() => {
        const fetchMemorial = async () => {
            try {
                const res = await axios.get(`/api/memorials/${id}`);
                setMemorial(res.data.data);
            } catch (err) {
                console.error('Error fetching memorial:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMemorial();
    }, [id]);

    const handleHug = async () => {
        try {
            const res = await axios.post(`/api/memorials/${id}/hug`);
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
            await axios.post(`/api/memorials/${id}/guestbook`, guestbookForm);
            // Refetch memorial to get updated guestbook
            const res = await axios.get(`/api/memorials/${id}`);
            setMemorial(res.data.data);
        } catch (err) {
            console.error('Error submitting guestbook entry:', err);
        } finally {
            setSubmittingGuestbook(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!memorial) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Memorial not found</div>;

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
