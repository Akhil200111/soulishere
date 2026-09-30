import { FaFeatherAlt } from 'react-icons/fa';

export default function TributeEmptyState({ onOpenComposer }) {
    return (
        <div style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: '#FAF8F5',
            borderRadius: '20px',
            border: '1px dashed #E0DAD1',
            margin: '1.5rem 0'
        }}>
            <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(196, 143, 149, 0.12)',
                color: '#C48F95',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '1.25rem'
            }}>
                <FaFeatherAlt />
            </div>

            <h3 style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.2rem',
                color: '#6e5c53',
                margin: '0 0 0.5rem 0',
                fontWeight: 'normal'
            }}>
                Share a Memory
            </h3>

            <p style={{
                fontSize: '0.98rem',
                color: '#8C7B70',
                margin: '0 auto 1.5rem auto',
                maxWidth: '400px',
                lineHeight: 1.6
            }}>
                Be the first to share a memory and honor their life.
            </p>

            <button
                onClick={onOpenComposer}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.7rem 1.6rem',
                    backgroundColor: '#C48F95',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '0.92rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxShadow: '0 4px 12px rgba(196, 143, 149, 0.25)'
                }}
            >
                <FaFeatherAlt style={{ fontSize: '0.85rem' }} />
                <span>Share a Tribute</span>
            </button>
        </div>
    );
}
