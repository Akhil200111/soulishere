import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
    FaReply, 
    FaEllipsisV, 
    FaStar, 
    FaEdit, 
    FaTrash,
    FaCheck,
    FaBan,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { getRelativeTime, getAuthorInitials, getAvatarBg } from '@/utils/tributeHelpers';
import TributeReplyItem from './TributeReplyItem';
import TributeReplyComposer from './TributeReplyComposer';

export default function TributeCard({
    tribute,
    currentUser = null,
    isAdmin = false,
    onLike,
    onAddReply,
    onDeleteReply,
    onEditTribute,
    onDeleteTribute,
    onModerateTribute
}) {
    const [showReplyComposer, setShowReplyComposer] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const menuRef = useRef(null);

    // Optimistic Like state
    const currentUserId = currentUser?.id ? String(currentUser.id) : (currentUser?._id ? String(currentUser._id) : null);
    const initialLikes = (tribute.likes || []).map(k => String(k));
    const isLikedByCurrentUser = currentUserId ? initialLikes.includes(currentUserId) : false;

    const [liked, setLiked] = useState(isLikedByCurrentUser);
    const [likeCount, setLikeCount] = useState(initialLikes.length);

    useEffect(() => {
        const userIdStr = currentUser?.id ? String(currentUser.id) : (currentUser?._id ? String(currentUser._id) : null);
        const currentLikes = (tribute.likes || []).map(k => String(k));
        setLiked(userIdStr ? currentLikes.includes(userIdStr) : false);
        setLikeCount(currentLikes.length);
    }, [tribute.likes, currentUser]);

    // Close options menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLikeClick = async () => {
        if (!currentUser) {
            alert('Please sign in to like a tribute.');
            return;
        }

        const prevLiked = liked;
        const prevCount = likeCount;

        const nextLiked = !liked;
        const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
        setLiked(nextLiked);
        setLikeCount(nextCount);

        try {
            await onLike(tribute._id);
        } catch (err) {
            console.error('Failed to toggle like:', err);
            setLiked(prevLiked);
            setLikeCount(prevCount);
        }
    };

    const handleReplySubmit = async (replyData) => {
        setSubmittingReply(true);
        try {
            await onAddReply(tribute._id, replyData);
            setShowReplyComposer(false);
            setShowReplies(true);
        } finally {
            setSubmittingReply(false);
        }
    };

    const isAuthor = currentUser?.id && tribute.userId === currentUser.id;
    const canManage = isAuthor || isAdmin;
    const replies = tribute.replies || [];

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.5rem',
            border: '1px solid #EAE3D9',
            boxShadow: '0 4px 18px rgba(115, 80, 145, 0.04)',
            marginBottom: '1.25rem',
            position: 'relative',
            transition: 'all 200ms ease'
        }}>
            {/* Featured Memory Badge */}
            {tribute.isFeatured && (
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    color: '#C48F95',
                    backgroundColor: 'rgba(196, 143, 149, 0.1)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    marginBottom: '0.85rem'
                }}>
                    <FaStar style={{ fontSize: '0.7rem' }} />
                    <span>Featured Memory</span>
                </div>
            )}

            {/* Header: Author & Options Menu */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {tribute.avatarUrl ? (
                        <img
                            src={tribute.avatarUrl}
                            alt={tribute.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: getAvatarBg(tribute.name),
                            color: '#4A3E54',
                            fontSize: '0.92rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {getAuthorInitials(tribute.name)}
                        </div>
                    )}
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#2C221E', fontWeight: '600' }}>
                            {tribute.name}
                        </h4>
                        <span style={{ fontSize: '0.82rem', color: '#8C7B70' }}>
                            {getRelativeTime(tribute.date)}
                        </span>
                    </div>
                </div>

                {/* Options Menu */}
                {canManage && (
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            aria-label="Options"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#A39C95',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                padding: '0.4rem'
                            }}
                        >
                            <FaEllipsisV />
                        </button>

                        {showMenu && (
                            <div style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #E0DAD1',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                                minWidth: '150px',
                                zIndex: 10,
                                overflow: 'hidden',
                                padding: '0.35rem 0'
                            }}>
                                {isAuthor && (
                                    <button
                                        onClick={() => { setShowMenu(false); onEditTribute(tribute); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            width: '100%', padding: '0.55rem 1rem', border: 'none',
                                            backgroundColor: 'transparent', color: '#4A3E54', fontSize: '0.85rem',
                                            cursor: 'pointer', textAlign: 'left'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FAF8F5'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <FaEdit style={{ color: '#8C7B70' }} /> Edit
                                    </button>
                                )}

                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={() => { setShowMenu(false); onModerateTribute(tribute._id, { isFeatured: !tribute.isFeatured }); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                width: '100%', padding: '0.55rem 1rem', border: 'none',
                                                backgroundColor: 'transparent', color: '#4A3E54', fontSize: '0.85rem',
                                                cursor: 'pointer', textAlign: 'left'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FAF8F5'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <FaStar style={{ color: '#C48F95' }} /> {tribute.isFeatured ? 'Unfeature' : 'Feature'}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => { setShowMenu(false); onDeleteTribute(tribute._id); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        width: '100%', padding: '0.55rem 1rem', border: 'none',
                                        backgroundColor: 'transparent', color: '#E53E3E', fontSize: '0.85rem',
                                        cursor: 'pointer', textAlign: 'left'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FDF2F2'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tribute Content */}
            <p style={{
                fontSize: '0.98rem',
                color: '#4A3E54',
                lineHeight: 1.65,
                margin: '0 0 1.25rem 0',
                whiteSpace: 'pre-wrap'
            }}>
                &quot;{tribute.message}&quot;
            </p>

            {/* Actions Bar: Like, Reply & Toggle Replies */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                borderTop: '1px solid #FAF5F0',
                paddingTop: '0.75rem'
            }}>
                {/* Like Button */}
                <button
                    onClick={handleLikeClick}
                    aria-label={liked ? 'Unlike tribute' : 'Like tribute'}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'transparent',
                        border: 'none',
                        color: liked ? '#C48F95' : '#8C7B70',
                        fontSize: '0.92rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                    }}
                >
                    {liked ? (
                        <Image src="/heart_colored.png" width={18} height={18} alt="Liked" style={{ objectFit: 'contain' }} />
                    ) : (
                        <Image src="/heart_icon.png" width={18} height={18} alt="Like" style={{ objectFit: 'contain' }} />
                    )}
                    <span>{likeCount}</span>
                </button>

                {/* Reply Action */}
                <button
                    onClick={() => {
                        const nextComposerState = !showReplyComposer;
                        setShowReplyComposer(nextComposerState);
                        if (nextComposerState && replies.length > 0) {
                            setShowReplies(true);
                        }
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'transparent',
                        border: 'none',
                        color: showReplyComposer ? '#5C4A42' : '#8C7B70',
                        fontSize: '0.92rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'color 150ms ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#5C4A42'}
                    onMouseOut={(e) => e.currentTarget.style.color = showReplyComposer ? '#5C4A42' : '#8C7B70'}
                >
                    <FaReply style={{ fontSize: '0.85rem' }} />
                    <span>Reply</span>
                </button>

                {/* View/Hide Replies Toggle Button */}
                {replies.length > 0 && (
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'transparent',
                            border: 'none',
                            color: showReplies ? '#C48F95' : '#8C7B70',
                            fontSize: '0.88rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'color 150ms ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#C48F95'}
                        onMouseOut={(e) => e.currentTarget.style.color = showReplies ? '#C48F95' : '#8C7B70'}
                    >
                        {showReplies ? (
                            <FaChevronUp style={{ fontSize: '0.78rem' }} />
                        ) : (
                            <FaChevronDown style={{ fontSize: '0.78rem' }} />
                        )}
                        <span>{showReplies ? 'Hide Replies' : `View ${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}</span>
                    </button>
                )}
            </div>

            {/* Inline Reply Composer */}
            {showReplyComposer && (
                <TributeReplyComposer
                    onSubmit={handleReplySubmit}
                    onCancel={() => setShowReplyComposer(false)}
                    currentUser={currentUser}
                    submitting={submittingReply}
                />
            )}

            {/* Subordinate Replies List (Hidden initially, shown only when user opens replies) */}
            {showReplies && replies.length > 0 && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.5rem', borderTop: '1px solid #FAF5F0' }}>
                    {replies.map(reply => (
                        <TributeReplyItem
                            key={reply._id}
                            reply={reply}
                            currentUser={currentUser}
                            isAdmin={isAdmin}
                            onDeleteReply={(replyId) => onDeleteReply(tribute._id, replyId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
