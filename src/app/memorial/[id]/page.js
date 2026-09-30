'use client';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { FaQrcode } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import QRCode from 'react-qr-code';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import MemorialContent from '@/components/MemorialContent';

export default function MemorialView({ params }) {
    const { id } = use(params);
    const { isAdmin } = useAuth();
    const [memorial, setMemorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submittingGuestbook, setSubmittingGuestbook] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [generatingQR, setGeneratingQR] = useState(false);

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

    const handleGenerateQR = async () => {
        if (!isAdmin) return;
        setGeneratingQR(true);
        try {
            const res = await axios.post(`/api/memorials/${id}/qr`);
            setMemorial({ ...memorial, qrGenerated: true });
            setShowQRModal(true);
        } catch (err) {
            console.error('Error generating QR code:', err);
            alert(err.response?.data?.message || 'Failed to generate QR Code');
        } finally {
            setGeneratingQR(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!memorial) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Memorial not found</div>;

    const memorialUrl = typeof window !== 'undefined' ? `${window.location.origin}/memorial/${id}` : '';

    const adminControls = isAdmin ? (
        <button
            className="btn btn-primary"
            onClick={memorial.qrGenerated ? () => setShowQRModal(true) : handleGenerateQR}
            style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                backgroundColor: '#c48f95',
                color: 'white',
                transition: 'all 0.2s ease'
            }}
            disabled={generatingQR}
        >
            <FaQrcode />
            {generatingQR ? 'Generating...' : (memorial.qrGenerated ? 'View QR Code' : 'Generate QR Code')}
        </button>
    ) : null;

    return (
        <>
            <MemorialContent 
                memorial={memorial}
                onHug={handleHug}
                onGuestbookSubmit={handleGuestbookSubmit}
                submittingGuestbook={submittingGuestbook}
                adminControls={adminControls}
            />

            {/* QR Code Modal */}
            {showQRModal && (
                <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="Memorial QR Code">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                            <QRCode value={memorialUrl} size={256} />
                        </div>
                        <p style={{ marginTop: '1.5rem', color: 'var(--gray)' }}>
                            Scan to visit this memorial page.
                        </p>
                        <a
                            href={memorialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'block', marginTop: '1rem', color: 'var(--deep-purple)', wordBreak: 'break-all' }}
                        >
                            {memorialUrl}
                        </a>
                    </div>
                </Modal>
            )}
        </>
    );
}
