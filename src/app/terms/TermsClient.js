"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    FaFileContract,
    FaUserCheck,
    FaHeart,
    FaCamera,
    FaUsers,
    FaQrcode,
    FaCreditCard,
    FaShieldAlt,
    FaHistory,
    FaLock,
    FaCheckCircle,
    FaInfoCircle,
    FaSearch,
    FaArrowUp,
    FaExclamationCircle,
    FaHandshake,
    FaBalanceScale
} from 'react-icons/fa';
import ParticleBackground from '@/components/ParticleBackground';
import CloudsBackground from '@/components/CloudsBackground';

export default function TermsClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('acceptance');
    const [showBackToTop, setShowBackToTop] = useState(false);

    const sections = [
        { id: 'acceptance', title: '1. Acceptance of Terms', icon: FaHandshake },
        { id: 'user-accounts', title: '2. User Accounts & Security', icon: FaUserCheck },
        { id: 'memorial-creation', title: '3. Memorial Page Creation', icon: FaHeart },
        { id: 'user-content', title: '4. Content & Intellectual Property', icon: FaCamera },
        { id: 'lineage-tributes', title: '5. Family Lineage & Tributes', icon: FaUsers },
        { id: 'qr-codes', title: '6. QR Codes & Physical Markers', icon: FaQrcode },
        { id: 'payments-refunds', title: '7. Payments & Refund Policy', icon: FaCreditCard },
        { id: 'prohibited-activities', title: '8. Prohibited Conduct', icon: FaShieldAlt },
        { id: 'termination', title: '9. Suspension & Termination', icon: FaHistory },
        { id: 'liability', title: '10. Limitations of Liability', icon: FaBalanceScale }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);

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
            {/* 1. Hero Section with Soft Lavender & Peach Theme */}
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
                            Platform Agreement
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
                        Terms of Service
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
                        Guidelines for honoring loved ones, administering digital memorials, preserving family legacies, and fostering a respectful community sanctuary.
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
                        <span>Effective Date: <strong>October 10, 2026</strong></span>
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
                                <FaHeart size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>Solemnity & Respect</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>Every memorial must celebrate life with dignity, truthfulness, and genuine reverence.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ background: '#9D4EDD', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                <FaCamera size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>Family Content Rights</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>You and your family retain full ownership of all uploaded photographs, stories, and videos.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                            <div style={{ background: '#9D4EDD', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                <FaQrcode size={15} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.95rem', color: '#240046', fontWeight: '600' }}>Permanent Preservation</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78', lineHeight: 1.4 }}>Physical QR plaques link seamlessly to lasting digital archives designed to endure across generations.</p>
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
                    className="terms-sidebar"
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
                                    placeholder="Search terms topics..."
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
                                Terms Outline
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
                        <div className="terms-mobile-nav" style={{
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

                            {/* Section 1: Acceptance of Terms */}
                            <section id="acceptance" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaHandshake /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 1</span>
                                        <h2 style={sectionTitleStyle}>Acceptance of Terms</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and <strong>Soulishere</strong> (“Soulishere,” “we,” “us,” or “our”), governing your access to and use of the website at <Link href="/" style={{ color: '#9D4EDD', textDecoration: 'none', fontWeight: '500' }}>soulishere.com</Link>, mobile interfaces, and associated memorial services.
                                </p>
                                <p style={bodyTextStyle}>
                                    By accessing, registering an account, creating a digital memorial tribute, purchasing a physical QR marker plaque, leaving a guestbook condolence, or browsing our platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our <Link href="/privacy" style={{ color: '#9D4EDD', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</Link>.
                                </p>

                                <div style={calloutBoxStyle}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <FaCheckCircle style={{ color: '#9D4EDD', marginTop: '3px', flexShrink: 0, fontSize: '1.1rem' }} />
                                        <div>
                                            <strong style={{ color: '#240046', fontSize: '0.95rem' }}>Eligibility Requirement:</strong>
                                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#574866', lineHeight: 1.5 }}>
                                                You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to establish an account, purchase plans, or administer a memorial. By creating a memorial, you represent that you have the moral, familial, or legal authorization to publish tributes commemorating the deceased individual.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: User Accounts & Security */}
                            <section id="user-accounts" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaUserCheck /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 2</span>
                                        <h2 style={sectionTitleStyle}>User Accounts & Security</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    To create and administer memorial pages, upload photo galleries, or manage family trees, you must register for an account. You agree to provide accurate, truthful, and complete registration information.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>A. Credential Confidentiality</h3>
                                        <p style={bodyTextStyle}>
                                            You are responsible for maintaining the confidentiality of your login credentials, password, and session access. You agree to notify Soulishere immediately of any unauthorized access or security breach involving your account.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>B. Administrator Responsibilities</h3>
                                        <p style={bodyTextStyle}>
                                            As a memorial creator or designated administrator, you hold primary responsibility for managing the tribute’s visibility, moderating guestbook messages, and ensuring all uploaded biographical details comply with our standards of dignity and respect.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Memorial Page Creation & Administration */}
                            <section id="memorial-creation" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaHeart /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 3</span>
                                        <h2 style={sectionTitleStyle}>Memorial Page Creation & Administration</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Soulishere is dedicated to preserving the memory of deceased individuals with solemnity, beauty, and authenticity. Memorial pages may include biographies, milestones, grave locations, photo galleries, embedded videos, and community guestbooks.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={featureBoxStyle}>
                                        <FaCheckCircle style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Truthfulness of Milestones</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Memorial creators must ensure dates of birth and passing, biographical summaries, and burial cemetery locations are accurate and created in good faith.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaQrcode style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Privacy Modes</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Administrators can configure tributes as Public or QR-Restricted. QR-Restricted tributes are protected with unique access keys, shielded from public search engine indexes.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaShieldAlt style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Dispute Resolution</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            In the event of a dispute among family members regarding memorial ownership or biographical accuracy, Soulishere reserves the right to review documentation or temporarily restrict access until family resolution is achieved.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 4: User Content & IP */}
                            <section id="user-content" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaCamera /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 4</span>
                                        <h2 style={sectionTitleStyle}>User-Uploaded Content & Intellectual Property</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    You retain 100% intellectual property ownership of all photographs, life stories, written biographies, and media materials uploaded to Soulishere.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>A. Limited Hosting License</h3>
                                        <p style={bodyTextStyle}>
                                            By uploading content to Soulishere, you grant us a worldwide, non-exclusive, royalty-free, perpetual license solely to host, display, store, reformat, and render your content to fulfill your memorial publishing requests. We will never sell or commercialize your photos to third parties.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>B. Content Ownership Representations</h3>
                                        <p style={bodyTextStyle}>
                                            You represent and warrant that you own or have obtained all necessary copyright permissions, family authorizations, and model releases to upload and publish any photographs, audio recordings, or text included in the memorial.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>C. Digital Millennium Copyright Act (DMCA)</h3>
                                        <p style={bodyTextStyle}>
                                            Soulishere respects copyright laws. If you believe any photograph or content published on our platform infringes upon your copyright, you may notify us with proof of ownership for immediate prompt review and removal.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 5: Family Lineage & Tributes */}
                            <section id="lineage-tributes" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaUsers /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 5</span>
                                        <h2 style={sectionTitleStyle}>Family Lineage, Tributes & Guestbook Conduct</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Our platform features interactive family trees, tribute walls, condolence guestbooks, and virtual hug interactions designed to comfort grieving families.
                                </p>

                                <ul style={listStyle}>
                                    <li><strong>Respectful Expressions:</strong> Condolences, memories, and tribute messages must remain peaceful, supportive, and respectful of the deceased and their family.</li>
                                    <li><strong>Administrator Moderation:</strong> Memorial administrators maintain full authority to approve, unpublish, or delete guestbook entries that they deem inappropriate or unverified.</li>
                                    <li><strong>Family Tree Accuracy:</strong> When mapping ancestry and lineage nodes, users agree not to falsely claim kinship or fabricate relationships intended to harass surviving relatives.</li>
                                </ul>
                            </section>

                            {/* Section 6: QR Codes & Physical Markers */}
                            <section id="qr-codes" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaQrcode /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 6</span>
                                        <h2 style={sectionTitleStyle}>QR Codes & Physical Memorial Markers</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Soulishere generates persistent QR code linkages that connect physical resting places (gravestones, cemetery monuments, columbarium niches, urns, and memorial service cards) directly to the digital tribute page.
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={featureBoxStyle}>
                                        <FaQrcode style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Link Permanence</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            We maintain persistent URL routing ensuring physical QR plaques remain functional and linked to their intended digital memorial archive.
                                        </p>
                                    </div>

                                    <div style={featureBoxStyle}>
                                        <FaShieldAlt style={{ color: '#9D4EDD', marginBottom: '0.5rem', fontSize: '1.2rem' }} />
                                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#240046', fontSize: '0.95rem' }}>Cemetery & Park Regulations</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6A5B78' }}>
                                            Customers are responsible for ensuring physical marker placement complies with all local cemetery, municipal, or memorial park rules and guidelines.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 7: Payments & Refunds */}
                            <section id="payments-refunds" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaCreditCard /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 7</span>
                                        <h2 style={sectionTitleStyle}>Payments, Fees & Refund Policy</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Certain features on Soulishere, such as lifetime memorial publishing, bespoke QR marker plaques, and premium gallery quotas, are subject to one-time or subscription fees.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>A. Payment Processing</h3>
                                        <p style={bodyTextStyle}>
                                            All financial transactions are conducted through certified third-party payment gateways (including Razorpay) using encrypted SSL protocols. Currency amounts and applicable taxes are disclosed at checkout.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>B. Digital Publishing Fulfillment</h3>
                                        <p style={bodyTextStyle}>
                                            Upon successful payment verification, memorial pages are immediately provisioned and published to our cloud infrastructure.
                                        </p>
                                    </div>

                                    <div style={subCardStyle}>
                                        <h3 style={subCardTitleStyle}>C. Refund Guidelines</h3>
                                        <p style={bodyTextStyle}>
                                            <strong>Digital Publishing:</strong> Due to immediate digital delivery, publishing fees are generally non-refundable once the memorial is live, except in instances of verified technical billing errors or duplicate charges reported within 7 days of purchase.
                                        </p>
                                        <p style={bodyTextStyle}>
                                            <strong>Physical QR Plaques:</strong> If a custom engraved plaque arrives damaged or contains a manufacturing defect, notify us with photo verification within 14 days of delivery for a complimentary replacement or full refund.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 8: Prohibited Activities */}
                            <section id="prohibited-activities" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaShieldAlt /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 8</span>
                                        <h2 style={sectionTitleStyle}>Prohibited Activities & Conduct Guidelines</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    To preserve Soulishere as a sanctuary of love, solace, and remembrance, the following conduct is strictly prohibited across all memorial pages:
                                </p>

                                <ul style={listStyle}>
                                    <li><strong>Mockery & Vandalism:</strong> Publishing satirical, defamatory, mocking, or fictitious memorial pages commemorating living individuals without their written consent.</li>
                                    <li><strong>Harassment & Hate Speech:</strong> Posting defamatory remarks, profanity, harassment, or hate speech targeting the deceased, grieving relatives, or other users.</li>
                                    <li><strong>Obscene or Violent Content:</strong> Uploading sexually explicit imagery, graphic violence, or exploitative media.</li>
                                    <li><strong>Commercial Exploitation:</strong> Using memorial pages for unsolicited advertisements, spam links, commercial solicitations, or financial fraud.</li>
                                    <li><strong>Technical Tampering:</strong> Attempting to reverse engineer, scrape, bypass QR access key authorization, or launch denial-of-service attacks against our platform.</li>
                                </ul>

                                <div style={calloutBoxStyle}>
                                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#240046', fontWeight: '500' }}>
                                        Zero Tolerance Policy: Memorial pages found to be created in bad faith or violating these standards are subject to immediate termination without refund.
                                    </p>
                                </div>
                            </section>

                            {/* Section 9: Suspension & Termination */}
                            <section id="termination" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaHistory /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 9</span>
                                        <h2 style={sectionTitleStyle}>Account Suspension & Memorial Termination</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    We maintain fair, respectful protocols regarding memorial lifecycle management and termination:
                                </p>

                                <div style={subCardStyle}>
                                    <h3 style={subCardTitleStyle}>A. Voluntary Deletion</h3>
                                    <p style={bodyTextStyle}>
                                        Memorial creators may request permanent deletion of their memorial at any time through their dashboard settings. Upon deletion, all associated biographies, family tree data, and photo gallery media are irreversibly erased from our production databases.
                                    </p>
                                </div>

                                <div style={{ ...subCardStyle, marginTop: '1rem' }}>
                                    <h3 style={subCardTitleStyle}>B. Involuntary Suspension</h3>
                                    <p style={bodyTextStyle}>
                                        Soulishere reserves the right to suspend or terminate accounts that breach these Terms, violate third-party intellectual property rights, or fail to resolve verified familial ownership disputes.
                                    </p>
                                </div>
                            </section>

                            {/* Section 10: Liability Limitations */}
                            <section id="liability" style={sectionCardStyle}>
                                <div style={sectionHeaderStyle}>
                                    <div style={iconBadgeStyle}><FaBalanceScale /></div>
                                    <div>
                                        <span style={sectionSubTagStyle}>Section 10</span>
                                        <h2 style={sectionTitleStyle}>Limitations of Liability & Disclaimers</h2>
                                    </div>
                                </div>

                                <p style={bodyTextStyle}>
                                    Soulishere is provided on an “as is” and “as available” basis. While we employ resilient cloud infrastructure to maximize platform durability and uptime, we cannot warrant that services will be uninterrupted or error-free at all times.
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <div style={rightsItemStyle}>
                                        <strong>GPS Navigation Disclaimer:</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>
                                            Grave location coordinates provided on memorial pages are entered by administrators for guidance only. Soulishere is not responsible for navigational discrepancies in cemetery terrain.
                                        </p>
                                    </div>

                                    <div style={rightsItemStyle}>
                                        <strong>Indirect Damages Limitation:</strong>
                                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#574866' }}>
                                            To the fullest extent permitted by applicable law, Soulishere shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from user-uploaded content, third-party service outages, or unauthorized third-party access.
                                        </p>
                                    </div>
                                </div>
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
                                    Dedicated to Cherished Memories
                                </h3>
                                <p style={{ maxWidth: '600px', margin: '0 auto 1.5rem auto', color: '#6A5B78', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    Our platform exists to honor every life with care, reverence, and lasting dignity. Thank you for making Soulishere part of your family’s legacy.
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
                    .terms-sidebar {
                        display: none !important;
                    }
                    .terms-mobile-nav {
                        display: flex !important;
                    }
                }
                .terms-mobile-nav::-webkit-scrollbar {
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

const rightsItemStyle = {
    background: '#faf8fc',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    border: '1px solid #f0e4f7',
    color: '#240046',
    fontSize: '0.92rem'
};
