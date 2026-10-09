'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FaUsers, FaBook, FaMoneyBill, FaEye, FaEdit, FaTrash, FaCog, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaStar, FaImages, FaQrcode } from 'react-icons/fa';
import AdminSettings from '@/components/AdminSettings';
import AdminDummyMemorial from '@/components/AdminDummyMemorial';
import AdminGalleryManager from '@/components/AdminGalleryManager';
import LoadingSpinner from '@/components/LoadingSpinner';
import QRModal from '@/components/QRModal';
import { getMemorialQRUrl } from '@/lib/qr';

export default function AdminPanel() {
    const { isAuthenticated, isAdmin, loading: authLoading, token, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [memorials, setMemorials] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('memorials');
    const [activeQRModal, setActiveQRModal] = useState({ isOpen: false, name: '', url: '' });

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isAdmin)) {
            router.push('/dashboard');
        }
    }, [authLoading, isAuthenticated, isAdmin, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAdmin) return;

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [statsRes, memorialsRes, usersRes] = await Promise.all([
                    axios.get('/api/admin/stats', config),
                    axios.get('/api/admin/memorials', config),
                    axios.get('/api/admin/users', config)
                ]);
                setStats(statsRes.data.data);
                setMemorials(memorialsRes.data.data || []);
                setUsers(usersRes.data.data || []);
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin, token]);

    const handleDeleteMemorial = async (id) => {
        if (!confirm('Are you sure you want to delete this memorial? This action cannot be undone.')) {
            return;
        }

        try {
            await axios.delete(`/api/memorials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMemorials(memorials.filter(m => m._id !== id));
            alert('Memorial deleted successfully');
        } catch (err) {
            console.error('Error deleting memorial:', err);
            alert('Failed to delete memorial');
        }
    };

    const handleApproveMemorial = async (id) => {
        if (!confirm('Are you sure you want to approve this memorial and generate the QR code?')) {
            return;
        }

        try {
            await axios.put(`/api/admin/memorials/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update local state
            setMemorials(memorials.map(m => {
                if (m._id === id) {
                    return { ...m, status: 'published', qrGenerated: true };
                }
                return m;
            }));
            
            alert('Memorial approved and QR Code generated successfully.');
        } catch (err) {
            console.error('Error approving memorial:', err);
            alert('Failed to approve memorial');
        }
    };

    const handleRejectMemorial = async (id) => {
        if (!confirm('Are you sure you want to reject this memorial request?')) {
            return;
        }

        try {
            await axios.put(`/api/admin/memorials/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update local state
            setMemorials(memorials.map(m => {
                if (m._id === id) {
                    return { ...m, status: 'rejected', qrGenerated: false };
                }
                return m;
            }));
            
            alert('Memorial request rejected.');
        } catch (err) {
            console.error('Error rejecting memorial:', err);
            alert('Failed to reject memorial');
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (authLoading || loading) return <LoadingSpinner />;
    if (!isAdmin) return null;

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div style={{ padding: '0 1rem 1.5rem 1rem', marginBottom: '1rem', borderBottom: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.25rem', color: '#2d1b4e', fontFamily: 'serif', margin: 0 }}>Admin Panel</h2>
                </div>

                <button 
                    onClick={() => setActiveTab('memorials')} 
                    className={`sidebar-nav-item ${activeTab === 'memorials' ? 'active' : ''}`}
                    style={{ background: activeTab === 'memorials' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                    <FaBook className="sidebar-icon" />
                    Memorials
                </button>
                <button 
                    onClick={() => setActiveTab('users')} 
                    className={`sidebar-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                    style={{ background: activeTab === 'users' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                    <FaUsers className="sidebar-icon" />
                    Users
                </button>
                <button 
                    onClick={() => setActiveTab('settings')} 
                    className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                    style={{ background: activeTab === 'settings' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                    <FaCog className="sidebar-icon" />
                    Settings
                </button>
                <button 
                    onClick={() => setActiveTab('gallery')} 
                    className={`sidebar-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                    style={{ background: activeTab === 'gallery' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                    <FaImages className="sidebar-icon" />
                    Gallery Manager
                </button>
                <button 
                    onClick={() => setActiveTab('dummy-memorial')} 
                    className={`sidebar-nav-item ${activeTab === 'dummy-memorial' ? 'active' : ''}`}
                    style={{ background: activeTab === 'dummy-memorial' ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                    <FaStar className="sidebar-icon" />
                    Demo Memorial
                </button>
                
                <div className="sidebar-logout">
                    <Link href="/" className="sidebar-nav-item" style={{ width: '100%' }}>
                        View Public Site
                    </Link>
                    <button onClick={handleLogout} className="sidebar-nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <FaSignOutAlt className="sidebar-icon" />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-main">
                <div className="dashboard-header-modern">
                    <h1>Admin Overview</h1>
                    <p>Manage the platform, monitor users, and adjust settings.</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-wrapper">
                                <FaUsers style={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Users</h3>
                                <p className="stat-value">{stats.totalUsers}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper">
                                <FaBook style={{ color: '#3b82f6', fontSize: '1.5rem' }} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Memorials</h3>
                                <p className="stat-value">{stats.totalMemorials}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper">
                                <FaCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
                            </div>
                            <div className="stat-info">
                                <h3>Published</h3>
                                <p className="stat-value">{stats.publishedMemorials}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-wrapper">
                                <FaMoneyBill style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                            </div>
                            <div className="stat-info">
                                <h3>Total Revenue</h3>
                                <p className="stat-value">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(162, 118, 212, 0.05)', border: '1px solid #eedbfa' }}>
                    
                    {/* Memorials Tab */}
                    {activeTab === 'memorials' && (
                        <>
                            <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif' }}>All Memorials</h2>
                            {memorials.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#665e75', padding: '2rem' }}>No memorials found.</p>
                            ) : (
                                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #eedbfa' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#faf7fd' }}>
                                            <tr style={{ borderBottom: '1px solid #eedbfa' }}>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Name</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Created By</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Status</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Created</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {memorials.map((memorial) => (
                                                <tr key={memorial._id} style={{ borderBottom: '1px solid #eedbfa', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fdfafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#2d1b4e', fontWeight: '500' }}>{memorial.firstName} {memorial.lastName}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#665e75' }}>{memorial.userId?.name || 'Unknown'}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <span style={{
                                                            background: memorial.status === 'published' ? '#d1fae5' : (memorial.status === 'requested' ? '#e0f2fe' : (memorial.status === 'rejected' ? '#fee2e2' : '#fef3c7')),
                                                            color: memorial.status === 'published' ? '#059669' : (memorial.status === 'requested' ? '#0284c7' : (memorial.status === 'rejected' ? '#dc2626' : '#d97706')),
                                                            padding: '0.4rem 1rem',
                                                            borderRadius: '50px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {memorial.status === 'requested' ? 'Requested' : (memorial.status === 'published' ? 'Published' : (memorial.status === 'rejected' ? 'Rejected' : 'Draft'))}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#665e75' }}>{formatDate(memorial.createdAt)}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
                                                        <Link href={`/memorial/${memorial._id}`} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#faf7fd', color: '#815bb5', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#eedbfa'} onMouseLeave={(e) => e.currentTarget.style.background = '#faf7fd'} title="View">
                                                            <FaEye />
                                                        </Link>
                                                        {memorial.status === 'published' && (
                                                            <button
                                                                onClick={() => setActiveQRModal({
                                                                    isOpen: true,
                                                                    name: `${memorial.firstName} ${memorial.lastName}`,
                                                                    url: getMemorialQRUrl(memorial)
                                                                })}
                                                                title="View, Download or Print QR Code"
                                                                style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#bae6fd'} onMouseLeave={(e) => e.currentTarget.style.background = '#e0f2fe'}
                                                            >
                                                                <FaQrcode />
                                                            </button>
                                                        )}
                                                        {memorial.status === 'requested' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveMemorial(memorial._id)}
                                                                    title="Approve & Generate QR"
                                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#a7f3d0'} onMouseLeave={(e) => e.currentTarget.style.background = '#d1fae5'}
                                                                >
                                                                    <FaCheckCircle />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectMemorial(memorial._id)}
                                                                    title="Reject Memorial Request"
                                                                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fca5a5'} onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                                >
                                                                    <FaTimesCircle />
                                                                </button>
                                                            </>
                                                        )}
                                                        <Link href={`/create-memorial?id=${memorial._id}`} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#faf7fd', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'} onMouseLeave={(e) => e.currentTarget.style.background = '#faf7fd'} title="Edit">
                                                            <FaEdit />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteMemorial(memorial._id)}
                                                            title="Delete"
                                                            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'} onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <>
                            <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif' }}>All Users</h2>
                            {users.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#665e75', padding: '2rem' }}>No users found.</p>
                            ) : (
                                <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #eedbfa' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#faf7fd' }}>
                                            <tr style={{ borderBottom: '1px solid #eedbfa' }}>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Name</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Email</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Role</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Joined</th>
                                                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', color: '#3d2556', fontWeight: '600' }}>Auth Method</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id} style={{ borderBottom: '1px solid #eedbfa', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#fdfafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#2d1b4e', fontWeight: '500' }}>{user.name}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#665e75' }}>{user.email}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <span style={{
                                                            background: user.role === 'admin' ? '#f3e8ff' : '#f3f4f6',
                                                            color: user.role === 'admin' ? '#7e22ce' : '#4b5563',
                                                            padding: '0.4rem 1rem',
                                                            borderRadius: '50px',
                                                            fontSize: '0.85rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#665e75' }}>{formatDate(user.createdAt)}</td>
                                                    <td style={{ padding: '1.25rem 1.5rem', color: '#665e75' }}>
                                                        {user.googleId ? 'Google' : 'Email/Password'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <AdminSettings token={token} />
                    )}

                    {/* Dummy Memorial Tab */}
                    {activeTab === 'dummy-memorial' && (
                        <AdminDummyMemorial token={token} />
                    )}

                    {/* Gallery Manager Tab */}
                    {activeTab === 'gallery' && (
                        <AdminGalleryManager token={token} />
                    )}

                </div>
            </div>

            {/* Admin QR Code Modal */}
            <QRModal
                isOpen={activeQRModal.isOpen}
                onClose={() => setActiveQRModal({ isOpen: false, name: '', url: '' })}
                memorialName={activeQRModal.name}
                memorialUrl={activeQRModal.url}
            />
        </div>
    );
}
