'use client';
import { useRef, useEffect, useState } from 'react';

export default function HorizontalScrollSection({ title, subtitle, description, children }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const scrollContentRef = useRef(null);
  const targetTranslateRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    // Smooth scrolling animation loop (lerp)
    const updateScroll = () => {
      // The multiplier (0.05) controls the smoothness/speed. Lower = slower/smoother.
      currentTranslateRef.current += (targetTranslateRef.current - currentTranslateRef.current) * 0.05;
      
      // Apply directly to DOM for 60fps performance without React re-renders
      if (scrollContentRef.current) {
        scrollContentRef.current.style.transform = `translateX(${currentTranslateRef.current}px)`;
      }
      
      rafRef.current = requestAnimationFrame(updateScroll);
    };
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(updateScroll);

    const handleScroll = () => {
      if (!containerRef.current || !stickyRef.current || !scrollContentRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const stickyHeight = stickyRef.current.offsetHeight;
      const scrollRange = containerRect.height - stickyHeight;
      
      if (scrollRange <= 0) return; 
      
      let progress = -containerRect.top / scrollRange;
      progress = Math.max(0, Math.min(progress, 1));
      
      const contentWidth = scrollContentRef.current.scrollWidth;
      const stickyWidth = stickyRef.current.clientWidth;
      const maxTranslate = contentWidth - stickyWidth;
      
      if (maxTranslate > 0) {
        targetTranslateRef.current = -progress * maxTranslate;
      } else {
        targetTranslateRef.current = 0;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: '800vh', background: '#faf7fd', position: 'relative' }}>
      <div 
        ref={stickyRef} 
        style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden' 
        }}
      >
        <div className="container" style={{ maxWidth: '1300px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            {title}
            {subtitle}
            {description}
          </div>
        </div> {/* End of container title */}
          
        <div className="horizontal-scroll-track-wrapper">
          <div 
            ref={scrollContentRef} 
            className="horizontal-scroll-track"
            style={{ 
              willChange: 'transform',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
