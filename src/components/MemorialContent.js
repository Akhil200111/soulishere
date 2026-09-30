import { useState } from 'react';
import Image from 'next/image';
import { 
    FaHeart, 
    FaCalendar, 
    FaBriefcase, 
    FaGlobe, 
    FaUsers, 
    FaBook, 
    FaImages, 
    FaVideo, 
    FaMapMarkerAlt,
    FaCompass,
    FaFeatherAlt,
    FaUser,
    FaBookOpen
} from 'react-icons/fa';
import FamilyTree from '@/components/FamilyTree';
import TributeWall from '@/components/tribute/TributeWall';
import Modal from '@/components/Modal';

export default function MemorialContent({ 
    memorial, 
    onHug, 
    onGuestbookSubmit, 
    adminControls,
    submittingGuestbook
}) {
    const [activeMainTab, setActiveMainTab] = useState('life-journey');
    const [activeSubTab, setActiveSubTab] = useState('bio');
    const [guestbookForm, setGuestbookForm] = useState({ name: '', email: '', message: '' });
    const [previewPhoto, setPreviewPhoto] = useState(null);

    if (!memorial) return null;

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getYear = (dateVal) => {
        if (!dateVal) return '';
        const d = new Date(dateVal);
        if (!isNaN(d.getFullYear())) return d.getFullYear();
        const match = String(dateVal).match(/\b\d{4}\b/);
        return match ? match[0] : '';
    };

    const birthYear = getYear(memorial.birthDate);
    const deathYear = getYear(memorial.deathDate);
    const dateRange = (birthYear || deathYear) 
        ? (birthYear && deathYear ? `${birthYear} – ${deathYear}` : (birthYear || deathYear)) 
        : '';

    const quoteText = memorial.memorialQuote || memorial.lifeSummary || (memorial.biography ? (memorial.biography.length > 120 ? memorial.biography.slice(0, 120) + '...' : memorial.biography) : '');

    const handleGuestbook = (e) => {
        e.preventDefault();
        if (onGuestbookSubmit) {
            onGuestbookSubmit(guestbookForm);
            setGuestbookForm({ name: '', email: '', message: '' });
        }
    };

    const mainTabs = [
        { id: 'life-journey', icon: FaCompass, label: 'Life Journey' },
        { id: 'stories', icon: FaFeatherAlt, label: 'Stories' },
        { id: 'tribute', icon: FaHeart, label: 'Tribute' }
    ];

    const lifeJourneySubTabs = [
        { id: 'bio', icon: FaBookOpen, label: 'Bio' },
        { id: 'lineage', icon: FaUsers, label: 'Lineage' },
        { id: 'memorial-site', icon: FaMapMarkerAlt, label: 'Memorial Site' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Poppins', sans-serif",
            color: '#4A3E54',
            background: `
                radial-gradient(ellipse 95% 65% at 50% 15%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 252, 243, 0.85) 25%, rgba(246, 235, 253, 0.6) 55%, rgba(226, 204, 240, 0.35) 80%, transparent 100%),
                radial-gradient(ellipse 120% 50% at 50% -5%, rgba(186, 148, 219, 0.38) 0%, rgba(212, 182, 235, 0.25) 45%, transparent 85%),
                radial-gradient(circle 600px at 50% 25%, rgba(255, 248, 225, 0.45) 0%, transparent 70%),
                radial-gradient(circle 750px at 0% 0%, rgba(168, 128, 200, 0.22) 0%, transparent 60%),
                radial-gradient(circle 750px at 100% 0%, rgba(168, 128, 200, 0.22) 0%, transparent 60%),
                radial-gradient(circle 800px at 50% 100%, rgba(195, 160, 222, 0.28) 0%, transparent 70%),
                linear-gradient(180deg, #F3EAFA 0%, #FAF5FD 35%, #F5ECFA 70%, #EAE0F3 100%)
            `
        }}>
            {/* Soft Top Wisteria Arch Sunlight Glow Layer */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '500px',
                backgroundImage: `
                    radial-gradient(circle 200px at 12% 8%, rgba(175, 135, 205, 0.22) 0%, transparent 70%),
                    radial-gradient(circle 240px at 88% 10%, rgba(175, 135, 205, 0.22) 0%, transparent 70%),
                    radial-gradient(ellipse 450px 200px at 50% 0%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 250, 238, 0.55) 50%, transparent 100%)
                `,
                pointerEvents: 'none',
                zIndex: 0
            }} />

            {/* Subtle Watercolor Edge & Corner Overlay Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                backgroundImage: `
                    radial-gradient(circle 450px at 0% 0%, rgba(175, 130, 205, 0.18) 0%, rgba(215, 185, 235, 0.08) 50%, transparent 80%),
                    radial-gradient(circle 450px at 100% 0%, rgba(175, 130, 205, 0.18) 0%, rgba(215, 185, 235, 0.08) 50%, transparent 80%),
                    radial-gradient(circle 500px at 0% 100%, rgba(190, 150, 215, 0.16) 0%, rgba(225, 200, 240, 0.06) 50%, transparent 80%),
                    radial-gradient(circle 500px at 100% 100%, rgba(190, 150, 215, 0.16) 0%, rgba(225, 200, 240, 0.06) 50%, transparent 80%),
                    radial-gradient(ellipse 70% 25% at 50% 0%, rgba(200, 165, 225, 0.14) 0%, transparent 80%),
                    radial-gradient(ellipse 70% 25% at 50% 100%, rgba(200, 165, 225, 0.14) 0%, transparent 80%)
                `,
                filter: 'blur(12px)',
                mixBlendMode: 'multiply'
            }} />

            {/* Floral Corners with soft lavender blend */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '400px',
                height: '400px',
                backgroundImage: `url('/images/floral_corner.jpg')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                mixBlendMode: 'multiply',
                opacity: 0.55,
                zIndex: 0,
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '400px',
                height: '400px',
                backgroundImage: `url('/images/floral_corner.jpg')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                transform: 'scale(-1, -1)',
                mixBlendMode: 'multiply',
                opacity: 0.55,
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Full-Width Hero Banner matching 2nd reference image */}
            <div 
                style={{
                    width: '100%',
                    position: 'relative',
                    minHeight: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: memorial.coverPicture 
                        ? `url('${memorial.coverPicture}')`
                        : `url('/images/floral_corner.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderBottom: '1px solid rgba(220, 205, 225, 0.4)',
                    boxShadow: '0 4px 20px rgba(60, 30, 80, 0.08)',
                    zIndex: 2,
                    padding: '1.75rem 1.5rem'
                }}
            >
                <div style={{
                    maxWidth: '1150px',
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    flexWrap: 'wrap-reverse'
                }}>
                    {/* Center Text Content with soft white shadow backdrop */}
                    <div style={{
                        flex: '1 1 450px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        borderRadius: '20px',
                        padding: '1.25rem 2rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03), 0 1px 4px rgba(255, 255, 255, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        {/* Memorial Name */}
                        <h1 style={{
                            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                            fontSize: '2.5rem',
                            color: '#341A45',
                            margin: '0 0 0.2rem 0',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            lineHeight: 1.2,
                            textShadow: '0 1px 2px rgba(255,255,255,0.9)'
                        }}>
                            {memorial.firstName} {memorial.lastName}
                        </h1>

                        {/* Birth year – death year */}
                        {dateRange && (
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#553C68',
                                letterSpacing: '2px',
                                margin: '0 0 0.5rem 0',
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif"
                            }}>
                                {dateRange}
                            </p>
                        )}

                        {/* Memorial Quote */}
                        {quoteText && (
                            <p style={{
                                fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                                fontSize: '1.5rem',
                                color: '#654278',
                                margin: '0 0 0.75rem 0',
                                lineHeight: 1.3,
                                maxWidth: '580px',
                                textShadow: '0 1px 2px rgba(255,255,255,0.7)'
                            }}>
                                &quot;{quoteText}&quot;
                            </p>
                        )}

                        {/* Hugs and Admin Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.15rem' }}>
                            <button 
                                onClick={onHug}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    padding: '0.5rem 1.2rem',
                                    borderRadius: '50px',
                                    border: '1px solid rgba(160, 120, 180, 0.4)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    color: '#4A2E5B',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
                            >
                                <Image src="/heart_icon.png" width={20} height={20} alt="Hug" style={{ objectFit: 'contain' }} /> 
                                <span>{memorial.hugCount || 0} Hugs</span>
                            </button>
                            {adminControls}
                        </div>
                    </div>

                    {/* Right Side: Creator's Uploaded Profile Picture in Rounded Rectangular Frame */}
                    <div style={{
                        flex: '0 0 auto',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            width: '215px',
                            height: '215px',
                            borderRadius: '18px',
                            border: '5px solid #ffffff',
                            boxShadow: '0 10px 30px rgba(45, 20, 65, 0.22), 0 3px 8px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#f3ebf7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {memorial.profilePicture ? (
                                <img
                                    src={memorial.profilePicture}
                                    alt={`${memorial.firstName} ${memorial.lastName}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #e7d8f2 0%, #d2b8e8 100%)',
                                    color: '#653a85',
                                    fontSize: '4rem',
                                    fontFamily: 'serif',
                                    fontWeight: '600'
                                }}>
                                    {memorial.firstName?.charAt(0)}{memorial.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(220, 205, 225, 0.5)',
                boxShadow: '0 2px 12px rgba(60, 30, 80, 0.04)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div 
                    role="tablist"
                    aria-label="Memorial primary navigation"
                    className="hide-scrollbar"
                    style={{
                        maxWidth: '1150px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '3rem',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                        padding: '0 1rem'
                    }}
                >
                    {mainTabs.map(tab => {
                        const isActive = activeMainTab === tab.id;
                        return (
                            <button 
                                key={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                id={`tab-${tab.id}`}
                                className="memorial-nav-btn"
                                onClick={() => {
                                    setActiveMainTab(tab.id);
                                    if (tab.id === 'life-journey' && !activeSubTab) {
                                        setActiveSubTab('bio');
                                    }
                                }}
                                style={{
                                    background: 'transparent',
                                    color: isActive ? '#341A45' : '#7D6A8D',
                                    border: 'none',
                                    borderBottom: isActive ? '3px solid #8E44AD' : '3px solid transparent',
                                    padding: '1rem 0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: isActive ? '700' : '500',
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {tab.id === 'tribute' ? (
                                    <Image 
                                        src="/heart_icon.png" 
                                        width={16} 
                                        height={16} 
                                        alt="Tribute" 
                                        style={{ 
                                            objectFit: 'contain', 
                                            opacity: isActive ? 1 : 0.6,
                                            filter: isActive ? 'none' : 'grayscale(40%)'
                                        }} 
                                    />
                                ) : (
                                    <tab.icon style={{ fontSize: '0.85rem', color: isActive ? '#8E44AD' : '#9B88AD' }} />
                                )}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 1, padding: '3rem 1rem', maxWidth: '950px', margin: '0 auto' }}>

                {/* Secondary Navigation - Minimal Editorial Style */}
                {activeMainTab === 'life-journey' && (
                    <div 
                        role="tablist"
                        aria-label="Life Journey sub navigation"
                        className="hide-scrollbar"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2.5rem',
                            marginBottom: '2.25rem',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                            paddingBottom: '0.1rem',
                            borderBottom: '1px solid rgba(228, 220, 210, 0.4)',
                            maxWidth: 'max-content',
                            margin: '0 auto 2.25rem auto'
                        }}
                    >
                        {lifeJourneySubTabs.map(subTab => {
                            const isSubActive = activeSubTab === subTab.id;
                            return (
                                <button
                                    key={subTab.id}
                                    role="tab"
                                    aria-selected={isSubActive}
                                    id={`subtab-${subTab.id}`}
                                    className="memorial-nav-btn"
                                    onClick={() => setActiveSubTab(subTab.id)}
                                    style={{
                                        background: 'transparent',
                                        color: isSubActive ? '#2C221E' : '#8C7B70',
                                        border: 'none',
                                        borderBottom: isSubActive ? '2.5px solid #C48F95' : '2.5px solid transparent',
                                        padding: '0.5rem 0.25rem 0.75rem 0.25rem',
                                        fontSize: '0.92rem',
                                        fontWeight: isSubActive ? '600' : '400',
                                        letterSpacing: '0.3px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        whiteSpace: 'nowrap',
                                        position: 'relative'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isSubActive) {
                                            e.currentTarget.style.color = '#5C4A42';
                                            e.currentTarget.style.borderBottomColor = 'rgba(196, 143, 149, 0.4)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isSubActive) {
                                            e.currentTarget.style.color = '#8C7B70';
                                            e.currentTarget.style.borderBottomColor = 'transparent';
                                        }
                                    }}
                                >
                                    <subTab.icon style={{ fontSize: '0.8rem', color: isSubActive ? '#C48F95' : '#A39C95', transition: 'color 200ms ease' }} />
                                    <span>{subTab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Tab Content Area */}
                <div 
                    className="memorial-tab-card"
                    style={{ 
                        backgroundColor: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? 'transparent' 
                            : 'rgba(255, 255, 255, 0.88)', 
                        backdropFilter: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? 'none' 
                            : 'blur(16px)',
                        WebkitBackdropFilter: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? 'none' 
                            : 'blur(16px)',
                        borderRadius: '24px', 
                        padding: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? '0' 
                            : '2.25rem', 
                        border: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? 'none' 
                            : '1.5px solid rgba(228, 210, 242, 0.65)',
                        boxShadow: (activeMainTab === 'life-journey' && activeSubTab === 'lineage') 
                            ? 'none' 
                            : '0 15px 35px rgba(115, 80, 145, 0.06)' 
                    }}
                >
                    <div key={`${activeMainTab}-${activeSubTab}`} className="memorial-tab-pane">
                    
                    {/* LIFE JOURNEY: BIO */}
                    {activeMainTab === 'life-journey' && activeSubTab === 'bio' && (
                        <div>
                            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: '#6e5c53', margin: '0 0 1.5rem 0', fontWeight: 'normal' }}>
                                Biography
                            </h2>
                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#5c544d' }}>
                                {memorial.biography || 'No biography available.'}
                            </p>

                            {(memorial.profession || memorial.website) && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#706862' }}>
                                    {memorial.profession && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FaBriefcase style={{ color: '#88766a' }} />
                                            <span><strong>Profession:</strong> {memorial.profession}</span>
                                        </div>
                                    )}
                                    {memorial.website && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FaGlobe style={{ color: '#88766a' }} />
                                            <span><strong>Website:</strong> <a href={memorial.website} target="_blank" rel="noopener noreferrer" style={{ color: '#88766a', textDecoration: 'underline' }}>{memorial.website}</a></span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {memorial.achievements && (
                                <>
                                    <h3 style={{ marginTop: '2rem', color: '#6e5c53' }}>Achievements</h3>
                                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#5c544d' }}>{memorial.achievements}</p>
                                </>
                            )}

                            {memorial.lifeEvents && memorial.lifeEvents.length > 0 && (
                                <>
                                    <h3 style={{ marginTop: '2.5rem', color: '#6e5c53', marginBottom: '1.5rem' }}>Life Timeline</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '2px solid #e0dad1', paddingLeft: '1.5rem', marginLeft: '1rem' }}>
                                        {memorial.lifeEvents.map((event, i) => (
                                            <div key={i} style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '-1.85rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#c48f95' }} />
                                                <div style={{ fontSize: '0.9rem', color: '#a39c95', fontWeight: '600', marginBottom: '0.25rem' }}>{formatDate(event.date)}</div>
                                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6e5c53' }}>{event.title}</h4>
                                                <p style={{ margin: 0, color: '#5c544d', lineHeight: 1.6 }}>{event.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* LIFE JOURNEY: LINEAGE */}
                    {activeMainTab === 'life-journey' && activeSubTab === 'lineage' && (
                        <div>
                            <FamilyTree familyMembers={memorial.familyMembers || []} memorial={memorial} />
                        </div>
                    )}

                    {/* LIFE JOURNEY: MEMORIAL SITE */}
                    {activeMainTab === 'life-journey' && activeSubTab === 'memorial-site' && (
                        <div>
                            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: '#6e5c53', margin: '0 0 1.5rem 0', fontWeight: 'normal' }}>
                                Memorial Site
                            </h2>
                            {memorial.cemeteryName || memorial.graveLocation ? (
                                <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                    <h3 style={{ color: '#6e5c53', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
                                        <FaMapMarkerAlt style={{ color: '#c48f95' }} /> Resting Place
                                    </h3>
                                    {memorial.cemeteryName && (
                                        <p style={{ margin: '0 0 0.5rem 0', color: '#5c544d', fontSize: '1.1rem' }}>
                                            <strong>Cemetery:</strong> {memorial.cemeteryName}
                                        </p>
                                    )}
                                    {memorial.graveLocation && (
                                        <p style={{ margin: '0 0 1rem 0', color: '#5c544d', fontSize: '1.05rem' }}>
                                            <strong>Location:</strong> {memorial.graveLocation}
                                        </p>
                                    )}
                                    {memorial.latitude && memorial.longitude && (
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${memorial.latitude},${memorial.longitude}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ 
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.75rem 1.5rem',
                                                    backgroundColor: '#88766a',
                                                    color: 'white',
                                                    borderRadius: '50px',
                                                    textDecoration: 'none',
                                                    fontWeight: '500',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <FaMapMarkerAlt /> View Location on Google Maps
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: '#5c544d' }}>No memorial site or resting place details available.</p>
                            )}
                        </div>
                    )}

                    {/* STORIES */}
                    {activeMainTab === 'stories' && (
                        <div>
                            <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: '#6e5c53', margin: '0 0 1.5rem 0', fontWeight: 'normal' }}>
                                Stories & Media
                            </h2>

                            {/* Photo Gallery */}
                            <div style={{ marginBottom: '3.5rem' }}>
                                <h3 style={{ color: '#6e5c53', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem' }}>
                                    <FaImages style={{ color: '#c48f95' }} /> Photo Gallery
                                </h3>
                                {memorial.galleryPhotos && memorial.galleryPhotos.length > 0 ? (
                                    <>
                                        <div className="memorial-gallery-bento">
                                            {memorial.galleryPhotos.map((photo, i) => (
                                                <div 
                                                    key={i} 
                                                    className="bento-gallery-card"
                                                    onClick={() => setPreviewPhoto(photo)}
                                                    title={photo.description || 'Click to view full photo'}
                                                >
                                                    <Image
                                                        src={photo.url}
                                                        alt={photo.description || `Gallery photo ${i + 1}`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        unoptimized
                                                        className="bento-gallery-img"
                                                    />
                                                    <div className="bento-gallery-overlay">
                                                        {photo.description && (
                                                            <p className="bento-gallery-caption">
                                                                {photo.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Photo Lightbox Modal */}
                                        {previewPhoto && (
                                            <Modal 
                                                isOpen={!!previewPhoto} 
                                                onClose={() => setPreviewPhoto(null)} 
                                                title="Photo Memory"
                                            >
                                                <div style={{ textAlign: 'center', padding: '0.5rem 1rem 1.5rem 1rem' }}>
                                                    <div style={{ 
                                                        position: 'relative', 
                                                        width: '100%', 
                                                        maxHeight: '70vh', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        backgroundColor: '#faf7fd'
                                                    }}>
                                                        <img 
                                                            src={previewPhoto.url} 
                                                            alt={previewPhoto.description || 'Memorial Photo'}
                                                            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
                                                        />
                                                    </div>
                                                    {previewPhoto.description && (
                                                        <p style={{ marginTop: '1.25rem', color: '#5c544d', fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.5, margin: '1.25rem 0 0 0' }}>
                                                            &ldquo;{previewPhoto.description}&rdquo;
                                                        </p>
                                                    )}
                                                </div>
                                            </Modal>
                                        )}
                                    </>
                                ) : (
                                    <p style={{ color: '#5c544d', fontStyle: 'italic' }}>No photos in the gallery.</p>
                                )}
                            </div>

                            {/* Videos */}
                            <div>
                                <h3 style={{ color: '#6e5c53', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaVideo style={{ color: '#c48f95' }} /> Video Memories
                                </h3>
                                {memorial.youtubeVideos && memorial.youtubeVideos.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                                        {memorial.youtubeVideos.map((video, i) => (
                                            <div key={i}>
                                                <iframe
                                                    src={video.url.replace('watch?v=', 'embed/')}
                                                    title={video.title}
                                                    frameBorder="0"
                                                    allowFullScreen
                                                    style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                                                />
                                                <h4 style={{ margin: '1rem 0 0.5rem 0', color: '#6e5c53' }}>{video.title}</h4>
                                                {video.description && <p style={{ margin: 0, color: '#5c544d', fontSize: '0.9rem' }}>{video.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#5c544d', fontStyle: 'italic' }}>No videos available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TRIBUTE WALL */}
                    {activeMainTab === 'tribute' && (
                        <TributeWall memorialId={memorial._id} memorialStatus={memorial.status} />
                    )}

                    </div>
                </div>
            </div>
        </div>
    );
}

