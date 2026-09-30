"use client";

import Link from 'next/link';
import { FaHeart, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    if (
        pathname === '/auth' || 
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/admin') || 
        pathname.startsWith('/create-memorial') || 
        pathname.startsWith('/edit-memorial') ||
        pathname === '/demo' || 
        pathname.startsWith('/memorial/')
    ) {
        return null;
    }

    return (
        <footer style={{ background: '#110022', color: 'rgba(255,255,255,0.7)', padding: '5rem 0 2rem 0', fontFamily: 'inherit' }}>
            <div className="container">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', marginBottom: '4rem', justifyContent: 'space-between' }}>
                    {/* Brand */}
                    <div style={{ flex: '1 1 300px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginBottom: '1.5rem' }}>
                            <Image src="/logo.png" alt="Soulishere" width={60} height={60} style={{ height: '45px', width: 'auto', marginRight: '15px' }} />
                            <span style={{ fontWeight: '700', fontSize: '1.5rem', color: 'white', letterSpacing: '-0.5px' }}>Soulishere</span>
                        </Link>
                        <p style={{ lineHeight: 1.6, fontSize: '1.05rem', maxWidth: '350px' }}>
                            Preserving memories, celebrating lives, and crafting beautiful digital legacies that last forever.
                        </p>
                    </div>

                    {/* Links */}
                    <div style={{ flex: '1 1 150px' }}>
                        <h4 style={{ color: 'white', fontSize: '1.15rem', fontWeight: '600', marginBottom: '1.5rem' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link href="/features" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Features</Link></li>
                            <li><Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Pricing</Link></li>
                            <li><Link href="/auth?mode=signup" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Create Memorial</Link></li>
                        </ul>
                    </div>

                    <div style={{ flex: '1 1 150px' }}>
                        <h4 style={{ color: 'white', fontSize: '1.15rem', fontWeight: '600', marginBottom: '1.5rem' }}>Company</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link href="/about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>About Us</Link></li>
                            <li><Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Privacy Policy</Link></li>
                            <li><Link href="/terms" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseEnter={(e) => e.target.style.color = 'var(--pink)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div style={{ flex: '1 1 200px' }}>
                        <h4 style={{ color: 'white', fontSize: '1.15rem', fontWeight: '600', marginBottom: '1.5rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" aria-label="Facebook" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}><FaFacebook size={18} /></a>
                            <a href="#" aria-label="Twitter" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}><FaTwitter size={18} /></a>
                            <a href="#" aria-label="Instagram" style={{ color: 'white', background: 'rgba(255,255,255,0.1)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}><FaInstagram size={18} /></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', gap: '1rem', fontSize: '0.95rem' }}>
                    <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Soulishere. All rights reserved.</p>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Made with <Image src="/heart_icon.png" width={18} height={18} alt="Love" style={{ objectFit: 'contain' }} /> for those we love
                    </p>
                </div>
            </div>
        </footer>
    );
}
