import { useState } from 'react';

export default function TributeReplyComposer({
    onSubmit,
    onCancel,
    currentUser = null,
    submitting = false
}) {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please write a reply message.');
            return;
        }
        if (!currentUser && (!name.trim() || !email.trim())) {
            setError('Please provide your name and email.');
            return;
        }

        onSubmit({
            message: message.trim(),
            name: name.trim() || currentUser?.name || 'Anonymous Guest',
            email: email.trim() || currentUser?.email || ''
        });
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#FAF8F5',
            borderRadius: '14px',
            border: '1px solid #EAE3D9'
        }}>
            {error && (
                <div style={{ fontSize: '0.82rem', color: '#9B1C1C', marginBottom: '0.5rem' }}>
                    {error}
                </div>
            )}

            {!currentUser && (
                <div className="tribute-reply-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input
                        type="text"
                        placeholder="Your Name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!currentUser}
                        style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #E0DAD1',
                            fontSize: '0.85rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Your Email *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={!currentUser}
                        style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #E0DAD1',
                            fontSize: '0.85rem',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                        }}
                    />
                </div>
            )}

            <textarea
                placeholder="Write a respectful reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                required
                style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #E0DAD1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    backgroundColor: '#FFFFFF',
                    fontFamily: "'Poppins', sans-serif"
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.65rem' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '0.4rem 0.9rem',
                        fontSize: '0.82rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #E0DAD1',
                        borderRadius: '20px',
                        color: '#706862',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        padding: '0.4rem 1.1rem',
                        fontSize: '0.82rem',
                        backgroundColor: '#C48F95',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: '500',
                        cursor: submitting ? 'not-allowed' : 'pointer'
                    }}
                >
                    {submitting ? 'Replying...' : 'Reply'}
                </button>
            </div>
        </form>
    );
}
