'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { FaPalette, FaMousePointer, FaShareAlt, FaComments, FaInfinity, FaChevronDown, FaCheck, FaQrcode, FaLeaf, FaImage, FaUsers, FaUserPlus, FaFileAlt, FaPen, FaCommentDots, FaUserAlt, FaStar, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import ParticleBackground from '@/components/ParticleBackground';
import CloudsBackground from '@/components/CloudsBackground';
import HorizontalScrollSection from '@/components/HorizontalScrollSection';
import { getMemorialQRUrl } from '@/lib/qr';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [sampleMemorialId, setSampleMemorialId] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [memorialUrl, setMemorialUrl] = useState('');

  useEffect(() => {
    if (sampleMemorialId) {
      setMemorialUrl(getMemorialQRUrl(sampleMemorialId));
    }
  }, [sampleMemorialId]);

  useEffect(() => {
    const fetchSampleMemorial = async () => {
      try {
        const res = await axios.get('/api/memorials/sample');
        if (res.data.success && res.data.data) {
          setSampleMemorialId(res.data.data._id);
        }
      } catch {
        console.log('No sample memorial available');
      }
    };
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/site-settings');
        if (res.data.success) {
          setSiteSettings(res.data.data);
        }
      } catch (e) {
        console.error('Failed to fetch settings');
      }
    };
    fetchSampleMemorial();
    fetchSettings();
  }, []);

  const toggleFAQ = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    { icon: FaPalette, title: 'Beautiful Design', description: "Professional, elegant memorial pages that celebrate your loved one's unique story." },
    { icon: FaMousePointer, title: 'Easy to Create', description: 'Simple step-by-step process - no technical skills needed.' },
    { icon: FaShareAlt, title: 'Share Instantly', description: 'Generate QR codes and share with one link.' },
    { icon: FaComments, title: 'Guest Interaction', description: 'Invite friends and family to leave condolences and share memories.' },
    { icon: FaInfinity, title: 'Permanent Home', description: 'Your memorial lives forever on our platform.' }
  ];

  const howItWorks = [
    { step: 1, icon: FaUserPlus, title: 'Sign Up & Create Profile', description: 'Create your free account in seconds.' },
    { step: 2, icon: FaFileAlt, title: 'Add Memorial Details', description: 'Fill in details with photos, stories, and life events.' },
    { step: 3, icon: FaPen, title: 'Personalize & Customize', description: 'Add family information, timeline, and upload photos.' },
    { step: 4, icon: FaQrcode, title: 'Generate QR Code', description: 'Create a shareable QR code and link.' },
    { step: 5, icon: FaCommentDots, title: 'Receive Condolences', description: 'Watch as friends and family add memories.' }
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Mumbai, India', text: 'This platform helped us create a beautiful tribute for my grandmother. The QR code feature is amazing.', image: '/images/testimonial_1.png' },
    { name: 'Rahul Verma', role: 'Delhi, India', text: 'Easy to use and the memorial page looks so professional. Our whole family contributed memories.', image: '/images/testimonial_2.png' },
    { name: 'Anjali Patel', role: 'Bangalore, India', text: 'The guest book feature lets everyone share their stories. It means so much to our family.', image: '/images/testimonial_3.png' }
  ];

  const faqs = [
    { q: 'What can I include in a memorial?', a: "You can include the person's full name, birth and death dates, biographical information, photos, videos, family members, life events and milestones, achievements, and personal website links." },
    { q: 'Is my memorial permanent?', a: 'Yes! Your memorial remains on our platform indefinitely. As long as you maintain an active account, the memorial will be preserved.' },
    { q: 'How do I share the memorial?', a: 'Admins can generate unique QR codes that link directly to the memorial. You can print the QR code, email it, or display it at memorial services.' },
    { q: 'Can people add memories after it\'s published?', a: 'Absolutely! Visitors can sign the digital guest book to leave condolences, memories, and tributes anytime.' },
    { q: 'Can I edit a memorial after publishing?', a: 'Yes! As the creator, you can edit any part of the memorial anytime.' }
  ];

  return (
    <section id="homeSection">
      {/* Hero Section */}
      <div className="hero hero-section-padding" style={{
        backgroundImage: "url('/images/hero.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Optional overlay if text needs better contrast */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></div>

        <CloudsBackground />
        <ParticleBackground />

        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="responsive-h1">
            Across the bridge, memories remain.

          </h1>
          <p style={{ color: 'var(--dark)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '650px' }}>
            Create a beautiful, lasting tribute for your loved ones. Share memories, stories, and photos with family and friends in a space that lasts forever.
          </p>
          {/* <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/auth?mode=signup" className="pill-btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Create Memorial
            </Link>
            {sampleMemorialId && (
              <Link href={`/memorial/${sampleMemorialId}`} style={{ padding: '1rem 1.5rem', fontSize: '1.1rem', color: '#111', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Sample <span style={{ fontSize: '1.2rem' }}>→</span>
              </Link>
            )}
          </div> */}
        </div>

        {/* Bottom Left QR Code & Action */}
        <div className="hero-bottom-left-card-mobile">
          {/* Large QR Code */}
          <div style={{
            width: '110px',
            height: '110px',
            background: 'white',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
            padding: '10px'
          }}>
            {memorialUrl ? (
              <QRCode value={memorialUrl} size={90} style={{ width: '100%', height: '100%' }} />
            ) : (
              <FaQrcode style={{ fontSize: '4.5rem', color: 'var(--primary)' }} />
            )}
          </div>

          {/* Content & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "start", textAlign: "start" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '0.5px' }}>Soulishere™</span>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
              Scan to preview a beautiful interactive memorial on your device.
            </p>

            <Link href="/auth?mode=signup" style={{
              background: 'linear-gradient(135deg, var(--pink), var(--primary))',
              color: 'white',
              padding: '0.6rem 1.25rem',
              borderRadius: '50px',
              fontWeight: '600',
              textDecoration: 'none',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(157, 78, 221, 0.4)',
              transition: 'all 0.3s ease',
              alignSelf: 'flex-start'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(157, 78, 221, 0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(157, 78, 221, 0.4)'; }}
            >
              Create Memory <span style={{ marginLeft: '0.5rem' }}>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section with Memorial Preview */}
      <div style={{ padding: '8rem 0', position: 'relative', overflow: 'hidden', background: "linear-gradient(rgba(250, 247, 253, 0.85), rgba(250, 247, 253, 0.95)), url('/images/family.png') center/cover no-repeat" }}>
        {/* Subtle decorative background blob */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--primary)', opacity: 0.04, filter: 'blur(80px)', borderRadius: '50%' }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '1px', background: '#d5c4e3' }}></div>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <span style={{ color: '#3d2556', fontWeight: '600', letterSpacing: '4px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Why Choose Us</span>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <div style={{ width: '50px', height: '1px', background: '#d5c4e3' }}></div>
            </div>
            <h2 className="responsive-h2" style={{ color: '#2d1b4e' }}>
              Why Choose Our<br />Memorial Platform
            </h2>
            <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
              We make it simple to create beautiful, lasting tributes that honor your loved ones and preserve their legacy for generations.
            </p>
          </div>

          <div className="features-grid-mobile">


            {/* Laptop Image Container (Moved to bottom for mobile) */}
            <div style={{ flex: 1, minWidth: '320px', position: 'relative' }}>
              <div style={{
                position: 'relative',
                padding: '3rem 2rem',
                borderRadius: '40px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image src="/images/memorial_sample.png" unoptimized={true} alt="Memorial Preview" width={700} height={450} style={{ width: '110%', marginLeft: '-5%', height: 'auto', display: 'block', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }} />
              </div>
            </div>


            {/* Right: Text and Feature Cards */}
            <div style={{ flex: 1, minWidth: '320px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <span style={{ color: '#815bb5', fontSize: '1.5rem', lineHeight: 1 }}></span>
                </div>
                <h3 style={{ fontSize: '2.2rem', color: '#2d1b4e', fontWeight: '500', fontFamily: 'serif', margin: 0 }}>Beautiful Memorial Pages</h3>
              </div>
              <p style={{ color: '#665e75', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                Each memorial is crafted with care, featuring a stunning hero section, photo galleries, life timelines, and interactive family trees.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Card 1 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'; }}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem', flexShrink: 0 }}>
                    <FaLeaf style={{ color: '#4a2574', fontSize: '1.25rem' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#2d1b4e', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Elegant, responsive design</h4>
                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>A beautiful experience on any device.</p>
                  </div>
                  <div style={{ position: 'absolute', right: '1.5rem' }}>
                    <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'; }}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem', flexShrink: 0 }}>
                    <FaImage style={{ color: '#4a2574', fontSize: '1.25rem' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#2d1b4e', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>High-resolution photo & video galleries</h4>
                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>Preserve every precious moment in stunning detail.</p>
                  </div>
                  <div style={{ position: 'absolute', right: '1.5rem' }}>
                    <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                  </div>
                </div>

                {/* Card 3 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'; }}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem', flexShrink: 0 }}>
                    <FaUsers style={{ color: '#4a2574', fontSize: '1.25rem' }} />
                  </div>
                  <div>
                    <h4 style={{ color: '#2d1b4e', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Interactive life timeline & guestbook</h4>
                    <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>Share stories, memories, and heartfelt messages.</p>
                  </div>
                  <div style={{ position: 'absolute', right: '1.5rem' }}>
                    <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2.5rem',
        marginTop: '4rem',
        maxWidth: '1100px',
        marginLeft: 'auto',
        marginRight: 'auto'
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
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(162, 118, 212, 0.15)'; e.currentTarget.style.transition = 'all 0.3s ease'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(162, 118, 212, 0.08)'; e.currentTarget.style.transition = 'all 0.3s ease'; }}
          >
            {/* Top Right Star */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#b388eb', fontSize: '1.2rem' }}></div>

            {/* Icon Container */}
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
              flexShrink: 0
            }}>
              <f.icon style={{ fontSize: '1.75rem', color: 'white' }} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: '#2d1b4e', marginBottom: '0.75rem', fontWeight: '500', fontFamily: 'serif' }}>{f.title}</h3>

            {/* Separator Line */}
            <div style={{ width: '25px', height: '2px', background: '#b388eb', marginBottom: '1.25rem' }}></div>

            <p style={{ color: '#665e75', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>{f.description}</p>

            {/* Bottom Right Swoosh */}
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              right: '-15px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #d8b4fe 0%, #a276d4 100%)',
              borderTopLeftRadius: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '20px',
              paddingLeft: '20px',
              opacity: 0.95
            }}>
              <span style={{ color: 'white', fontSize: '0.9rem', marginBottom: '10px', marginLeft: '10px' }}></span>
            </div>
          </div>
        ))}

      </div>
      {/* How It Works */}
      <HorizontalScrollSection
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '1px', background: '#d5c4e3' }}></div>
            <span style={{ color: '#3d2556', fontWeight: '600', letterSpacing: '4px', fontSize: '0.9rem', textTransform: 'uppercase' }}>How It Works</span>
            <div style={{ width: '50px', height: '1px', background: '#d5c4e3' }}></div>
          </div>
        }
        subtitle={
          <h2 className="responsive-h2">
            Creating a Beautiful Tribute<br />is <span style={{ color: '#a276d4' }}>Simple</span>
          </h2>
        }
        description={
          <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Preserving your loved one's legacy is beautifully simple.<br />Follow these steps to create a permanent tribute.
          </p>
        }
      >
        {/* The horizontal connecting line */}
        <div style={{
          position: 'absolute',
          top: '36px', // Aligned with the center of the 50px step circles (1rem padding + 25px radius)
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #d5c4e3 10%, #d5c4e3 90%, transparent 100%)',
          zIndex: 0
        }}></div>

        {howItWorks.map((item, index) => (
          <div key={item.step} className="step-card-wrapper" style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>

            {/* Step Circle */}
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 0 0 10px #faf7fd, 0 5px 15px rgba(162, 118, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c43a6',
              fontWeight: '700',
              fontSize: '1.2rem',
              marginBottom: '2.5rem',
              position: 'relative',
              zIndex: 2
            }}>
              {String(item.step).padStart(2, '0')}

              {/* Vertical dashed line dropping down */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '2.5rem',
                width: '2px',
                background: 'repeating-linear-gradient(to bottom, #d5c4e3, #d5c4e3 4px, transparent 4px, transparent 8px)'
              }}></div>
            </div>

            {/* Card */}
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(162, 118, 212, 0.08)',
              width: '100%',
              maxWidth: '400px', // Prevent card from stretching to full 100vw
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Gradient Icon Container */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
                flexShrink: 0
              }}>
                <item.icon style={{ fontSize: '1.5rem', color: 'white' }} />
              </div>

              <h3 style={{ fontSize: '1.15rem', color: '#2d1b4e', marginBottom: '1rem', fontWeight: '700', lineHeight: 1.3 }}>
                {item.title}
              </h3>

              <p style={{ color: '#887f99', lineHeight: 1.5, margin: 0, fontSize: '0.9rem' }}>
                {item.description}
              </p>
            </div>

          </div>
        ))}
      </HorizontalScrollSection>
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link href="/auth?mode=signup" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
          color: 'white',
          padding: '1.15rem 3rem',
          fontSize: '1.1rem',
          fontWeight: '500',
          borderRadius: '50px',
          textDecoration: 'none',
          boxShadow: '0 15px 30px rgba(61, 37, 86, 0.3)',
          transition: 'all 0.3s ease'
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 37, 86, 0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(61, 37, 86, 0.3)'; }}
        >
          <span style={{ fontSize: '1.2rem', color: '#d8b4fe' }}></span> Start Creating Now <span>→</span>
        </Link>
      </div>
      {/* Testimonials Section */}
      <div style={{ padding: '8rem 0', background: '#faf7fd', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <span style={{ color: '#3d2556', fontWeight: '600', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Testimonials</span>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
            </div>
            <h2 className="responsive-h2">
              What <span style={{ color: '#a276d4' }}>Families</span> Say
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
              <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
            </div>

            <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Trusted by families across the country to preserve<br />their most precious memories.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem 2.5rem', paddingTop: '3rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '4rem 2rem 2.5rem 2rem',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: '0 15px 40px rgba(162, 118, 212, 0.08)',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(162, 118, 212, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(162, 118, 212, 0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(162, 118, 212, 0.08)'; }}
              >
                {/* Background Decor Container (allows waves to be clipped without clipping avatar) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}>
                  {/* Quotation Mark Graphic */}
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    fontSize: '5rem',
                    fontFamily: 'serif',
                    color: '#e4c1f9',
                    lineHeight: 0.8,
                    fontWeight: '900'
                  }}>
                    &ldquo;
                  </div>

                  {/* Bottom decorative waves using clip paths */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '100px',
                    background: 'linear-gradient(to top, rgba(179, 136, 235, 0.25) 0%, rgba(228, 193, 249, 0) 100%)',
                    clipPath: 'ellipse(120% 100% at 50% 100%)'
                  }}></div>
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '60px',
                    background: 'linear-gradient(to right, rgba(228, 193, 249, 0.4) 0%, rgba(179, 136, 235, 0.5) 100%)',
                    clipPath: 'ellipse(90% 100% at 30% 100%)'
                  }}></div>

                  {/* Tiny stars on the bottom gradient */}
                  <span style={{ position: 'absolute', bottom: '20px', left: '25px', color: 'white', fontSize: '0.75rem' }}></span>
                  <span style={{ position: 'absolute', bottom: '30px', right: '35px', color: 'white', fontSize: '0.6rem' }}></span>
                </div>

                {/* Overlapping Avatar */}
                <div style={{
                  position: 'absolute',
                  top: '-45px', // Pulled up across the border
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2
                }}>
                  <div style={{
                    padding: '8px',
                    background: '#faf7fd', // Matches section background
                    borderRadius: '50%',
                    display: 'inline-flex',
                    boxShadow: '0 10px 30px rgba(162, 118, 212, 0.2)'
                  }}>
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={80}
                      height={80}
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>

                {/* Testimonial Text */}
                <p style={{
                  color: '#2d1b4e',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  fontSize: '1rem',
                  position: 'relative',
                  zIndex: 1,
                  marginTop: '1.5rem',
                  flexGrow: 1,
                  fontWeight: '500'
                }}>
                  {t.text}
                </p>

                {/* Separator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '2rem 0 1.5rem 0', width: '80%', position: 'relative', zIndex: 1 }}>
                  <div style={{ flex: 1, height: '1px', background: '#e4c1f9' }}></div>
                  <span style={{ color: '#b388eb', fontSize: '0.8rem' }}></span>
                  <div style={{ flex: 1, height: '1px', background: '#e4c1f9' }}></div>
                </div>

                {/* Author Info */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
                  <h4 style={{ color: '#2d1b4e', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '700' }}>{t.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#a276d4' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div style={{ padding: '8rem 0', background: '#faf7fd' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <span style={{ color: '#3d2556', fontWeight: '600', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>Cherished Memories</span>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
            </div>
            <h2 style={{ fontSize: '4.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Beautiful <span style={{ color: '#a276d4' }}>Memorial Galleries</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
              <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
            </div>

            <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Showcase your loved one's life journey through<br />stunning, high-resolution photo galleries.
            </p>
          </div>

          <div className="bento-gallery">
            {[
              { span: 'span-2' },
              { span: 'span-1' },
              { span: 'span-1' },
              { span: 'span-1' },
              { span: 'span-1' },
              { span: 'span-1' },
              { span: 'span-2' }
            ].map((item, index) => (
              <div key={index} className={`bento-item ${item.span}`}>
                <Image
                  src={siteSettings?.images?.gallery?.[index % 4] || `/images/gallery_${(index % 4) + 1}.png`}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <Link href="/auth?mode=signup" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
              color: 'white',
              padding: '1.15rem 3rem',
              fontSize: '1.1rem',
              fontWeight: '500',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 15px 30px rgba(61, 37, 86, 0.3)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 37, 86, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(61, 37, 86, 0.3)'; }}
            >
              <span style={{ fontSize: '1.2rem', color: '#d8b4fe' }}></span> Create Your Memorial <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '8rem 0', background: '#faf7fd', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>

            {/* Left Side: Text and Illustration */}
            <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#eedbfa',
                color: '#6c43a6',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '700',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '2rem',
                border: '1px solid #d8b4fe'
              }}>
                <FaShieldAlt style={{ fontSize: '1rem' }} />
                <span>One Time. Forever Yours.</span>
              </div>

              <h2 style={{ fontSize: '3.5rem', color: '#2d1b4e', fontWeight: '400', fontFamily: 'serif', lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Simple, Transparent<br />
                <span style={{ color: '#815bb5' }}>Pricing</span>
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
                <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
                <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
              </div>

              <p style={{ color: '#665e75', fontSize: '1.15rem', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '450px' }}>
                One complete package to preserve your legacy forever.<br />
                No hidden fees, no subscriptions, just a single one-time payment.
              </p>

              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', background: 'linear-gradient(135deg, #e4c1f9, #a276d4)', opacity: 0.2, filter: 'blur(40px)', borderRadius: '50%' }}></div>
                <Image src={siteSettings?.images?.pricingIllustration || "/images/pricing_illustration.png"} alt="Pricing" width={450} height={400} unoptimized={true} style={{ maxWidth: '100%', width: '450px', height: 'auto', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 40px rgba(162, 118, 212, 0.15))' }} />
              </div>
            </div>

            {/* Right Side: Pricing Card */}
            <div style={{ flex: 1, minWidth: '360px' }}>
              <div style={{
                background: '#fff',
                borderRadius: '32px',
                padding: '3.5rem 3rem',
                boxShadow: '0 20px 60px rgba(162, 118, 212, 0.1)',
                border: '1px solid rgba(255,255,255,1)',
                position: 'relative',
                overflow: 'visible' // To let the ribbon hang
              }}>
                {/* Ribbon Badge */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '30px',
                  background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                  color: 'white',
                  padding: '1.5rem 1rem 2rem 1rem',
                  width: '120px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  lineHeight: 1.4,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
                  boxShadow: '0 10px 20px rgba(61, 37, 86, 0.2)'
                }}>
                  ALL FEATURES<br />INCLUDED<br />
                  <span style={{ fontSize: '1rem', marginTop: '0.25rem', display: 'block' }}></span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: '#2d1b4e', marginBottom: '1.5rem', fontWeight: '700' }}>Complete Memorial Package</h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: '800', color: '#2d1b4e', lineHeight: 1 }}>
                    {siteSettings?.pricing?.currency || '₹'}
                    {(siteSettings?.pricing?.amount || 1999).toLocaleString()}
                  </span>
                  <span style={{ color: '#815bb5', fontSize: '1.1rem', fontWeight: '600' }}>/ one-time</span>
                </div>

                {/* Separator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', width: '100%' }}>
                  <div style={{ flex: 1, height: '1px', background: '#eedbfa' }}></div>
                  <span style={{ color: '#a276d4', fontSize: '0.8rem' }}></span>
                  <div style={{ flex: 1, height: '1px', background: '#eedbfa' }}></div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
                  {(siteSettings?.pricing?.features || [
                    'YouTube Video Embedding',
                    'Profile & Cover Pictures',
                    'Complete Guest Book',
                    'Family Tree Documentation',
                    'Life Timeline & Events',
                    'Premium Design Templates',
                    'Permanent Memorial Page'
                  ]).map((feature, idx) => (
                    <li key={idx} style={{
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
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/auth?mode=signup" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                  color: 'white',
                  padding: '1.25rem',
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  boxShadow: '0 15px 30px rgba(61, 37, 86, 0.25)',
                  transition: 'all 0.3s ease'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 37, 86, 0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(61, 37, 86, 0.25)'; }}
                >
                  <span style={{ fontSize: '1.2rem', color: '#d8b4fe' }}></span> Create Memorial Now <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '8rem 0', background: '#faf7fd' }}>
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <span style={{ color: '#3d2556', fontWeight: '700', letterSpacing: '3px', fontSize: '0.85rem', textTransform: 'uppercase' }}>FAQ</span>
              <span style={{ color: '#a276d4', fontSize: '1.2rem' }}></span>
              <div style={{ width: '40px', height: '1px', background: '#d5c4e3' }}></div>
            </div>

            <h2 className="responsive-h2">
              Frequently Asked <span style={{ color: '#a276d4' }}>Questions</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
              <Image src="/heart_icon.png" width={22} height={22} alt="Heart" style={{ objectFit: 'contain' }} />
              <div style={{ width: '30px', height: '1px', background: '#d5c4e3' }}></div>
            </div>

            <p style={{ color: '#665e75', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              Everything you need to know about creating and<br />managing a memorial.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {faqs.map((faq, index) => {
              const Icon = [FaFileAlt, FaShieldAlt, FaShareAlt, FaUsers, FaPen][index % 5];
              const isOpen = openFaq === index;
              return (
                <div key={index} style={{
                  background: isOpen ? '#fdfafc' : '#fff',
                  borderRadius: '16px',
                  boxShadow: isOpen ? '0 10px 30px rgba(162, 118, 212, 0.1)' : '0 5px 15px rgba(162, 118, 212, 0.05)',
                  border: isOpen ? '2px solid #e4c1f9' : '1px solid #eedbfa',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  <div
                    onClick={() => toggleFAQ(index)}
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                      <div style={{
                        background: '#eedbfa',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon style={{ color: '#6c43a6', fontSize: '1.1rem' }} />
                      </div>
                      <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#2d1b4e' }}>{faq.q}</span>
                    </div>

                    <div style={{
                      background: '#eedbfa',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <FaChevronDown style={{
                        color: '#6c43a6',
                        fontSize: '0.8rem',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0,
                    padding: isOpen ? '0 1.5rem 1.5rem 4.75rem' : '0 1.5rem 0 4.75rem',
                    transition: 'all 0.4s ease'
                  }}>
                    <p style={{ margin: 0, color: '#665e75', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Support Banner */}
          <div style={{
            marginTop: '3rem',
            background: 'linear-gradient(to right, #fdfafc, #f3e8ff)',
            borderRadius: '24px',
            padding: '2rem 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #eedbfa',
            boxShadow: '0 15px 30px rgba(162, 118, 212, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: 'white',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 20px rgba(162, 118, 212, 0.15)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <FaCommentDots style={{ color: '#3d2556', fontSize: '1.8rem' }} />
                </div>
                <span style={{ position: 'absolute', top: '0', right: '-10px', color: '#b388eb', fontSize: '1rem', zIndex: 1 }}></span>
                <span style={{ position: 'absolute', bottom: '-5px', left: '-5px', color: '#b388eb', fontSize: '0.8rem', zIndex: 1 }}></span>
              </div>

              <div>
                <h4 style={{ color: '#2d1b4e', fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>Still have questions?</h4>
                <p style={{ color: '#665e75', margin: 0, fontSize: '0.95rem' }}>We're here to help you create a lasting tribute<br />for your loved ones.</p>
              </div>
            </div>

            <Link href="/contact" style={{
              position: 'relative',
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 10px 20px rgba(61, 37, 86, 0.25)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px rgba(61, 37, 86, 0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(61, 37, 86, 0.25)'; }}
            >
              <FaCommentDots style={{ fontSize: '1.1rem' }} />
              Contact Support →
            </Link>

            {/* Decorative right stars */}
            <span style={{ position: 'absolute', top: '20px', right: '40px', color: 'white', fontSize: '1.5rem', zIndex: 1, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}></span>
            <span style={{ position: 'absolute', bottom: '30px', right: '20px', color: 'white', fontSize: '1rem', zIndex: 1, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}></span>
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'white', filter: 'blur(40px)', opacity: 0.5, borderRadius: '50%', zIndex: 0 }}></div>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '4rem 0 8rem 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            background: 'linear-gradient(to right, #fdfafc, #f3e8ff)',
            borderRadius: '32px',
            padding: '5rem 3rem',
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
              <h2 className="responsive-h2">
                Ready to Create a <br /><span style={{ color: '#a276d4' }}>Lasting Tribute?</span>
              </h2>
              <p style={{ fontSize: '1.15rem', marginBottom: '3rem', color: '#665e75', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
                Honor your loved one&apos;s memory with a beautifully crafted memorial that lasts forever. Join thousands of families preserving their legacy today.
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
                <span style={{ fontSize: '1.2rem', color: '#d8b4fe' }}></span> Create Your First Memorial <span style={{ marginLeft: '0.25rem', transition: 'transform 0.3s ease' }}>→</span>
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
    </section>
  );
}
