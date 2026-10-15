'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ isOpen, onClose, children, title, maxWidth = '540px' }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    onClose?.();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div 
            className="modal-overlay modal active" 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(15, 10, 25, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                boxSizing: 'border-box'
            }}
        >
            <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: maxWidth,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 60px rgba(45, 27, 78, 0.35)',
                    border: '1px solid #eedbfa',
                    overflow: 'hidden',
                    position: 'relative',
                    animation: 'slideIn 0.25s ease-out',
                    margin: 'auto',
                    padding: 0
                }}
            >
                <div 
                    className="modal-header" 
                    style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #f3e8ff',
                        background: '#faf7fd',
                        flexShrink: 0
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2d1b4e', fontFamily: 'serif', fontWeight: '700' }}>
                        {title}
                    </h2>
                    <button 
                        className="modal-close" 
                        onClick={onClose} 
                        aria-label="Close modal"
                        style={{ 
                            position: 'static', 
                            flexShrink: 0,
                            background: '#ffffff',
                            border: '1px solid #eedbfa',
                            borderRadius: '50%',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#6c43a6',
                            transition: 'all 0.2s ease',
                            padding: 0
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#eedbfa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
                <div 
                    className="modal-body"
                    style={{
                        padding: '1.5rem',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        flex: 1
                    }}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
