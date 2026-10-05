'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMobileMenuOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        setMobileMenuOpen(false);
        logout();
    };

    if (
        pathname === '/auth' ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/create-memorial') ||
        pathname.startsWith('/edit-memorial')
    ) {
        return null;
    }

    if (pathname === '/demo' || pathname.startsWith('/memorial/')) {
        return (
            <div className="memorial-top-logo-wrapper">
                <Link href="/" className="memorial-top-logo" aria-label="Soulishere Home">
                    <Image 
                        src="/logo.png" 
                        alt="Soulishere" 
                        width={130} 
                        height={62} 
                        className="memorial-logo-img" 
                        priority 
                    />
                </Link>
            </div>
        );
    }

    return (
        <>
            <header>
                <div className="container">
                    {/* 3-column flex: [Logo] [Pill Center] [Auth/Hamburger] */}
                    <div className="header-content">

                        {/* Col 1 — Logo */}
                        <Link href="/" className="logo">
                            <Image src="/logo.png" alt="Soulishere" width={180} height={86} className="logo-img" />
                        </Link>

                        {/* Col 2 — Pill nav, centered */}
                        <div className="pill-center-col">
                            <nav className="center-pill-nav">
                                <ul>
                                    <li><Link href="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
                                    <li><Link href="/features" className={pathname === '/features' ? 'active' : ''}>Features</Link></li>
                                    {isAuthenticated && (
                                        <li>
                                            <Link href={isAdmin ? "/admin" : "/dashboard"} className={pathname.startsWith('/dashboard') || pathname.startsWith('/admin') ? 'active' : ''}>
                                                {isAdmin ? "Admin Panel" : "Dashboard"}
                                            </Link>
                                        </li>
                                    )}
                                    {!isAuthenticated && (
                                        <li className="mobile-only-link">
                                            <Link href="/auth" className="pill-btn-primary">
                                                Login
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>

                        {/* Col 3 — Auth links (desktop) + Hamburger (mobile) */}
                        <div className="header-right">
                            {/* Desktop auth */}
                            <div className="right-auth-nav desktop-auth">
                                {isAuthenticated ? (
                                    <button onClick={handleLogout} className="auth-link-text">Logout</button>
                                ) : (
                                    <>
                                        <Link href="/auth?mode=signup" className="auth-link-text">New Account</Link>
                                        <Link href="/auth" className="auth-link-text login-highlight">Login</Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile hamburger */}
                            <button
                                className="mobile-menu-btn"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>

                        {/* Mobile Auth Dropdown — full width below the 3 columns */}
                        {mobileMenuOpen && (
                            <div className="mobile-auth-dropdown">
                                <div className="mobile-auth-inner">
                                    {isAuthenticated ? (
                                        <button onClick={handleLogout} className="mobile-auth-btn mobile-auth-logout">
                                            Logout
                                        </button>
                                    ) : (
                                        <>
                                            <Link href="/auth?mode=signup" className="mobile-auth-btn mobile-auth-register" onClick={() => setMobileMenuOpen(false)}>
                                                New Account
                                            </Link>
                                            <Link href="/auth" className="mobile-auth-btn mobile-auth-login" onClick={() => setMobileMenuOpen(false)}>
                                                Login
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </header>
        </>
    );
}
