'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

function AuthContent() {
    const searchParams = useSearchParams();
    const defaultMode = searchParams.get('mode') === 'signup' ? false : true;

    const [isLogin, setIsLogin] = useState(defaultMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
        }

        setLoading(true);

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            result = await register(name, email, password);
        }

        if (result.success) {
            router.push(result.isAdmin ? '/admin' : '/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page-wrapper" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--lavender-blush)',
            padding: '2rem 1rem',
            position: 'relative'
        }}>
            {/* Back Button */}
            <Link href="/" className="back-btn" style={{
                position: 'absolute',
                top: '2rem',
                left: '2rem',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#3d2556',
                textDecoration: 'none',
                fontWeight: '600',
                background: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
            }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
            >
                <FaArrowLeft /> <span className="back-btn-text">Back to Home</span>
            </Link>

            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1000px',
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(36, 0, 70, 0.12)',
                minHeight: '650px'
            }}>

                {/* Left Panel - Gradient */}
                <div style={{
                    flex: '1',
                    background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                }} className="auth-left-panel">
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}>
                            <Image src="/logo.png" alt="Soulishere" width={200} height={200} style={{ width: '200px', height: 'auto' }} />
                        </Link>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, maxWidth: '350px' }}>
                        <p style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1rem', opacity: 0.8, color: 'white' }}>You can easily</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: 1.2, letterSpacing: '-1px', color: 'white' }}>
                            Preserve beautiful memories and stories forever.
                        </h2>
                    </div>

                    <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.4)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 1 }}></div>
                </div>

                {/* Right Panel - Form */}
                <div style={{
                    flex: '1',
                    padding: '4rem 4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'white'
                }} className="auth-right-panel">
                    
                    {/* Mobile-only logo (since left panel is hidden) */}
                    <div className="mobile-logo">
                        <Link href="/">
                            <Image src="/logo.png" alt="Soulishere" width={150} height={150} style={{ width: '130px', height: 'auto', margin: '0 auto' }} />
                        </Link>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2.25rem', color: '#111', marginBottom: '0.5rem', fontWeight: '700', letterSpacing: '-1px' }}>
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.5 }}>
                            {isLogin ? 'Sign in to your account to manage your memorials and connect with your loved ones.' : 'Access your memorials, stories, and connections anytime, anywhere – keep everything in one place.'}
                        </p>
                    </div>

                    {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {!isLogin && (
                            <div>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem', color: '#333', fontWeight: '600', fontSize: '0.85rem' }}>Full name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required={!isLogin}
                                    style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', background: 'transparent' }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#815bb5'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#eee'}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem', color: '#333', fontWeight: '600', fontSize: '0.85rem' }}>Your email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#815bb5'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#eee'}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.25rem', color: '#333', fontWeight: '600', fontSize: '0.85rem' }}>{isLogin ? 'Password' : 'Create password'}</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={isLogin ? undefined : 6}
                                style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#815bb5'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#eee'}
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.25rem', color: '#333', fontWeight: '600', fontSize: '0.85rem' }}>Confirm password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required={!isLogin}
                                    style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #eee', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', background: 'transparent' }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#815bb5'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#eee'}
                                />
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '1.5rem',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 25px rgba(36, 0, 70, 0.25)'
                        }}
                            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(36, 0, 70, 0.35)'; } }}
                            onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(36, 0, 70, 0.25)'; } }}
                        >
                            {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign in' : 'Create account')}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#bbb' }}>
                        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                        <span style={{ padding: '0 1rem', fontSize: '0.8rem' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
                    </div>

                    <a href="/api/auth/google" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        background: 'white',
                        border: '1px solid #eedbfa',
                        borderRadius: '50px',
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8f9fa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                    >
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} unoptimized />
                    </a>

                    <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#888' }}>
                        {isLogin ? (
                            <>Don&apos;t have an account? <button onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#815bb5', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Register</button></>
                        ) : (
                            <>Already have an account? <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#815bb5', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Sign in</button></>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mobile-logo {
                    display: none;
                }
                @media (max-width: 768px) {
                    .auth-left-panel {
                        display: none !important;
                    }
                    .auth-right-panel {
                        padding: 3rem 1.5rem !important;
                    }
                    .mobile-logo {
                        display: block;
                        margin-bottom: 2rem;
                        text-align: center;
                    }
                    .back-btn-text {
                        display: none;
                    }
                    .auth-page-wrapper {
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                        align-items: flex-start !important;
                        padding: 1rem !important;
                    }
                    .back-btn {
                        position: static !important;
                        margin-bottom: 1rem !important;
                        padding: 0 !important;
                        border-radius: 0 !important;
                        width: auto !important;
                        height: auto !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default function Auth() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContent />
        </Suspense>
    );
}
