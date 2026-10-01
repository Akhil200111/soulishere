import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    fetchTributes, 
    createTribute, 
    updateTribute, 
    deleteTribute, 
    toggleLikeTribute, 
    createReply, 
    deleteReply,
    moderateTribute
} from '@/lib/api/tributes';

import TributeHeader from './TributeHeader';
import TributeCard from './TributeCard';
import TributeEmptyState from './TributeEmptyState';
import TributeComposer from './TributeComposer';

export default function TributeWall({ memorialId, memorialStatus = 'published' }) {
    const { user, isAdmin } = useAuth();

    const [tributes, setTributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [sortOption, setSortOption] = useState('newest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [showComposer, setShowComposer] = useState(false);
    const [editingTribute, setEditingTribute] = useState(null);
    const [submittingTribute, setSubmittingTribute] = useState(false);

    // Fetch Tributes from API
    const loadTributes = useCallback(async (isInitial = true, nextPage = 1, currentSort = sortOption) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await fetchTributes(memorialId, { page: nextPage, limit: 10, sort: currentSort });
            if (res.success) {
                if (isInitial) {
                    setTributes(res.data || []);
                } else {
                    setTributes(prev => [...prev, ...(res.data || [])]);
                }
                setHasMore(res.pagination?.hasMore || false);
                setPage(nextPage);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load tributes');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [memorialId, sortOption]);

    useEffect(() => {
        loadTributes(true, 1, sortOption);
    }, [loadTributes, sortOption]);

    const handleSortChange = (newSort) => {
        setSortOption(newSort);
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            loadTributes(false, page + 1, sortOption);
        }
    };

    // Submit new or edited tribute
    const handleTributeSubmit = async (formData) => {
        setSubmittingTribute(true);
        try {
            if (editingTribute) {
                const res = await updateTribute(memorialId, editingTribute._id, formData);
                if (res.success) {
                    setTributes(prev => prev.map(t => t._id === editingTribute._id ? { ...t, ...res.data } : t));
                }
            } else {
                const res = await createTribute(memorialId, formData);
                if (res.success) {
                    setTributes(prev => [res.data, ...prev]);
                }
            }
            setShowComposer(false);
            setEditingTribute(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Unable to share tribute. Please try again.');
        } finally {
            setSubmittingTribute(false);
        }
    };

    // Like / Unlike Tribute
    const handleLikeTribute = async (entryId, visitorId = null) => {
        const res = await toggleLikeTribute(memorialId, entryId, visitorId);
        if (res.success) {
            setTributes(prev => prev.map(t => {
                if (t._id === entryId) {
                    return { ...t, likes: res.likes };
                }
                return t;
            }));
            return res;
        } else {
            throw new Error(res.message || 'Failed to update like state');
        }
    };

    // Add Reply
    const handleAddReply = async (entryId, replyData) => {
        const res = await createReply(memorialId, entryId, replyData);
        if (res.success) {
            setTributes(prev => prev.map(t => {
                if (t._id === entryId) {
                    const existingReplies = t.replies || [];
                    return { ...t, replies: [...existingReplies, res.data] };
                }
                return t;
            }));
        }
    };

    // Delete Reply
    const handleDeleteReply = async (entryId, replyId) => {
        if (!confirm('Are you sure you want to delete this reply?')) return;
        const res = await deleteReply(memorialId, entryId, replyId);
        if (res.success) {
            setTributes(prev => prev.map(t => {
                if (t._id === entryId) {
                    return { ...t, replies: (t.replies || []).filter(r => r._id !== replyId) };
                }
                return t;
            }));
        }
    };

    // Delete Tribute
    const handleDeleteTribute = async (entryId) => {
        if (!confirm('Are you sure you want to delete this tribute?')) return;
        const res = await deleteTribute(memorialId, entryId);
        if (res.success) {
            setTributes(prev => prev.filter(t => t._id !== entryId));
        }
    };

    // Moderate Tribute (Admin feature/unfeature/status)
    const handleModerateTribute = async (entryId, data) => {
        const res = await moderateTribute(entryId, { memorialId, ...data });
        if (res.success) {
            setTributes(prev => prev.map(t => t._id === entryId ? { ...t, ...res.data } : t));
        }
    };

    return (
        <div>
            {/* Wall Header */}
            <TributeHeader
                onOpenComposer={() => { setEditingTribute(null); setShowComposer(true); }}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                totalCount={tributes.length}
            />

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '0.85rem 1.25rem',
                    backgroundColor: '#FDF2F2',
                    color: '#9B1C1C',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    fontSize: '0.92rem',
                    border: '1px solid #FBD5D5'
                }}>
                    {error}
                </div>
            )}

            {/* Loading Skeletons */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '18px',
                            padding: '1.5rem',
                            border: '1px solid #EAE3D9',
                            height: '140px',
                            opacity: 0.6
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E0DAD1' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <div style={{ width: '120px', height: '14px', backgroundColor: '#E0DAD1', borderRadius: '4px' }} />
                                    <div style={{ width: '70px', height: '12px', backgroundColor: '#E0DAD1', borderRadius: '4px' }} />
                                </div>
                            </div>
                            <div style={{ width: '90%', height: '14px', backgroundColor: '#E0DAD1', borderRadius: '4px' }} />
                        </div>
                    ))}
                </div>
            ) : tributes.length === 0 ? (
                <TributeEmptyState onOpenComposer={() => { setEditingTribute(null); setShowComposer(true); }} />
            ) : (
                <div>
                    {tributes.map(tribute => (
                        <TributeCard
                            key={tribute._id}
                            tribute={tribute}
                            currentUser={user}
                            isAdmin={isAdmin}
                            onLike={handleLikeTribute}
                            onAddReply={handleAddReply}
                            onDeleteReply={handleDeleteReply}
                            onEditTribute={(t) => { setEditingTribute(t); setShowComposer(true); }}
                            onDeleteTribute={handleDeleteTribute}
                            onModerateTribute={handleModerateTribute}
                        />
                    ))}

                    {/* Pagination / Load More */}
                    {hasMore && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                style={{
                                    padding: '0.75rem 2rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #C48F95',
                                    color: '#C48F95',
                                    borderRadius: '30px',
                                    fontSize: '0.92rem',
                                    fontWeight: '500',
                                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                                    transition: 'all 200ms ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#C48F95'; e.currentTarget.style.color = '#FFFFFF'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#C48F95'; }}
                            >
                                {loadingMore ? 'Loading...' : 'Load More Tributes'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Composer Modal */}
            <TributeComposer
                isOpen={showComposer}
                onClose={() => { setShowComposer(false); setEditingTribute(null); }}
                onSubmit={handleTributeSubmit}
                initialData={editingTribute}
                currentUser={user}
                submitting={submittingTribute}
            />
        </div>
    );
}
