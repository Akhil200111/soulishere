'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import MemorialCard from '@/components/MemorialCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaThLarge, FaPlus, FaSignOutAlt, FaLayerGroup, FaCheckCircle, FaEdit } from 'react-icons/fa';

function DashboardContent() {
    const { user, isAuthenticated, isAdmin, loading: authLoading, logout } = useAuth();
    const [memorials, setMemorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get('token');

    // Handle Google Auth Token
    useEffect(() => {
        if (tokenParam) {
            localStorage.setItem('token', tokenParam);
            // Clear URL and reload to initialize AuthContext with new token
            window.location.href = '/dashboard';
        }
    }, [tokenParam]);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated && !tokenParam) {
                router.push('/');
            } else if (isAdmin) {
                router.push('/admin');
            }
        }
    }, [authLoading, isAuthenticated, isAdmin, router, tokenParam]);

    useEffect(() => {
        const fetchMemorials = async () => {
            if (!isAuthenticated) return;

            try {
                const res = await axios.get('/api/memorials');
                setMemorials(res.data.data || []);
            } catch (err) {
                console.error('Error fetching memorials:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMemorials();
        }
    }, [isAuthenticated]);

    if (tokenParam) return <LoadingSpinner />; // Show loading while processing token

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return null;
    }

    const filteredMemorials = memorials.filter(m => {
        if (activeTab === 'all') return true;
        if (activeTab === 'published') return m.status === 'published';
        if (activeTab === 'requested') return m.status === 'requested';
        if (activeTab === 'drafts') return m.status === 'draft';
        return true;
    });

    const publishedCount = memorials.filter(m => m.status === 'published').length;
    const requestedCount = memorials.filter(m => m.status === 'requested').length;
    const draftCount = memorials.filter(m => m.status === 'draft').length;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <Link href="/dashboard" className={`sidebar-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
                    <FaThLarge className="sidebar-icon" />
                    Dashboard
                </Link>
                <Link href="/create-memorial" className={`sidebar-nav-item ${pathname === '/create-memorial' ? 'active' : ''}`}>
                    <FaPlus className="sidebar-icon" />
                    Create Memorial
                </Link>
                {isAdmin && (
                    <Link href="/admin" className="sidebar-nav-item">
                        <FaLayerGroup className="sidebar-icon" />
                        Admin Panel
                    </Link>
                )}
                
                <div className="sidebar-logout">
                    <Link href="/" className="sidebar-nav-item" style={{ width: '100%' }}>
                        Back to Site
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
                    <h1>Welcome, {user?.name}</h1>
                    <p>Manage your memorials and settings here.</p>
                </div>

                {/* Stats Overview */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <FaLayerGroup style={{ color: '#a276d4', fontSize: '1.5rem' }} />
                        </div>
                        <div className="stat-info">
                            <h3>Total Memorials</h3>
                            <p className="stat-value">{memorials.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <FaCheckCircle style={{ color: '#10b981', fontSize: '1.5rem' }} />
                        </div>
                        <div className="stat-info">
                            <h3>Published</h3>
                            <p className="stat-value">{publishedCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <FaEdit style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                        </div>
                        <div className="stat-info">
                            <h3>Drafts</h3>
                            <p className="stat-value">{draftCount}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs-modern">
                    <button
                        className={`dashboard-tab-modern ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Memorials
                    </button>
                    <button
                        className={`dashboard-tab-modern ${activeTab === 'published' ? 'active' : ''}`}
                        onClick={() => setActiveTab('published')}
                    >
                        Published
                    </button>
                    <button
                        className={`dashboard-tab-modern ${activeTab === 'requested' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requested')}
                    >
                        Pending Approval ({requestedCount})
                    </button>
                    <button
                        className={`dashboard-tab-modern ${activeTab === 'drafts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('drafts')}
                    >
                        Drafts
                    </button>
                </div>

                {/* Memorials Grid */}
                {filteredMemorials.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '24px', border: '1px dashed #eedbfa' }}>
                        <div style={{ width: '80px', height: '80px', background: '#faf7fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                            <FaPlus style={{ fontSize: '2rem', color: '#d5c4e3' }} />
                        </div>
                        <h3 style={{ color: '#2d1b4e', fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'serif' }}>No memorials yet</h3>
                        <p style={{ color: '#665e75', marginBottom: '2rem' }}>Create your first memorial to get started.</p>
                        <Link href="/create-memorial" style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            boxShadow: '0 10px 20px rgba(61, 37, 86, 0.2)'
                        }}>
                            Create Memorial
                        </Link>
                    </div>
                ) : (
                    <div className="memorial-grid-modern">
                        {filteredMemorials.map(memorial => (
                            <MemorialCard key={memorial._id} memorial={memorial} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <DashboardContent />
        </Suspense>
    );
}
