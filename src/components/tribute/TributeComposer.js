import { useState, useEffect } from 'react';
import { FaTimes, FaFeatherAlt } from 'react-icons/fa';

export default function TributeComposer({
    isOpen,
    onClose,
    onSubmit,
    initialData = null,
    currentUser = null,
    submitting = false
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setMessage(initialData.message || '');
            setName(initialData.name || '');
            setEmail(initialData.email || '');
        } else {
            setMessage('');
            setName(currentUser?.name || '');
            setEmail(currentUser?.email || '');
        }
        setError('');
    }, [initialData, currentUser, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter a meaningful tribute message.');
            return;
        }
        if (!currentUser && (!name.trim() || !email.trim())) {
            setError('Please provide your name and email.');
            return;
        }

        onSubmit({
            name: name.trim() || currentUser?.name || 'Anonymous Guest',
            email: email.trim() || currentUser?.email || '',
            message: message.trim()
        });
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(44, 34, 30, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="tribute-composer-modal" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '540px',
                padding: '2rem',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                border: '1px solid #E8E2D9'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaFeatherAlt style={{ color: '#C48F95', fontSize: '1.1rem' }} />
                        <h3 style={{
                            fontFamily: "'Playball', 'Great Vibes', cursive",
                            fontSize: '2rem',
                            color: '#6e5c53',
                            margin: 0,
                            fontWeight: 'normal'
                        }}>
                            {initialData ? 'Edit Tribute' : 'Share a Memory'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#8C7B70',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '0.25rem'
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            backgroundColor: '#FDF2F2',
                            color: '#9B1C1C',
                            padding: '0.6rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.88rem',
                            marginBottom: '1rem',
                            border: '1px solid #FBD5D5'
                        }}>
                            {error}
                        </div>
                    )}

                    {!currentUser && (
                        <div className="tribute-composer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6e5c53', marginBottom: '0.35rem', fontWeight: '500' }}>
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required={!currentUser}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '10px',
                                        border: '1px solid #E0DAD1',
                                        fontSize: '0.92rem',
                                        outline: 'none',
                                        backgroundColor: '#FAF8F5'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6e5c53', marginBottom: '0.35rem', fontWeight: '500' }}>
                                    Your Email *
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    required={!currentUser}
                                    style={{
                                        width: '100%',
                                        padding: '0.65rem 0.85rem',
                                        borderRadius: '10px',
                                        border: '1px solid #E0DAD1',
                                        fontSize: '0.92rem',
                                        outline: 'none',
                                        backgroundColor: '#FAF8F5'
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#6e5c53', marginBottom: '0.35rem', fontWeight: '500' }}>
                            Tribute Message *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write something meaningful about their life..."
                            rows={4}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                border: '1px solid #E0DAD1',
                                fontSize: '0.95rem',
                                outline: 'none',
                                resize: 'vertical',
                                backgroundColor: '#FAF8F5',
                                fontFamily: "'Poppins', sans-serif",
                                lineHeight: 1.6
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '0.65rem 1.25rem',
                                border: '1px solid #E0DAD1',
                                borderRadius: '25px',
                                backgroundColor: 'transparent',
                                color: '#706862',
                                fontSize: '0.9rem',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '0.65rem 1.5rem',
                                border: 'none',
                                borderRadius: '25px',
                                backgroundColor: '#C48F95',
                                color: '#FFFFFF',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {submitting ? 'Sharing...' : (initialData ? 'Update Tribute' : 'Share Tribute')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
