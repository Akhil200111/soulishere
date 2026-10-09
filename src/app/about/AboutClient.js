"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
    FaPalette, 
    FaImage, 
    FaVideo, 
    FaFileAlt, 
    FaUsers, 
    FaQrcode, 
    FaInfinity, 
    FaHeart, 
    FaBookOpen, 
    FaRibbon, 
    FaQuoteLeft, 
    FaUserPlus, 
    FaCheck,
    FaArrowRight,
    FaSparkles
} from 'react-icons/fa';
import ParticleBackground from '@/components/ParticleBackground';
import CloudsBackground from '@/components/CloudsBackground';

export default function AboutClient() {
    const purposes = [
        {
            icon: FaInfinity,
            title: 'Preserve Memories',
            description: 'Safeguard precious photos, videos, and life stories in a permanent digital home built to endure for generations.'
        },
        {
            icon: FaRibbon,
            title: 'Honor Loved Ones',
            description: 'Celebrate their unique journey, milestones, and character with elegant, respectful custom tribute pages.'
        },
        {
            icon: FaUsers,
            title: 'Connect Families',
            description: 'Unite relatives and friends across the globe through shared memories, interactive guestbooks, and family trees.'
        },
        {
            icon: FaBookOpen,
            title: 'Keep Stories Alive',
            description: 'Ensure personal histories, wisdom, and anecdotes continue to inspire future generations for years to come.'
        }
    ];

    const platformOffers = [
        {
            icon: FaPalette,
            title: 'Digital Memorials',
            description: 'Custom, elegant memorial websites dedicated to honoring your loved one with beautiful design.'
        },
        {
            icon: FaImage,
            title: 'Photo Galleries',
            description: 'High-resolution photo galleries to display cherished life moments in stunning clarity.'
        },
        {
            icon: FaVideo,
            title: 'Memorial Videos',
            description: 'Seamless YouTube video embedding to share tribute films, favorite songs, and speeches.'
        },
        {
            icon: FaFileAlt,
            title: 'Life Stories',
            description: 'Comprehensive biographies, timelines of key life milestones, and personal achievements.'
        },
        {
            icon: FaUsers,
            title: 'Family Trees',
            description: 'Interactive family trees mapping lineage and relationships across generations.'
        },
        {
            icon: FaQrcode,
            title: 'QR Code Memorials',
            description: 'Scannable QR codes for grave markers, urns, and service programs linking directly to their page.'
        }
    ];

    const howItWorksSteps = [
        {
            step: 1,
            icon: FaUserPlus,
            title: 'Create Memorial',
            description: 'Set up a free account and start crafting a personalized tribute page in minutes.'
        },
        {
            step: 2,
            icon: FaFileAlt,
            title: 'Add Their Story',
            description: 'Write biographical summaries, milestones, and personal achievements.'
        },
        {
            step: 3,
            icon: FaImage,
            title: 'Add Photos & Videos',
            description: 'Upload high-quality photo galleries and embed video tributes.'
        },
        {
            step: 4,
            icon: FaUsers,
            title: 'Connect Family',
            description: 'Document family relationships and invite loved ones to contribute memories.'
        },
        {
            step: 5,
            icon: FaQrcode,
            title: 'Share & Remember',
            description: 'Generate QR codes and share a permanent link with family and friends.'
        }
    ];

    return (
        <div style={{ background: 'white' }}>
            {/* 1. Hero Section */}
            <div style={{
                position: 'relative',
                background: '#faf7fd',
                padding: '12rem 0 8rem 0',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CloudsBackground />
                <ParticleBackground />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>About SoulisHere</span>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    <h1 style={{ fontSize: '4.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                        Preserving Memories. <br />
                        <span style={{ color: '#a276d4' }}>Honoring Lives.</span>
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                        <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    <p style={{ fontSize: '1.25rem', color: '#665e75', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
                        SoulisHere is a dedicated digital memorial platform created to preserve, honor, and share the precious memories, stories, and legacies of loved ones in a permanent space that lasts forever.
                    </p>
                </div>
            </div>

            {/* 2. Our Story */}
            <div style={{ padding: '8rem 0', background: 'white', position: 'relative' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                            <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Our Story</span>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                            A Sanctuary for <span style={{ color: '#a276d4' }}>Cherished Memories</span>
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                            <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>
                    </div>

                    {/* Story Content & Showcase Grid */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '4rem'
                    }}>
                        {/* Text Side */}
                        <div style={{ flex: '1 1 450px' }}>
                            <h3 style={{ fontSize: '2rem', color: '#2d1b4e', fontFamily: 'serif', marginBottom: '1.5rem', fontWeight: '500' }}>
                                Why SoulisHere Was Created
                            </h3>
                            <p style={{ color: '#665e75', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                                Every human life is filled with incredible stories, wisdom, laughter, and love. Yet over time, physical photographs fade, family stories become fragmented, and distance keeps relatives from sharing memories together.
                            </p>
                            <p style={{ color: '#665e75', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                SoulisHere was built to solve this—providing families with an elegant, lasting digital space to preserve photographs, video tributes, biographical milestones, and interactive family trees. We believe honoring those who came before us should be simple, dignified, and accessible to everyone.
                            </p>

                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                flexWrap: 'wrap',
                                marginTop: '2rem'
                            }}>
                                <div style={{
                                    background: '#faf7fd',
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '16px',
                                    border: '1px solid #eedbfa',
                                    flex: '1 1 200px'
                                }}>
                                    <h4 style={{ color: '#815bb5', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Forever</h4>
                                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.9rem' }}>Permanent Digital Legacy</p>
                                </div>
                                <div style={{
                                    background: '#faf7fd',
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '16px',
                                    border: '1px solid #eedbfa',
                                    flex: '1 1 200px'
                                }}>
                                    <h4 style={{ color: '#815bb5', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>Universal</h4>
                                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.9rem' }}>Accessible via QR Code</p>
                                </div>
                            </div>
                        </div>

                        {/* Image Showcase Side */}
                        <div style={{ flex: '1 1 450px', position: 'relative' }}>
                            <div style={{
                                position: 'relative',
                                padding: '2.5rem 1.5rem',
                                borderRadius: '32px',
                                background: 'linear-gradient(135deg, rgba(250, 247, 253, 0.9), rgba(243, 232, 255, 0.6))',
                                border: '1px solid #eedbfa',
                                boxShadow: '0 20px 50px rgba(162, 118, 212, 0.1)',
                                textAlign: 'center'
                            }}>
                                <Image 
                                    src="/images/family.png" 
                                    alt="Family Memories" 
                                    width={600} 
                                    height={400} 
                                    style={{ width: '100%', height: 'auto', borderRadius: '20px', objectFit: 'cover' }} 
                                />
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem 1.5rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <Image src="/heart_icon.png" width={20} height={20} alt="Heart" />
                                    <span style={{ color: '#2d1b4e', fontWeight: '600', fontSize: '0.95rem' }}>Connecting Families Across Generations</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Our Purpose */}
            <div style={{ padding: '8rem 0', background: '#faf7fd', position: 'relative' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                            <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Our Purpose</span>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                            Why SoulisHere <span style={{ color: '#a276d4' }}>Exists</span>
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                            <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                            Guided by compassion and technical elegance, our platform serves four core pillars.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2.5rem'
                    }}>
                        {purposes.map((p, i) => (
                            <div key={i} className="feature-card" style={{
                                background: '#fcfafc',
                                width: 'calc(50% - 1.25rem)',
                                minWidth: '280px',
                                borderRadius: '24px',
                                padding: '2.5rem 2rem',
                                textAlign: 'left',
                                boxShadow: '0 10px 40px rgba(162, 118, 212, 0.08)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(162, 118, 212, 0.05)'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(162, 118, 212, 0.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(162, 118, 212, 0.08)'; }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <p.icon style={{ fontSize: '1.5rem', color: 'white' }} />
                                </div>

                                <h3 style={{ fontSize: '1.35rem', color: '#2d1b4e', marginBottom: '0.75rem', fontWeight: '700', fontFamily: 'serif' }}>{p.title}</h3>

                                <div style={{ width: '25px', height: '2px', background: '#b388eb', marginBottom: '1.25rem' }}></div>

                                <p style={{ color: '#665e75', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>{p.description}</p>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '-15px',
                                    right: '-15px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #d8b4fe 0%, #a276d4 100%)',
                                    borderTopLeftRadius: '100%',
                                    opacity: 0.95
                                }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. What SoulisHere Offers */}
            <div style={{ padding: '8rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                            <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Capabilities</span>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                            What SoulisHere <span style={{ color: '#a276d4' }}>Offers</span>
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                            <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                            A complete suite of features designed for rich, interactive, and respectful memorialization.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2.5rem'
                    }}>
                        {platformOffers.map((item, i) => (
                            <div key={i} className="feature-card" style={{
                                background: '#fcfafc',
                                width: 'calc(33.333% - 1.67rem)',
                                minWidth: '280px',
                                borderRadius: '24px',
                                padding: '2.5rem 2rem',
                                textAlign: 'left',
                                boxShadow: '0 10px 40px rgba(162, 118, 212, 0.08)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(162, 118, 212, 0.05)'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(162, 118, 212, 0.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(162, 118, 212, 0.08)'; }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <item.icon style={{ fontSize: '1.5rem', color: 'white' }} />
                                </div>

                                <h3 style={{ fontSize: '1.25rem', color: '#2d1b4e', marginBottom: '0.75rem', fontWeight: '700', fontFamily: 'serif' }}>{item.title}</h3>

                                <div style={{ width: '25px', height: '2px', background: '#b388eb', marginBottom: '1.25rem' }}></div>

                                <p style={{ color: '#665e75', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{item.description}</p>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '-15px',
                                    right: '-15px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #d8b4fe 0%, #a276d4 100%)',
                                    borderTopLeftRadius: '100%',
                                    opacity: 0.95
                                }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. How SoulisHere Works */}
            <div style={{ padding: '8rem 0', background: '#faf7fd', position: 'relative' }}>
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                            <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Simple Steps</span>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                            How SoulisHere <span style={{ color: '#a276d4' }}>Works</span>
                        </h2>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                            <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                            Creating a beautiful tribute is effortless. Follow these simple steps to build a permanent memory.
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2.5rem'
                    }}>
                        {howItWorksSteps.map((item, i) => (
                            <div key={i} className="feature-card" style={{
                                background: '#fcfafc',
                                flex: '1 1 280px',
                                minWidth: '280px',
                                maxWidth: '380px',
                                borderRadius: '24px',
                                padding: '2.5rem 2rem',
                                textAlign: 'left',
                                boxShadow: '0 10px 40px rgba(162, 118, 212, 0.08)',
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '1px solid rgba(162, 118, 212, 0.05)'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(162, 118, 212, 0.15)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(162, 118, 212, 0.08)'; }}
                            >
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <item.icon style={{ fontSize: '1.5rem', color: 'white' }} />
                                </div>

                                <h3 style={{ fontSize: '1.25rem', color: '#2d1b4e', marginBottom: '0.75rem', fontWeight: '700', fontFamily: 'serif' }}>{item.title}</h3>

                                <div style={{ width: '25px', height: '2px', background: '#b388eb', marginBottom: '1.25rem' }}></div>

                                <p style={{ color: '#665e75', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{item.description}</p>

                                <div style={{
                                    position: 'absolute',
                                    bottom: '-15px',
                                    right: '-15px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #d8b4fe 0%, #a276d4 100%)',
                                    borderTopLeftRadius: '100%',
                                    opacity: 0.95
                                }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Our Vision */}
            <div style={{ padding: '8rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #2d1b4e 0%, #3d2556 60%, #4a2574 100%)',
                        borderRadius: '32px',
                        padding: '5rem 3rem',
                        textAlign: 'center',
                        color: 'white',
                        boxShadow: '0 25px 60px rgba(36, 0, 70, 0.25)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <FaQuoteLeft style={{ fontSize: '3rem', color: 'rgba(216, 180, 254, 0.3)', marginBottom: '1.5rem' }} />

                        <h2 style={{
                            fontSize: '3rem',
                            fontFamily: 'serif',
                            fontWeight: '400',
                            lineHeight: 1.3,
                            marginBottom: '2rem',
                            color: '#f3e8ff',
                            letterSpacing: '-0.5px'
                        }}>
                            &ldquo;Every life leaves a story.<br />
                            Every memory deserves a place to live on.&rdquo;
                        </h2>

                        <div style={{ width: '60px', height: '2px', background: '#a276d4', margin: '0 auto 2rem auto' }}></div>

                        <p style={{
                            fontSize: '1.15rem',
                            color: 'rgba(255, 255, 255, 0.85)',
                            maxWidth: '700px',
                            margin: '0 auto',
                            lineHeight: 1.7
                        }}>
                            We envision a world where no legacy is forgotten. Through thoughtful digital preservation, we empower families to safeguard personal histories, celebrate love, and keep connections alive across generations.
                        </p>

                        {/* Background subtle glow circles */}
                        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(162, 118, 212, 0.15)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
                        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '250px', height: '250px', background: 'rgba(162, 118, 212, 0.15)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
                    </div>
                </div>
            </div>

            {/* 7. Final CTA */}
            <div style={{ padding: '8rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{
                        background: 'linear-gradient(to right, #fdfafc, #f3e8ff)',
                        borderRadius: '32px',
                        padding: '4rem 3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        border: '1px solid #eedbfa',
                        boxShadow: '0 20px 50px rgba(162, 118, 212, 0.1)',
                        position: 'relative',
                        overflow: 'hidden',
                        gap: '2rem'
                    }}>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2 style={{ fontSize: '3rem', marginBottom: '1.25rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', letterSpacing: '-1px', lineHeight: 1.15 }}>
                                Keep Their Memory <br /><span style={{ color: '#a276d4' }}>Close, Always.</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', marginBottom: '2.5rem', color: '#665e75', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                                Start preserving precious memories today. Simple, elegant, and forever preserved.
                            </p>

                            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                <Link href="/auth?mode=signup" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                    color: 'white',
                                    padding: '1.25rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    boxShadow: '0 15px 30px rgba(61, 37, 86, 0.25)',
                                    transition: 'all 0.3s ease'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 37, 86, 0.35)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(61, 37, 86, 0.25)'; }}
                                >
                                    Create a Memorial <span style={{ marginLeft: '0.25rem' }}>→</span>
                                </Link>

                                <Link href="/features" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    background: 'white',
                                    color: '#3d2556',
                                    border: '2px solid #815bb5',
                                    padding: '1.25rem 3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#faf7fd'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    Explore Memorials
                                </Link>
                            </div>
                        </div>

                        {/* Background Blur Accents */}
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'white', filter: 'blur(50px)', opacity: 0.6, borderRadius: '50%', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', background: 'white', filter: 'blur(50px)', opacity: 0.6, borderRadius: '50%', zIndex: 0 }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
