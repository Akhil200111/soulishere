import { getRelativeTime, getAuthorInitials, getAvatarBg } from '@/utils/tributeHelpers';
import { FaTrash } from 'react-icons/fa';

export default function TributeReplyItem({
    reply,
    currentUser = null,
    isAdmin = false,
    onDeleteReply
}) {
    const isAuthor = currentUser?.id && reply.userId === currentUser.id;
    const canDelete = isAuthor || isAdmin;

    return (
        <div style={{
            position: 'relative',
            paddingLeft: '1.25rem',
            marginTop: '0.85rem'
        }}>
            {/* Left Vertical Line Visual Connection */}
            <div style={{
                position: 'absolute',
                left: '0.35rem',
                top: '0.75rem',
                bottom: '0.75rem',
                width: '2px',
                backgroundColor: 'rgba(212, 202, 190, 0.45)',
                borderRadius: '1px'
            }} />

            <div style={{
                backgroundColor: '#FAF8F5',
                borderRadius: '14px',
                padding: '0.85rem 1.1rem',
                border: '1px solid #EAE3D9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        {reply.avatarUrl ? (
                            <img
                                src={reply.avatarUrl}
                                alt={reply.name}
                                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: getAvatarBg(reply.name),
                                color: '#5C4A42',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getAuthorInitials(reply.name)}
                            </div>
                        )}
                        <div>
                            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#2C221E' }}>
                                {reply.name}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#8C7B70', marginLeft: '0.5rem' }}>
                                {getRelativeTime(reply.date)}
                            </span>
                        </div>
                    </div>

                    {canDelete && (
                        <button
                            onClick={() => onDeleteReply(reply._id)}
                            title="Delete reply"
                            aria-label="Delete reply"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#A39C95',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                padding: '0.2rem',
                                transition: 'color 150ms ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#E53E3E'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#A39C95'}
                        >
                            <FaTrash />
                        </button>
                    )}
                </div>

                <p style={{
                    fontSize: '0.88rem',
                    color: '#4A3E54',
                    lineHeight: 1.55,
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                }}>
                    {reply.message}
                </p>
            </div>
        </div>
    );
}
