"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    FaShieldAlt, 
    FaLock, 
    FaCamera, 
    FaVideo, 
    FaCookieBite, 
    FaDatabase, 
    FaUserCheck, 
    FaHistory, 
    FaEnvelope,
    FaQrcode, 
    FaHeart, 
    FaCheckCircle, 
    FaInfoCircle, 
    FaSearch, 
    FaArrowUp, 
    FaFileContract, 
    FaExclamationCircle,
    FaCreditCard,
    FaGlobeAmericas,
    FaChild
} from 'react-icons/fa';
import ParticleBackground from '@/components/ParticleBackground';
import CloudsBackground from '@/components/CloudsBackground';

export default function PrivacyClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('intro');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const sections = [
        { id: 'intro', title: '1. Introduction & Our Promise', icon: FaHeart },
        { id: 'information-collected', title: '2. Information We Collect', icon: FaDatabase },
        { id: 'how-we-use-data', title: '3. How We Use Your Data', icon: FaFileContract },
        { id: 'media-privacy', title: '4. Photo & Video Privacy', icon: FaCamera },
        { id: 'cookies-tracking', title: '5. Cookies & Local Storage', icon: FaCookieBite },
        { id: 'data-security', title: '6. Data Security & Storage', icon: FaLock },
        { id: 'third-parties', title: '7. Third-Party Services', icon: FaGlobeAmericas },
        { id: 'user-rights', title: '8. Your Rights & Choices', icon: FaUserCheck },
        { id: 'data-retention', title: '9. Data Retention & Deletion', icon: FaHistory },
        { id: 'children-privacy', title: '10. Children’s Privacy', icon: FaChild }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);

            // Update active section based on scroll position
            const scrollPosition = window.scrollY + 200;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredSections = searchQuery.trim() === '' 
        ? sections 
        : sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={{ background: '#fdfbfd', minHeight: '100vh', color: '#3d2b4e' }}>
            {/* 1. Hero Section with Soft Lavender Theme */}
            <div style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #faf7fd 0%, #f7effd 100%)',
                padding: '11rem 0 6rem 0',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid #eedbfa'
            }}>
                <CloudsBackground />
                <ParticleBackground />

                <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
                    {/* Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        <span style={{ 
                            color: '#9D4EDD', 
                            fontWeight: '700', 
                            letterSpacing: '2.5px', 
                            fontSize: '0.82rem', 
                            textTransform: 'uppercase',
                            background: 'rgba(157, 78, 221, 0.08)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid rgba(157, 78, 221, 0.2)'
                        }}>
                            Privacy & Transparency
                        </span>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    {/* Title */}
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', 
                        color: '#240046', 
                        fontWeight: '500', 
                        fontFamily: "'Playfair Display', Georgia, serif", 
                        lineHeight: 1.15, 
                        marginBottom: '1.25rem' 
                    }}>
                        Privacy Policy
                    </h1>

                    {/* Divider with Heart */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ width: '35px', height: '1px', background: '#d5c4e3' }}></div>
                        <Image src="/heart_icon.png" width={20} height={20} alt="Heart" style={{ objectFit: 'contain' }} />
                        <div style={{ width: '35px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    {/* Subtitle */}
                    <p style={{ 
                        fontSize: '1.15rem', 
                        color: '#6A5B78', 
                        maxWidth: '680px', 
                        margin: '0 auto 1.5rem auto', 
                        lineHeight: 1.6 
                    }}>
                        Safeguarding your sacred memories, protecting family legacies, and honoring your trust with uncompromised privacy.
                    </p>

                    {/* Metadata Pill */}
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: 'rgba(255, 255, 255, 0.75)', 
                        backdropFilter: 'blur(8px)',
                        padding: '6px 16px', 
                        borderRadius: '30px', 
                        fontSize: '0.85rem', 
                        color: '#7a6690',
                        border: '1px solid rgba(181, 168, 196, 0.3)'
                    }}>
                        <span>Last Updated: <strong>October 10, 2026</strong></span>
                        <span>•</span>
                        <span>Version 2.0</span>
                    </div>
                </div>
            </div>

            {/* Quick Summary Highlights Banner */}
            <div style={{ background: '#f5edf8', borderBottom: '1px solid #e7d8f2', padding: '1.75rem 0' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1.25rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ background: '#9D4EDD', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                <FaShieldAlt size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>No Data Selling</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>We never sell or monetize your family photos, stories, or personal details to third-party advertisers.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ background: '#9D4EDD', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                <FaLock size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>Privacy Controls</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>Control visibility with public memorials or protected QR-only access restricted to family members.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ background: '#9D4EDD', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                <FaUserCheck size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>Full Family Ownership</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>You retain 100% intellectual property and control to update, export, or delete memorial content anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout with Sticky Sidebar */}
            <div className="container" style={{ maxWidth: '1180px', padding: '3.5rem 1.5rem 6rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

                    {/* Desktop Sidebar: Navigation & Search */}
                    <aside style={{
                        width: '310px',
                        flexShrink: 0,
                        position: 'sticky',
                        top: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}
                    className="privacy-sidebar"
                    >
                        {/* Search Input */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '1rem',
                            border: '1px solid #eedbfa',
                            boxShadow: '0 4px 20px rgba(157, 78, 221, 0.05)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#faf7fd',
                                border: '1px solid #e3d5ee',
                                borderRadius: '10px',
                                padding: '0.6rem 0.85rem'
                            }}>
                                <FaSearch style={{ color: '#9D4EDD', fontSize: '0.85rem' }} />
                                <input
                                    type="text"
                                    placeholder="Search privacy topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none',
                                        width: '100%',
                                        fontSize: '0.85rem',
                                        color: '#240046'
                                    }}
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        style={{ border: 'none', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Navigation Table of Contents */}
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            border: '1px solid #eedbfa',
                            boxShadow: '0 4px 20px rgba(157, 78, 221, 0.05)'
                        }}>
                            <h3 style={{ 
                                fontSize: '0.9rem', 
                                color: '#6A5B78', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1.5px', 
                                fontWeight: '700', 
                                margin: '0 0 1rem 0' 
                            }}>
                                Table of Contents
                            </h3>

                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {filteredSections.map((sec) => {
                                    const Icon = sec.icon;
                                    const isActive = activeSection === sec.id;
                                    return (
                                        <button
                                            key={sec.id}
                                            onClick={() => scrollToSection(sec.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.65rem',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: isActive ? '#f4eafb' : 'transparent',
                                                color: isActive ? '#9D4EDD' : '#574866',
                                                fontWeight: isActive ? '600' : '400',
                                                fontSize: '0.86rem',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                width: '100%',
                                                transition: 'all 0.2s ease',
                                                borderLeft: isActive ? '3px solid #9D4EDD' : '3px solid transparent'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = '#faf7fd';
                                                    e.currentTarget.style.color = '#240046';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = '#574866';
                                                }
                                            }}
                                        >
                                            <Icon style={{ flexShrink: 0, fontSize: '0.9rem', color: isActive ? '#9D4EDD' : '#b5a8c4' }} />
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {sec.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Sections */}
                    <main style={{ flex: 1, minWidth: 0 }}>
                        {/* Mobile Quick Jump Bar */}
                        <div className="privacy-mobile-nav" style={{
                            display: 'none',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                            paddingBottom: '0.85rem',
                            marginBottom: '1.5rem',
                            gap: '0.5rem',
                            scrollbarWidth: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}>
                            {sections.map((sec) => {
                                const Icon = sec.icon;
                                const isActive = activeSection === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        onClick={() => scrollToSection(sec.id)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 14px',
                                            borderRadius: '20px',
                                            border: '1px solid',
                                            borderColor: isActive ? '#9D4EDD' : '#eedbfa',
                                            background: isActive ? '#9D4EDD' : '#ffffff',
                                            color: isActive ? '#ffffff' : '#574866',
                                            fontSize: '0.82rem',
                                            fontWeight: isActive ? '600' : '500',
                                            cursor: 'pointer',
                                            flexShrink: 0,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                        }}
                                    >
                                        <Icon size={12} />
                                        <span>{sec.title.split('. ')[1] || sec.title}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                            {/* Section 1: Introduction */}
                            <section id="intro" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaHeart /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 1</span>
                                        <h2 style={sectionTitleStyle}>Introduction & Our Sacred Promise</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Welcome to <strong>Soulishere</strong> (“Soulishere,” “we,” “our,” or “us”). Soulishere is a compassionate digital memorial platform designed to honor departed loved ones, preserve life stories, unite families, and safeguard memories for generations to come.
                                </p>
                                <p style={bodyTextStyle}>
                                    We recognize that memorial platforms hold profoundly intimate, tender, and irreplaceable family history. We treat the photos, dates, biographies, family relationships, condolences, and stories entrusted to us not as commercial assets, but as a sacred trust.
                                </p>

                                <div style={calloutBoxStyle}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <FaCheckCircle style={{ color: '#9D4EDD', marginTop: '3px', flexShrink: 0, fontSize: '1.1rem' }} />
                                        <div>
                                            <strong style={{ color: '#240046', fontSize: '0.95rem' }}>Our Foundational Privacy Guarantee:</strong>
                                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#574866', lineHeight: 1.5 }}>
                                                We do not sell, rent, license, or barter any personal data, deceased individual information, or memorial content to data brokers or third-party advertising companies. Your family’s sacred space remains tranquil, respectful, and protected.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Information We Collect */}
                            <section id="information-collected" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaDatabase /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 2</span>
                                        <h2 style={sectionTitleStyle}>Information We Collect</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    To provide our memorial services, create tribute sites, generate scannable QR codes, and allow community condolences, we collect the following categories of information:
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                                    {/* Account Data */}
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>A. Account Creator & Administrator Information</h3>
                                        <p style={bodyTextStyle}>
                                            When you register an account to create or administer a memorial, we collect your name, email address, hashed credentials, and optional profile details. If you register via third-party authentication (such as Google OAuth), we receive your verified profile identifier and email.
                                        </p>
                                    </div>

                                    {/* Memorial Data */}
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>B. Memorial & Loved One Tribute Data</h3>
                                        <p style={bodyTextStyle}>
                                            Information provided to construct the memorial page, which may include:
                                        </p>
                                        <ul style={listStyle}>
                                            <li>Full name of the departed loved one and relationship to the memorial creator.</li>
                                            <li>Important life milestones (date of birth, date of passing).</li>
                                            <li>Life story, biography, profession, personal quotes, achievements, and eulogies.</li>
                                            <li>Resting place details: cemetery or memorial park name, grave plot address, and GPS coordinates (latitude/longitude) for grave navigation.</li>
                                            <li>Family tree connections: lineage nodes, relationships (parents, spouses, children), and family memories.</li>
                                        </ul>
                                    </div>

                                    {/* Visitor Contributions */}
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>C. Community Contributions & Guestbook Entries</h3>
                                        <p style={bodyTextStyle}>
                                            When friends, relatives, or service attendees interact with a memorial, we collect visitor names, email addresses (for moderation and authentication), condolence messages, tribute thoughts, virtual hugs, and guestbook replies.
                                        </p>
                                    </div>

                                    {/* Transaction Data */}
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>D. Payment & Subscription Transactions</h3>
                                        <p style={bodyTextStyle}>
                                            When you purchase a memorial publishing plan or custom QR plaque, transactions are routed directly through accredited, PCI-DSS certified payment processors (e.g., Razorpay). <strong>Soulishere never receives, processes, or stores your full credit card number or bank account PINs on our servers.</strong> We retain only transactional confirmation tokens, payment IDs, and billing receipts.
                                        </p>
                                    </div>

                                    {/* Technical & QR Data */}
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>E. Technical Data & QR Code Access</h3>
                                        <p style={bodyTextStyle}>
                                            For security and performance, our servers automatically log technical diagnostics such as device browser types, operating systems, IP addresses, timestamped visit requests, and QR-access tokens passed when visitors scan physical memorial plaques or QR cards.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: How We Use Data */}
                            <section id="how-we-use-data" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaFileContract /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 3</span>
                                        <h2 style={sectionTitleStyle}>How We Use Your Information</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    We use the information collected solely for clear, legitimate, and compassionate purposes in operating Soulishere:
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={featureBoxStyle}>
                                        <FaHeart style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Memorial Presentation</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Hosting, rendering, and preserving custom digital memorial pages, photo galleries, video memories, and interactive family trees.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaQrcode style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Physical-to-Digital Connection</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Generating permanent QR codes linked to gravestones, urn markers, headstones, and memorial service cards.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaShieldAlt style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Moderation & Security</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Preventing spam, moderating condolence messages, preventing vandalism, and verifying administrative access rights.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaEnvelope style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Service Communication</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Notifying memorial creators of new tributes, condolence entries, payment receipts, or important platform updates.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: Photo & Video Privacy */}
                            <section id="media-privacy" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaCamera /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 4</span>
                                        <h2 style={sectionTitleStyle}>Photo, Video & Media Privacy</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Photographs and tribute films are among the most treasured elements of any memorial. We apply deliberate privacy and security controls to all media uploaded or linked on Soulishere:
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                                    <div style={subCardStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                                            <FaCamera style={{ color: '#9D4EDD' }} />
                                            <h3 style={subCardTitleStyle}>Photo Storage & Cloudinary Encryption</h3>
                                        </div>
                                        <p style={bodyTextStyle}>
                                            Family photographs uploaded to memorial galleries are securely transferred using TLS encryption and hosted on enterprise-grade cloud media infrastructure (Cloudinary). Images are delivered over secure HTTPS and are never made accessible to public stock libraries or marketing campaigns.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                                            <FaVideo style={{ color: '#9D4EDD' }} />
                                            <h3 style={subCardTitleStyle}>YouTube Video Memories & Privacy Protection</h3>
                                        </div>
                                        <p style={bodyTextStyle}>
                                            When you link a YouTube tribute video to a memorial, the video is rendered using privacy-enhanced domain standards (<code style={{ background: '#f4eafb', padding: '2px 6px', borderRadius: '4px', color: '#240046' }}>youtube-nocookie.com</code>). 
                                        </p>
                                        <p style={bodyTextStyle}>
                                            Furthermore, our custom memorial player hides third-party YouTube branding, sharing links, watch-later icons, and end-screen video recommendations to ensure the memorial remains intimate, reverent, and free of distracting external YouTube algorithms.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                                            <FaQrcode style={{ color: '#9D4EDD' }} />
                                            <h3 style={subCardTitleStyle}>Public vs. QR-Restricted Privacy Modes</h3>
                                        </div>
                                        <p style={bodyTextStyle}>
                                            Soulishere empowers families to choose their memorial visibility:
                                        </p>
                                        <ul style={listStyle}>
                                            <li><strong>Public Memorials:</strong> Accessible to anyone with the web link; perfect for large family circles, military veterans, and public tributes.</li>
                                            <li><strong>QR-Restricted Memorials:</strong> Protected by cryptographic access tokens (<code style={{ background: '#f4eafb', padding: '2px 6px', borderRadius: '4px', color: '#240046' }}>qrAccessKey</code>). These pages can only be viewed by scanning the official physical QR plaque or using an authorized family access link, shielding the page from search engine crawlers and random web visitors.</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Cookies & Local Storage */}
                            <section id="cookies-tracking" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaCookieBite /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 5</span>
                                        <h2 style={sectionTitleStyle}>Cookies & Local Storage</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    We use minimal, privacy-centric cookies and browser storage technologies strictly necessary to deliver a seamless and respectful user experience:
                                </p>

                                <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                                    <table style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        fontSize: '0.88rem',
                                        textAlign: 'left'
                                    }}>
                                        <thead>
                                            <tr style={{ background: '#f7effd', borderBottom: '2px solid #e2d1f0' }}>
                                                <th style={{ padding: '10px 14px', color: '#240046' }}>Category</th>
                                                <th style={{ padding: '10px 14px', color: '#240046' }}>Purpose</th>
                                                <th style={{ padding: '10px 14px', color: '#240046' }}>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #eedbfa' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: '600', color: '#240046' }}>Essential Authentication</td>
                                                <td style={{ padding: '12px 14px', color: '#574866' }}>Secure JWT session cookies keeping logged-in administrators safely authenticated while editing memorials.</td>
                                                <td style={{ padding: '12px 14px', color: '#7a6690' }}>Session / 30 Days</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #eedbfa' }}>
                                                <td style={{ padding: '12px 14px', fontWeight: '600', color: '#240046' }}>QR Access Tokens</td>
                                                <td style={{ padding: '12px 14px', color: '#574866' }}>Browser sessionStorage & localStorage tokens validating that a visitor has scanned an authorized QR code key.</td>
                                                <td style={{ padding: '12px 14px', color: '#7a6690' }}>Browser Session</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '12px 14px', fontWeight: '600', color: '#240046' }}>Functional Preferences</td>
                                                <td style={{ padding: '12px 14px', color: '#574866' }}>Retains user preferences such as memorial tab selection, audio volume level, and lightbox states.</td>
                                                <td style={{ padding: '12px 14px', color: '#7a6690' }}>Persistent</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p style={{ ...bodyTextStyle, marginTop: '1.25rem' }}>
                                    <strong>No Third-Party Advertising Cookies:</strong> We do not deploy third-party advertising cookies, retargeting pixels (such as Facebook Pixel), or behavioral advertising tracking. You may disable cookies via your browser settings, though doing so may limit administrative dashboard functionality.
                                </p>
                            </section>

                            {/* Section 6: Data Security */}
                            <section id="data-security" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaLock /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 6</span>
                                        <h2 style={sectionTitleStyle}>Data Security & Safeguards</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    We employ robust, industry-standard technical, administrative, and physical safeguards to protect all memorial archives:
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={securityBadgeStyle}>
                                        <FaLock style={{ color: '#9D4EDD', fontSize: '1.3rem' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#240046', fontSize: '0.92rem' }}>TLS/SSL 256-Bit Encryption</h4>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6A5B78' }}>All network traffic between your device and Soulishere is strictly encrypted in transit.</p>
                                        </div>
                                    </div>

                                    <div style={securityBadgeStyle}>
                                        <FaDatabase style={{ color: '#9D4EDD', fontSize: '1.3rem' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#240046', fontSize: '0.92rem' }}>Encrypted Cloud Database</h4>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6A5B78' }}>Database storage is protected via MongoDB Atlas with encrypted volume storage and strict access firewalls.</p>
                                        </div>
                                    </div>

                                    <div style={securityBadgeStyle}>
                                        <FaUserCheck style={{ color: '#9D4EDD', fontSize: '1.3rem' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#240046', fontSize: '0.92rem' }}>Role-Based Access Control</h4>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6A5B78' }}>Only verified memorial creators and authorized family admins can edit or delete tribute content.</p>
                                        </div>
                                    </div>

                                    <div style={securityBadgeStyle}>
                                        <FaHistory style={{ color: '#9D4EDD', fontSize: '1.3rem' }} />
                                        <div>
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#240046', fontSize: '0.92rem' }}>Automated Redundancy</h4>
                                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#6A5B78' }}>Regular automated cloud backups ensure that treasured life records are preserved against hardware failures.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Third-Party Services */}
                            <section id="third-parties" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaGlobeAmericas /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 7</span>
                                        <h2 style={sectionTitleStyle}>Third-Party Services & Processors</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    To provide high-reliability infrastructure, Soulishere coordinates with selected, trustworthy service providers under strict data-protection agreements:
                                </p>

                                <ul style={listStyle}>
                                    <li><strong>Cloudinary:</strong> For secure image optimization, delivery, and media asset storage.</li>
                                    <li><strong>Razorpay:</strong> For PCI-DSS certified checkout, order processing, and receipt generation.</li>
                                    <li><strong>YouTube / Google APIs:</strong> For embedding video eulogies and tribute recordings via privacy-enhanced endpoints.</li>
                                    <li><strong>MongoDB Atlas:</strong> Secure cloud database cluster hosting with high availability and disaster recovery.</li>
                                </ul>

                                <p style={bodyTextStyle}>
                                    These service providers are prohibited from utilizing personal data for any purpose other than providing specified infrastructural services to Soulishere.
                                </p>
                            </section>

                            {/* Section 8: User Rights */}
                            <section id="user-rights" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaUserCheck /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 8</span>
                                        <h2 style={sectionTitleStyle}>Your Rights & Choices (GDPR & Global)</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Regardless of your geographical location, Soulishere extends comprehensive data privacy rights consistent with global frameworks (including GDPR, CCPA/CPRA, and Indian Digital Personal Data Protection Act):
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={rightsItemStyle}>
                                        <strong>Right of Access & Portability</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>You can request a complete copy of all personal and memorial data stored on your account.</p>
                                    </div>
                                    <div style={rightsItemStyle}>
                                        <strong>Right to Rectification</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>You can edit, modify, or update biographies, dates, photos, and stories at any time directly in your dashboard.</p>
                                    </div>
                                    <div style={rightsItemStyle}>
                                        <strong>Right to Erasure ("Right to Be Forgotten")</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>You may request complete and permanent deletion of your account and any associated memorials.</p>
                                    </div>
                                    <div style={rightsItemStyle}>
                                        <strong>Right to Restrict or Make Private</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>You can switch a memorial from public access to QR-restricted access at any point.</p>
                                    </div>
                                </div>

                                <div style={{ ...calloutBoxStyle, marginTop: '1.25rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#3d2556' }}>
                                        To exercise any of these rights, you can manage, update, or request deletion of memorial records directly through your account dashboard and memorial settings.
                                    </p>
                                </div>
                            </section>

                            {/* Section 9: Data Retention & Deletion */}
                            <section id="data-retention" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaHistory /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 9</span>
                                        <h2 style={sectionTitleStyle}>Data Retention & Legacy Preservation</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    The unique mission of a digital memorial platform is **permanence** — ensuring that a person’s memory, laughter, wisdom, and lineage remain preserved for their great-grandchildren and future descendants.
                                </p>

                                <div style={subCardStyle}>
                                    <h3 style={subCardTitleStyle}>Permanent Memorial Preservation</h3>
                                    <p style={bodyTextStyle}>
                                        Published memorials remain preserved indefinitely on the platform unless the verified memorial creator or authorized family administrator explicitly requests removal. Even if an account creator is inactive, the tribute remains accessible to loved ones who scan the physical QR plaque.
                                    </p>
                                </div>

                                <div style={{ ...subCardStyle, marginTop: '1rem' }}>
                                    <h3 style={subCardTitleStyle}>Permanent Deletion Protocol</h3>
                                    <p style={bodyTextStyle}>
                                        If a memorial creator or legally verified family representative requests deletion:
                                    </p>
                                    <ul style={listStyle}>
                                        <li>All memorial biographical text, family tree connections, and guestbook entries are permanently purged from active production databases.</li>
                                        <li>All associated uploaded photos in cloud storage are permanently erased.</li>
                                        <li>The QR code link is permanently deactivated, displaying a respectful notice that the memorial has concluded.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 10: Children's Privacy */}
                            <section id="children-privacy" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaChild /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 10</span>
                                        <h2 style={sectionTitleStyle}>Children’s Privacy</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Our platform is not directed to children under 13 years of age (or under 16 in certain jurisdictions), and we do not knowingly permit children to register accounts. Memorial pages commemorating children who have tragically passed away may only be established and administered by their parents, legal guardians, or authorized adult family members.
                                </p>
                                <p style={bodyTextStyle}>
                                    If we learn that an account was created by a minor without parental consent, we will promptly deactivate the account and handle associated records with utmost parental coordination.
                                </p>
                            </section>

                            {/* Warm Closing Reassurance */}
                            <div style={{
                                background: '#ffffff',
                                borderRadius: '20px',
                                padding: '2.5rem 2rem',
                                border: '1px solid #eedbfa',
                                textAlign: 'center',
                                boxShadow: '0 8px 30px rgba(157, 78, 221, 0.06)'
                            }}>
                                <Image 
                                    src="/heart_icon.png" 
                                    width={28} 
                                    height={28} 
                                    alt="Memorial Heart" 
                                    style={{ objectFit: 'contain', margin: '0 auto 1rem auto' }} 
                                />
                                <h3 style={{ 
                                    fontFamily: "'Playfair Display', serif", 
                                    fontSize: '1.6rem', 
                                    color: '#240046', 
                                    margin: '0 0 0.75rem 0' 
                                }}>
                                    A Sacred Place to Remember
                                </h3>
                                <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: '#6A5B78', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    Thank you for trusting Soulishere to safeguard your family’s most precious stories. We remain committed to keeping this platform peaceful, private, and forever respectful.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <Link 
                                        href="/about"
                                        style={{
                                            background: '#faf7fd',
                                            color: '#9D4EDD',
                                            border: '1px solid #eedbfa',
                                            padding: '10px 22px',
                                            borderRadius: '30px',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#9D4EDD'; e.currentTarget.style.color = '#ffffff'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#faf7fd'; e.currentTarget.style.color = '#9D4EDD'; }}
                                    >
                                        About Soulishere
                                    </Link>
                                    <Link 
                                        href="/auth?mode=signup"
                                        style={{
                                            background: '#240046',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '10px 22px',
                                            borderRadius: '30px',
                                            textDecoration: 'none',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            transition: 'background 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#9D4EDD'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#240046'}
                                    >
                                        Create a Memorial
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </main>
                </div>
            </div>

            {/* Floating Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: '#240046',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(36, 0, 70, 0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#9D4EDD'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#240046'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <FaArrowUp size={16} />
                </button>
            )}

            {/* Custom Responsive Styles for Mobile */}
            <style jsx global>{`
                @media (max-width: 900px) {
                    .privacy-sidebar {
                        display: none !important;
                    }
                    .privacy-mobile-nav {
                        display: flex !important;
                    }
                }
                .privacy-mobile-nav::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}

// Styling Constants
const sectionCardStyle = {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    border: '1px solid #eedbfa',
    boxShadow: '0 4px 20px rgba(157, 78, 221, 0.04)',
    scrollMarginTop: '110px'
};

const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem'
};

const iconBadgeStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f4eafb 0%, #ecd6fa 100%)',
    color: '#9D4EDD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0,
    border: '1px solid #e5d1f5'
};

const sectionSubTagStyle = {
    fontSize: '0.75rem',
    color: '#9D4EDD',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontWeight: '700',
    display: 'block',
    marginBottom: '2px'
};

const sectionTitleStyle = {
    fontSize: '1.5rem',
    color: '#240046',
    fontWeight: '600',
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: 0
};

const bodyTextStyle = {
    fontSize: '0.96rem',
    color: '#574866',
    lineHeight: 1.7,
    margin: '0 0 1rem 0'
};

const calloutBoxStyle = {
    background: '#faf6fd',
    border: '1px solid #e7d6f5',
    borderRadius: '14px',
    padding: '1.25rem 1.5rem',
    marginTop: '1.25rem'
};

const subCardStyle = {
    background: '#faf8fc',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid #f0e4f7'
};

const subCardTitleStyle = {
    fontSize: '1.05rem',
    color: '#240046',
    fontWeight: '600',
    margin: '0 0 0.5rem 0'
};

const listStyle = {
    paddingLeft: '1.25rem',
    margin: '0.5rem 0 0.75rem 0',
    color: '#574866',
    fontSize: '0.93rem',
    lineHeight: 1.6
};

const featureBoxStyle = {
    background: '#faf8fc',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid #f0e4f7'
};

const securityBadgeStyle = {
    background: '#faf8fc',
    borderRadius: '12px',
    padding: '1rem',
    border: '1px solid #f0e4f7',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem'
};

const rightsItemStyle = {
    background: '#faf8fc',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    border: '1px solid #f0e4f7',
    color: '#240046',
    fontSize: '0.92rem'
};
