'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { FaCheck, FaTrash, FaEnvelope, FaPhone, FaUser, FaClock, FaEye, FaSearch, FaFilter, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function AdminEnquiryManager({ token, onUnviewedCountChange }) {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // id of item being processed
    const [filter, setFilter] = useState('all'); // 'all' | 'unviewed' | 'viewed'
    const [search, setSearch] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null); // For viewing full message

    const onUnviewedCountChangeRef = useRef(onUnviewedCountChange);
    useEffect(() => {
        onUnviewedCountChangeRef.current = onUnviewedCountChange;
    }, [onUnviewedCountChange]);

    // Keep parent unviewed count badge in sync after state changes without triggering setState during render
    useEffect(() => {
        if (hasLoaded && onUnviewedCountChangeRef.current) {
            const unviewed = enquiries.filter(e => !e.viewed).length;
            onUnviewedCountChangeRef.current(unviewed);
        }
    }, [enquiries, hasLoaded]);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/enquiries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const list = res.data.data || [];
                setEnquiries(list);
                setHasLoaded(true);
            }
        } catch (err) {
            console.error('Failed to fetch enquiries:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchEnquiries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Handle Mark as Viewed (tick button)
    const handleMarkAsViewed = async (id, currentViewed = false) => {
        try {
            setActionLoading(id);
            const res = await axios.patch(`/api/admin/enquiries/${id}`, { viewed: true }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setEnquiries(prev => prev.map(item => item._id === id ? { ...item, viewed: true } : item));
                if (selectedEnquiry && selectedEnquiry._id === id) {
                    setSelectedEnquiry(prev => (prev ? { ...prev, viewed: true } : null));
                }
            }
        } catch (err) {
            console.error('Failed to mark enquiry as viewed:', err);
            alert('Failed to update enquiry status.');
        } finally {
            setActionLoading(null);
        }
    };

    // Handle Delete Enquiry
    const handleDeleteEnquiry = async (id) => {
        if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
            return;
        }

        try {
            setActionLoading(id);
            const res = await axios.delete(`/api/admin/enquiries/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setEnquiries(prev => prev.filter(item => item._id !== id));
                if (selectedEnquiry && selectedEnquiry._id === id) {
                    setSelectedEnquiry(null);
                }
            }
        } catch (err) {
            console.error('Failed to delete enquiry:', err);
            alert('Failed to delete enquiry.');
        } finally {
            setActionLoading(null);
        }
    };

    // Filter and search
    const filteredEnquiries = useMemo(() => {
        return enquiries.filter(item => {
            // Tab filter
            if (filter === 'unviewed' && item.viewed) return false;
            if (filter === 'viewed' && !item.viewed) return false;

            // Search query
            if (search.trim()) {
                const q = search.toLowerCase();
                const nameMatch = item.name?.toLowerCase().includes(q);
                const phoneMatch = item.phone?.toLowerCase().includes(q);
                const emailMatch = item.email?.toLowerCase().includes(q);
                const messageMatch = item.enquiry?.toLowerCase().includes(q);
                return nameMatch || phoneMatch || emailMatch || messageMatch;
            }
            return true;
        });
    }, [enquiries, filter, search]);

    const totalCount = enquiries.length;
    const unviewedCount = enquiries.filter(e => !e.viewed).length;
    const viewedCount = enquiries.filter(e => e.viewed).length;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            {/* Header with Title and Quick Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif', margin: '0 0 0.35rem 0' }}>
                        Customer Enquiries
                    </h2>
                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>
                        Manage messages and contact form submissions from website visitors.
                    </p>
                </div>

                {/* Quick Metric Pills */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{
                        background: '#faf7fd',
                        border: '1px solid #eedbfa',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#665e75' }}>Total:</span>
                        <span style={{ fontWeight: '700', color: '#2d1b4e', fontSize: '1.05rem' }}>{totalCount}</span>
                    </div>

                    <div style={{
                        background: unviewedCount > 0 ? '#fef2f2' : '#faf7fd',
                        border: `1px solid ${unviewedCount > 0 ? '#fecaca' : '#eedbfa'}`,
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: unviewedCount > 0 ? '#b91c1c' : '#665e75' }}>Unviewed:</span>
                        <span style={{ fontWeight: '700', color: unviewedCount > 0 ? '#b91c1c' : '#2d1b4e', fontSize: '1.05rem' }}>{unviewedCount}</span>
                    </div>

                    <div style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#15803d' }}>Viewed:</span>
                        <span style={{ fontWeight: '700', color: '#15803d', fontSize: '1.05rem' }}>{viewedCount}</span>
                    </div>
                </div>
            </div>

            {/* Controls: Search and Filter Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#faf7fd',
                padding: '0.85rem 1.25rem',
                borderRadius: '16px',
                border: '1px solid #eedbfa'
            }}>
                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            background: filter === 'all' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'white',
                            color: filter === 'all' ? 'white' : '#4a2574',
                            border: `1px solid ${filter === 'all' ? 'transparent' : '#eedbfa'}`,
                            padding: '0.45rem 1.1rem',
                            borderRadius: '50px',
                            fontSize: '0.86rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        All ({totalCount})
                    </button>
                    <button
                        onClick={() => setFilter('unviewed')}
                        style={{
                            background: filter === 'unviewed' ? '#ef4444' : 'white',
                            color: filter === 'unviewed' ? 'white' : '#b91c1c',
                            border: `1px solid ${filter === 'unviewed' ? 'transparent' : '#fecaca'}`,
                            padding: '0.45rem 1.1rem',
                            borderRadius: '50px',
                            fontSize: '0.86rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Unviewed ({unviewedCount})
                    </button>
                    <button
                        onClick={() => setFilter('viewed')}
                        style={{
                            background: filter === 'viewed' ? '#10b981' : 'white',
                            color: filter === 'viewed' ? 'white' : '#047857',
                            border: `1px solid ${filter === 'viewed' ? 'transparent' : '#a7f3d0'}`,
                            padding: '0.45rem 1.1rem',
                            borderRadius: '50px',
                            fontSize: '0.86rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Viewed ({viewedCount})
                    </button>
                </div>

                {/* Search Box */}
                <div style={{ position: 'relative', minWidth: '240px', flex: '0 1 320px' }}>
                    <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9383a5', fontSize: '0.85rem' }} />
                    <input
                        type="text"
                        placeholder="Search by name, phone, enquiry..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.5rem 1rem 0.5rem 2.2rem',
                            borderRadius: '50px',
                            border: '1px solid #eedbfa',
                            fontSize: '0.88rem',
                            outline: 'none',
                            background: 'white',
                            color: '#2d1b4e'
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9383a5', fontSize: '0.8rem' }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Enquiries Table */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#665e75' }}>
                    <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #eedbfa', borderTopColor: '#815bb5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Loading enquiries...</p>
                </div>
            ) : filteredEnquiries.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3.5rem 2rem',
                    background: '#fdfafc',
                    borderRadius: '16px',
                    border: '1px dashed #eedbfa',
                    color: '#665e75'
                }}>
                    <FaEnvelope style={{ fontSize: '2.5rem', color: '#d5c4e3', marginBottom: '1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d1b4e', fontSize: '1.2rem' }}>No Enquiries Found</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem' }}>
                        {search ? 'Try adjusting your search criteria.' : (filter === 'unviewed' ? 'All enquiries have been viewed.' : 'No customer enquiries received yet.')}
                    </p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid #eedbfa', boxShadow: '0 4px 15px rgba(162, 118, 212, 0.04)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
                        <thead>
                            <tr style={{ background: '#faf7fd', borderBottom: '1px solid #eedbfa' }}>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem' }}>Sender</th>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem' }}>Contact</th>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem', width: '38%' }}>Enquiry</th>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem' }}>Date</th>
                                <th style={{ padding: '1rem 1.25rem', color: '#3d2556', fontWeight: '600', fontSize: '0.88rem', textAlign: 'right', minWidth: '110px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnquiries.map((item) => {
                                const isUnviewed = !item.viewed;
                                return (
                                    <tr
                                        key={item._id}
                                        style={{
                                            borderBottom: '1px solid #eedbfa',
                                            background: isUnviewed ? 'rgba(254, 242, 242, 0.45)' : 'white',
                                            transition: 'background 0.2s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setSelectedEnquiry(item)}
                                        onMouseEnter={(e) => e.currentTarget.style.background = isUnviewed ? 'rgba(254, 242, 242, 0.75)' : '#fdfafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = isUnviewed ? 'rgba(254, 242, 242, 0.45)' : 'white'}
                                    >
                                        {/* Status Pill */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            {item.viewed ? (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    background: '#ecfdf5',
                                                    color: '#059669',
                                                    border: '1px solid #a7f3d0',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '50px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: '600'
                                                }}>
                                                    <FaCheckCircle style={{ fontSize: '0.75rem' }} /> Viewed
                                                </span>
                                            ) : (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    background: '#fef2f2',
                                                    color: '#dc2626',
                                                    border: '1px solid #fecaca',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '50px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: '700',
                                                    letterSpacing: '0.2px'
                                                }}>
                                                    <FaExclamationCircle style={{ fontSize: '0.75rem' }} /> New
                                                </span>
                                            )}
                                        </td>

                                        {/* Name */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontWeight: isUnviewed ? '700' : '600', color: '#2d1b4e', fontSize: '0.95rem' }}>
                                                {item.name}
                                            </div>
                                        </td>

                                        {/* Phone & Email */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <a
                                                    href={`tel:${item.phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        color: '#2d1b4e',
                                                        fontWeight: '600',
                                                        fontSize: '0.88rem',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    <FaPhone style={{ color: '#815bb5', fontSize: '0.75rem' }} />
                                                    {item.phone}
                                                </a>
                                                {item.email ? (
                                                    <a
                                                        href={`mailto:${item.email}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            color: '#665e75',
                                                            fontSize: '0.82rem',
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        <FaEnvelope style={{ color: '#9383a5', fontSize: '0.75rem' }} />
                                                        {item.email}
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#a098ac', fontSize: '0.8rem', fontStyle: 'italic' }}>No email provided</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Enquiry snippet */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{
                                                color: '#4a3d5c',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {item.enquiry}
                                            </div>
                                            <span style={{ fontSize: '0.76rem', color: '#815bb5', fontWeight: '600', marginTop: '0.2rem', display: 'inline-block' }}>
                                                Click to view full message
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td style={{ padding: '1rem 1.25rem', color: '#665e75', fontSize: '0.84rem', whiteSpace: 'nowrap' }}>
                                            {formatDate(item.createdAt)}
                                        </td>

                                        {/* Actions: Tick Symbol (Mark Viewed) & Trash Symbol (Delete) */}
                                        <td
                                            style={{ padding: '1rem 1.25rem', textAlign: 'right' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                {/* Button 1: Tick Symbol (Mark as Viewed) */}
                                                <button
                                                    onClick={() => handleMarkAsViewed(item._id, item.viewed)}
                                                    disabled={actionLoading === item._id || item.viewed}
                                                    title={item.viewed ? "Already viewed" : "Mark as Viewed"}
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        border: item.viewed ? '1px solid #d1fae5' : '1px solid #a7f3d0',
                                                        background: item.viewed ? '#ecfdf5' : '#10b981',
                                                        color: item.viewed ? '#059669' : '#ffffff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: item.viewed ? 'default' : 'pointer',
                                                        boxShadow: item.viewed ? 'none' : '0 2px 8px rgba(16, 185, 129, 0.3)',
                                                        transition: 'all 0.2s ease',
                                                        opacity: actionLoading === item._id ? 0.6 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!item.viewed) {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!item.viewed) {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                                                        }
                                                    }}
                                                >
                                                    <FaCheck style={{ fontSize: '0.85rem' }} />
                                                </button>

                                                {/* Button 2: Delete icon (Delete watched/selected enquiry) */}
                                                <button
                                                    onClick={() => handleDeleteEnquiry(item._id)}
                                                    disabled={actionLoading === item._id}
                                                    title="Delete Enquiry"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '50%',
                                                        border: '1px solid #fecaca',
                                                        background: '#fef2f2',
                                                        color: '#ef4444',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        opacity: actionLoading === item._id ? 0.6 : 1
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#fee2e2';
                                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.25)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#fef2f2';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <FaTrash style={{ fontSize: '0.82rem' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Message Modal */}
            {selectedEnquiry && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(23, 11, 38, 0.65)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem'
                }}
                onClick={() => setSelectedEnquiry(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '24px',
                            maxWidth: '600px',
                            width: '100%',
                            boxShadow: '0 25px 60px rgba(45, 27, 78, 0.25)',
                            border: '1px solid #eedbfa',
                            overflow: 'hidden',
                            animation: 'memorialTabFadeIn 0.25s ease forwards'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.5rem 1.75rem',
                            background: 'linear-gradient(135deg, #faf7fd 0%, #f4ecfb 100%)',
                            borderBottom: '1px solid #eedbfa',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#2d1b4e', fontSize: '1.35rem', fontFamily: 'serif' }}>
                                    Enquiry Details
                                </h3>
                                <p style={{ margin: '0.2rem 0 0 0', color: '#665e75', fontSize: '0.84rem' }}>
                                    Received on {formatDate(selectedEnquiry.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    border: '1px solid #eedbfa',
                                    background: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#665e75',
                                    fontSize: '1rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '1.75rem' }}>
                            {/* Sender Info Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                background: '#fdfafc',
                                padding: '1rem',
                                borderRadius: '14px',
                                border: '1px solid #faf0fe'
                            }}>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#8a7b9b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Name</span>
                                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '600', color: '#2d1b4e', fontSize: '1rem' }}>
                                        {selectedEnquiry.name}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.78rem', color: '#8a7b9b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Phone</span>
                                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '600', color: '#2d1b4e', fontSize: '1rem' }}>
                                        <a href={`tel:${selectedEnquiry.phone}`} style={{ color: '#2d1b4e', textDecoration: 'none' }}>
                                            {selectedEnquiry.phone}
                                        </a>
                                    </p>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <span style={{ fontSize: '0.78rem', color: '#8a7b9b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Email</span>
                                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: '500', color: '#2d1b4e', fontSize: '0.95rem' }}>
                                        {selectedEnquiry.email ? (
                                            <a href={`mailto:${selectedEnquiry.email}`} style={{ color: '#815bb5', textDecoration: 'none' }}>
                                                {selectedEnquiry.email}
                                            </a>
                                        ) : (
                                            <span style={{ color: '#a098ac', fontStyle: 'italic' }}>Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Message Box */}
                            <div>
                                <span style={{ fontSize: '0.78rem', color: '#8a7b9b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Enquiry Message</span>
                                <div style={{
                                    marginTop: '0.4rem',
                                    background: '#faf7fd',
                                    border: '1px solid #eedbfa',
                                    borderRadius: '14px',
                                    padding: '1.25rem',
                                    color: '#2d1b4e',
                                    lineHeight: 1.7,
                                    fontSize: '0.95rem',
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: '260px',
                                    overflowY: 'auto'
                                }}>
                                    {selectedEnquiry.enquiry}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer with Actions */}
                        <div style={{
                            padding: '1.2rem 1.75rem',
                            borderTop: '1px solid #eedbfa',
                            background: '#faf7fd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                {!selectedEnquiry.viewed ? (
                                    <button
                                        onClick={() => handleMarkAsViewed(selectedEnquiry._id)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.55rem 1.25rem',
                                            borderRadius: '50px',
                                            fontWeight: '600',
                                            fontSize: '0.88rem',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        <FaCheck /> Mark as Viewed
                                    </button>
                                ) : (
                                    <span style={{ color: '#059669', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <FaCheckCircle /> Viewed
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handleDeleteEnquiry(selectedEnquiry._id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        background: '#fef2f2',
                                        color: '#ef4444',
                                        border: '1px solid #fecaca',
                                        padding: '0.55rem 1.25rem',
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaTrash /> Delete Enquiry
                                </button>
                                <button
                                    onClick={() => setSelectedEnquiry(null)}
                                    style={{
                                        background: 'white',
                                        color: '#4a3d5c',
                                        border: '1px solid #eedbfa',
                                        padding: '0.55rem 1.25rem',
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        fontSize: '0.88rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
