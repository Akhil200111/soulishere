"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaPalette, FaMousePointer, FaShareAlt, FaComments, FaInfinity, FaQrcode, FaUsers, FaClock, FaCheck, FaCommentDots } from 'react-icons/fa';
import ParticleBackground from '@/components/ParticleBackground';
import CloudsBackground from '@/components/CloudsBackground';

export default function Features() {
    const features = [
        { icon: FaPalette, title: 'Beautiful Design', description: "Professional, elegant memorial pages that celebrate your loved one's unique story with stunning visuals." },
        { icon: FaMousePointer, title: 'Easy to Create', description: 'Simple step-by-step process - no technical skills needed. Create a memorial in minutes.' },
        { icon: FaShareAlt, title: 'Share Instantly', description: 'Generate QR codes and share with one link. Perfect for memorial services and family gatherings.' },
        { icon: FaComments, title: 'Guest Book', description: 'Invite friends and family to leave condolences, share memories, and celebrate together.' },
        { icon: FaInfinity, title: 'Forever Preserved', description: 'Your memorial lives forever on our platform. A lasting digital tribute.' },
        { icon: FaQrcode, title: 'QR Code Generation', description: 'Unique QR codes for each memorial that can be printed and displayed.' },
        { icon: FaUsers, title: 'Family Tree', description: 'Document family relationships and connections beautifully.' },
        { icon: FaClock, title: 'Life Timeline', description: 'Create an interactive timeline of life events and milestones.' }
    ];

    return (
        <div style={{ background: 'white' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                background: '#faf7fd', // Using the very light purple background
                padding: '12rem 0 8rem 0',
                textAlign: 'center',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Background Effects matching Home Page */}
                <CloudsBackground />
                <ParticleBackground />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                        <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Features</span>
                        <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                        <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    <h1 style={{ fontSize: '4.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                        Celebrate their life with <br/>
                        <span style={{ color: '#a276d4' }}>Beautiful Features</span>
                    </h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                        <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                    </div>

                    <p style={{ fontSize: '1.25rem', color: '#665e75', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        Everything you need to create a beautiful, lasting tribute.<br/>
                        A simple, elegant way to preserve their legacy forever.
                    </p>
                </div>
            </div>

            {/* Features Grid (Using Home Page Card Style) */}
            <div style={{ padding: '8rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '1100px' }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '2.5rem'
                    }}>
                        {features.map((f, i) => (
                            <div key={i} className="feature-card" style={{
                                background: '#fcfafc',
                                width: 'calc(33.333% - 1.67rem)', // 3 columns for desktop
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
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(162, 118, 212, 0.15)'; e.currentTarget.style.transition = 'all 0.3s ease'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(162, 118, 212, 0.08)'; e.currentTarget.style.transition = 'all 0.3s ease'; }}
                            >
                                {/* Top Right Star */}
                                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#b388eb', fontSize: '1.2rem' }}></div>

                                {/* Icon Container */}
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
                                    <f.icon style={{ fontSize: '1.5rem', color: 'white' }} />
                                </div>
                                
                                <h3 style={{ fontSize: '1.25rem', color: '#2d1b4e', marginBottom: '0.75rem', fontWeight: '700', fontFamily: 'serif' }}>{f.title}</h3>
                                
                                {/* Separator Line */}
                                <div style={{ width: '25px', height: '2px', background: '#b388eb', marginBottom: '1.25rem' }}></div>
                                
                                <p style={{ color: '#665e75', lineHeight: 1.6, margin: 0, fontSize: '0.9rem' }}>{f.description}</p>

                                {/* Bottom Right Swoosh */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-15px',
                                    right: '-15px',
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #d8b4fe 0%, #a276d4 100%)',
                                    borderTopLeftRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingTop: '20px',
                                    paddingLeft: '20px',
                                    opacity: 0.95
                                }}>
                                    <span style={{ color: 'white', fontSize: '0.8rem', marginBottom: '10px', marginLeft: '10px' }}></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* What's Included */}
            <div style={{ padding: '8rem 0', background: '#faf7fd', position: 'relative' }}>
                <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                            <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                            <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>All Inclusive</span>
                            <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                            <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>
                        
                        <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                            What&apos;s <span style={{ color: '#a276d4' }}>Included</span>
                        </h2>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                            <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                            <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
                        </div>

                        <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            A comprehensive suite of tools designed to build the<br/>perfect digital memorial.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                        {[
                            {
                                title: 'Profile & Media',
                                items: ['Profile & cover photos', 'Photo gallery', 'YouTube video embedding', 'Biography section']
                            },
                            {
                                title: 'Life Story',
                                items: ['Life summary', 'Achievements', 'Timeline of life events', 'Family tree']
                            },
                            {
                                title: 'Sharing & Interaction',
                                items: ['Shareable link', 'QR code generation', 'Guest book', 'Hug counter']
                            }
                        ].map((category, idx) => (
                            <div key={idx} style={{
                                background: 'white',
                                padding: '3.5rem 3rem',
                                borderRadius: '32px',
                                boxShadow: '0 15px 40px rgba(162, 118, 212, 0.08)',
                                border: '1px solid rgba(162, 118, 212, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                position: 'relative'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(162, 118, 212, 0.12)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(162, 118, 212, 0.08)'; }}
                            >
                                <h3 style={{ fontSize: '1.35rem', color: '#2d1b4e', marginBottom: '2rem', fontWeight: '700' }}>{category.title}</h3>
                                
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {category.items.map((item, itemIdx) => (
                                        <li key={itemIdx} style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '1rem', 
                                            color: '#4a2574', 
                                            fontSize: '1rem', 
                                            fontWeight: '500',
                                            background: '#fcfafc',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '16px',
                                            border: '1px solid #faf7fd'
                                        }}>
                                            <div style={{ background: '#eedbfa', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <FaCheck size={12} style={{ color: '#6c43a6' }} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={{ padding: '8rem 0', background: 'white' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div style={{
                        marginTop: '1rem',
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
                                Ready to Create a <br /><span style={{ color: '#a276d4' }}>Lasting Memorial?</span>
                            </h2>
                            <p style={{ fontSize: '1.15rem', marginBottom: '2.5rem', color: '#665e75', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
                                Start preserving precious memories today. No technical skills required.
                            </p>
                            
                            <Link href="/auth?mode=signup" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                                color: 'white',
                                padding: '1.25rem 3.5rem',
                                fontSize: '1.15rem',
                                fontWeight: '600',
                                borderRadius: '50px',
                                textDecoration: 'none',
                                boxShadow: '0 15px 30px rgba(61, 37, 86, 0.25)',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 37, 86, 0.35)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(61, 37, 86, 0.25)'; }}
                            >
                                <span style={{ fontSize: '1.2rem', color: '#d8b4fe' }}></span> Get Started Free <span style={{ marginLeft: '0.25rem', transition: 'transform 0.3s ease' }}>→</span>
                            </Link>
                        </div>
                        
                        {/* Decorative stars */}
                        <span style={{ position: 'absolute', top: '40px', left: '40px', color: '#b388eb', fontSize: '1.5rem', zIndex: 1, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}></span>
                        <span style={{ position: 'absolute', bottom: '60px', right: '50px', color: '#b388eb', fontSize: '1rem', zIndex: 1, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}></span>
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'white', filter: 'blur(50px)', opacity: 0.6, borderRadius: '50%', zIndex: 0 }}></div>
                        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '250px', height: '250px', background: 'white', filter: 'blur(50px)', opacity: 0.6, borderRadius: '50%', zIndex: 0 }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

