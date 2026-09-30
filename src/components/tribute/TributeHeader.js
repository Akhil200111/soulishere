import { FaFeatherAlt } from 'react-icons/fa';

export default function TributeHeader({ onOpenComposer, sortOption, onSortChange, totalCount = 0 }) {
    return (
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="tribute-header-title" style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.8rem',
                color: '#6e5c53',
                margin: '0 0 0.5rem 0',
                fontWeight: 'normal'
            }}>
                Tributes & Memories
            </h2>

            <p style={{
                fontSize: '1.05rem',
                color: '#706862',
                fontStyle: 'italic',
                maxWidth: '500px',
                margin: '0 auto 1.75rem auto',
                lineHeight: 1.6
            }}>
                &quot;Share a memory, message, or thought to honor their life.&quot;
            </p>

            <div className="tribute-header-controls" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '0.5rem'
            }}>
                {/* Sorting Options */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.88rem', color: '#8C7B70', fontWeight: '500' }}>Sort by:</span>
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        style={{
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #E0DAD1',
                            borderRadius: '20px',
                            padding: '0.4rem 1rem',
                            fontSize: '0.88rem',
                            color: '#4A3E54',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="featured">Featured First</option>
                    </select>
                </div>

                {/* Share a Tribute Button */}
                <button
                    onClick={onOpenComposer}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.65rem 1.4rem',
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
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b57f85'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C48F95'}
                >
                    <FaFeatherAlt style={{ fontSize: '0.85rem' }} />
                    <span>Share a Tribute</span>
                </button>
            </div>
        </div>
    );
}
