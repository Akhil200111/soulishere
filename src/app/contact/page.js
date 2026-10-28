'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    FaPhoneAlt, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaClock, 
    FaPaperPlane, 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaHeart, 
    FaShieldAlt,
    FaArrowRight
} from 'react-icons/fa';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        enquiry: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (status.type) {
            setStatus({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validations
        if (!formData.name.trim()) {
            setStatus({ type: 'error', message: 'Please enter your name.' });
            return;
        }

        if (!formData.phone.trim()) {
            setStatus({ type: 'error', message: 'Please enter your phone number.' });
            return;
        }

        if (!formData.enquiry.trim()) {
            setStatus({ type: 'error', message: 'Please write your enquiry.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit enquiry. Please try again.');
            }

            setSubmitted(true);
            setStatus({
                type: 'success',
                message: data.message || 'Thank you! Your enquiry has been received. Our team will get back to you shortly.'
            });
            setFormData({
                name: '',
                phone: '',
                email: '',
                enquiry: ''
            });
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.message || 'Something went wrong. Please try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #faf7fc 0%, #f4ecf8 100%)',
            paddingTop: '3rem',
            paddingBottom: '5rem',
            fontFamily: 'inherit'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        background: '#f1e6fa', 
                        color: '#6c3ea8', 
                        padding: '0.4rem 1.1rem', 
                        borderRadius: '50px', 
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        letterSpacing: '0.5px',
                        marginBottom: '1rem' 
                    }}>
                        <FaHeart style={{ fontSize: '0.8rem', color: '#a855f7' }} />
                        WE ARE HERE TO HELP
                    </div>

                    <h1 style={{ 
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', 
                        fontWeight: '700', 
                        color: '#261536', 
                        lineHeight: 1.2, 
                        fontFamily: 'serif',
                        marginBottom: '1rem'
                    }}>
                        Get in Touch with Our Team
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: '#68547a', lineHeight: 1.6, margin: 0 }}>
                        Whether you need guidance creating a memorial, have questions about our plans, or need technical assistance, we are honored to assist you with compassionate support.
                    </p>
                </div>

                {/* Main Content: Left Info Cards & Right Form */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '2.5rem',
                    alignItems: 'start'
                }}>
                    
                    {/* Left Column: Contact Info & Reassurance */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2.5rem',
                            border: '1px solid #eedbfa',
                            boxShadow: '0 12px 35px rgba(135, 78, 190, 0.06)'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', color: '#261536', fontFamily: 'serif', marginBottom: '1.75rem', fontWeight: '700' }}>
                                Contact Information
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #f1e6fa 0%, #e8d7f7 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#7a42b5',
                                        fontSize: '1.1rem',
                                        flexShrink: 0
                                    }}>
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#7a678f', fontWeight: '500', marginBottom: '0.2rem' }}>PHONE SUPPORT</div>
                                        <a href="tel:+919876543210" style={{ fontSize: '1.05rem', color: '#261536', fontWeight: '600', textDecoration: 'none' }}>
                                            +91 (800) 247-6854
                                        </a>
                                        <div style={{ fontSize: '0.85rem', color: '#8d7a9f', marginTop: '0.2rem' }}>Mon – Fri, 9am – 6pm IST</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #f1e6fa 0%, #e8d7f7 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#7a42b5',
                                        fontSize: '1.1rem',
                                        flexShrink: 0
                                    }}>
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#7a678f', fontWeight: '500', marginBottom: '0.2rem' }}>EMAIL US</div>
                                        <a href="mailto:support@soulishere.com" style={{ fontSize: '1.05rem', color: '#261536', fontWeight: '600', textDecoration: 'none' }}>
                                            support@soulishere.com
                                        </a>
                                        <div style={{ fontSize: '0.85rem', color: '#8d7a9f', marginTop: '0.2rem' }}>We usually reply within 24 hours</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #f1e6fa 0%, #e8d7f7 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#7a42b5',
                                        fontSize: '1.1rem',
                                        flexShrink: 0
                                    }}>
                                        <FaClock />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#7a678f', fontWeight: '500', marginBottom: '0.2rem' }}>DEDICATED ASSISTANCE</div>
                                        <div style={{ fontSize: '1.05rem', color: '#261536', fontWeight: '600' }}>
                                            Bereavement Care
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#8d7a9f', marginTop: '0.2rem' }}>Compassionate concierge service for grieving families</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reassurance Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #2b1442 0%, #170729 100%)',
                            borderRadius: '24px',
                            padding: '2.25rem',
                            color: 'white',
                            boxShadow: '0 12px 35px rgba(27, 8, 43, 0.25)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <FaShieldAlt style={{ color: '#d8b4fe', fontSize: '1.3rem' }} />
                                <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '600', color: '#f3e8ff' }}>Your Privacy is Sacred</h3>
                            </div>
                            <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
                                All enquiries and family details are handled with complete confidentiality and care. We never share your contact information with third parties.
                            </p>
                            <Link 
                                href="/pricing" 
                                style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '0.5rem', 
                                    color: '#f5d0fe', 
                                    fontWeight: '600', 
                                    fontSize: '0.95rem',
                                    textDecoration: 'none'
                                }}
                            >
                                Explore Memorial Plans <FaArrowRight style={{ fontSize: '0.8rem' }} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        border: '1px solid #eedbfa',
                        boxShadow: '0 12px 35px rgba(135, 78, 190, 0.08)'
                    }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.6rem', color: '#261536', fontFamily: 'serif', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
                                Send an Enquiry
                            </h2>
                            <p style={{ color: '#7a678f', fontSize: '0.95rem', margin: 0 }}>
                                Fields marked with an asterisk (<span style={{ color: '#dc2626', fontWeight: '700' }}>*</span>) are mandatory.
                            </p>
                        </div>

                        {/* Status notification */}
                        {status.message && (
                            <div style={{
                                padding: '1.1rem 1.25rem',
                                borderRadius: '12px',
                                marginBottom: '1.75rem',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.75rem',
                                background: status.type === 'error' ? '#fef2f2' : '#f0fdf4',
                                border: status.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                                color: status.type === 'error' ? '#b91c1c' : '#15803d',
                                fontSize: '0.95rem',
                                lineHeight: 1.5
                            }}>
                                {status.type === 'error' ? (
                                    <FaExclamationCircle style={{ fontSize: '1.15rem', flexShrink: 0, marginTop: '2px' }} />
                                ) : (
                                    <FaCheckCircle style={{ fontSize: '1.15rem', flexShrink: 0, marginTop: '2px' }} />
                                )}
                                <div>{status.message}</div>
                            </div>
                        )}

                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.2rem',
                                    margin: '0 auto 1.5rem auto'
                                }}>
                                    <FaCheckCircle />
                                </div>
                                <h3 style={{ fontSize: '1.4rem', color: '#14532d', fontFamily: 'serif', marginBottom: '0.75rem' }}>
                                    Enquiry Submitted!
                                </h3>
                                <p style={{ color: '#4b5563', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.75rem auto' }}>
                                    We have received your enquiry and our team will reach out to your phone or email shortly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.85rem 2rem',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(109, 40, 217, 0.3)'
                                    }}
                                >
                                    Submit Another Enquiry
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                
                                {/* Name - Mandatory */}
                                <div>
                                    <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.92rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.5rem' }}>
                                        Name <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Eleanor Vance"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem 1.1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #dccae9',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            background: '#fcfbfe',
                                            color: '#261536',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8b5cf6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#dccae9';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Phone Number - Mandatory */}
                                <div>
                                    <label htmlFor="contact-phone" style={{ display: 'block', fontSize: '0.92rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.5rem' }}>
                                        Phone Number <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. +91 98765 43210"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem 1.1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #dccae9',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            background: '#fcfbfe',
                                            color: '#261536',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8b5cf6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#dccae9';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Email - Optional (normal field name, NO asterisk) */}
                                <div>
                                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.92rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.5rem' }}>
                                        Email
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="e.g. eleanor@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem 1.1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #dccae9',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            background: '#fcfbfe',
                                            color: '#261536',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8b5cf6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#dccae9';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Enquiry - Mandatory */}
                                <div>
                                    <label htmlFor="contact-enquiry" style={{ display: 'block', fontSize: '0.92rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.5rem' }}>
                                        Enquiry <span style={{ color: '#dc2626' }}>*</span>
                                    </label>
                                    <textarea
                                        id="contact-enquiry"
                                        name="enquiry"
                                        rows={5}
                                        value={formData.enquiry}
                                        onChange={handleChange}
                                        placeholder="Please let us know how we can assist you..."
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.9rem 1.1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #dccae9',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            background: '#fcfbfe',
                                            color: '#261536',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            transition: 'border-color 0.2s, box-shadow 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8b5cf6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#dccae9';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        marginTop: '0.5rem',
                                        background: 'linear-gradient(135deg, #815bb5 0%, #4a286c 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '1rem 2rem',
                                        borderRadius: '14px',
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.75 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        boxShadow: '0 8px 24px rgba(74, 40, 108, 0.25)',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(74, 40, 108, 0.35)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 40, 108, 0.25)';
                                    }}
                                >
                                    <FaPaperPlane style={{ fontSize: '0.95rem' }} />
                                    {loading ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
