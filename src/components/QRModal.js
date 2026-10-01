'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { FaDownload, FaPrint, FaFileCode } from 'react-icons/fa';
import Modal from '@/components/Modal';

export default function QRModal({
    isOpen,
    onClose,
    memorialName = '',
    memorialUrl = ''
}) {
    const [downloading, setDownloading] = useState(false);

    if (!isOpen || !memorialUrl) return null;

    const sanitizedFilename = (memorialName || 'memorial')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_') + '_qr';

    // Download QR Code as high-resolution PNG (1024x1024)
    const handleDownloadPNG = () => {
        setDownloading(true);
        try {
            const svg = document.querySelector('#printable-qr-container svg');
            if (!svg) {
                alert('QR code element not found.');
                setDownloading(false);
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new window.Image();

            canvas.width = 1024;
            canvas.height = 1024;

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 1024, 1024);
                URL.revokeObjectURL(url);

                const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const a = document.createElement('a');
                a.download = `${sanitizedFilename}.png`;
                a.href = imgURI;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setDownloading(false);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                alert('Failed to generate PNG image');
                setDownloading(false);
            };

            img.src = url;
        } catch (err) {
            console.error('PNG Download error:', err);
            alert('Failed to download QR code');
            setDownloading(false);
        }
    };

    // Download QR Code as clean vector SVG
    const handleDownloadSVG = () => {
        try {
            const svg = document.querySelector('#printable-qr-container svg');
            if (!svg) {
                alert('QR code element not found.');
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            const a = document.createElement('a');
            a.download = `${sanitizedFilename}.svg`;
            a.href = svgUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(svgUrl);
        } catch (err) {
            console.error('SVG Download error:', err);
            alert('Failed to download SVG');
        }
    };

    // Print ONLY the QR section with Memorial Name and Memorial URL
    const handlePrint = () => {
        const svgElement = document.querySelector('#printable-qr-container svg');
        const svgHtml = svgElement ? new XMLSerializer().serializeToString(svgElement) : '';

        const printWindow = window.open('', '_blank', 'width=800,height=850');
        if (!printWindow) {
            alert('Please allow popups to print the QR code.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print QR Code - ${memorialName || 'Memorial'}</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        margin: 0;
                        padding: 40px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #ffffff;
                        color: #2d1b4e;
                        box-sizing: border-box;
                    }
                    .qr-print-card {
                        border: 2px solid #eedbfa;
                        border-radius: 24px;
                        padding: 40px;
                        max-width: 480px;
                        width: 100%;
                        text-align: center;
                        box-sizing: border-box;
                    }
                    h1 {
                        font-size: 24px;
                        margin: 0 0 8px 0;
                        color: #2d1b4e;
                    }
                    p.subtitle {
                        font-size: 14px;
                        color: #665e75;
                        margin: 0 0 24px 0;
                    }
                    .qr-frame {
                        background: #ffffff;
                        padding: 16px;
                        display: inline-block;
                        border-radius: 16px;
                        border: 1px solid #eedbfa;
                        margin-bottom: 20px;
                    }
                    .qr-frame svg {
                        width: 256px !important;
                        height: 256px !important;
                        display: block;
                    }
                    .memorial-url {
                        font-size: 14px;
                        color: #815bb5;
                        word-break: break-all;
                        font-family: 'Courier New', monospace;
                        margin-top: 10px;
                    }
                    @media print {
                        body { padding: 0; min-height: auto; }
                        .qr-print-card { border: none; padding: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="qr-print-card">
                    <h1>${memorialName ? `In Loving Memory of ${memorialName}` : 'Memorial QR Code'}</h1>
                    <p class="subtitle">Scan to visit the online memorial site</p>
                    <div class="qr-frame">
                        ${svgHtml}
                    </div>
                    <div class="memorial-url">${memorialUrl}</div>
                </div>
                <script>
                    window.onload = function() {
                        window.focus();
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={memorialName ? `${memorialName} - QR Code` : 'Memorial QR Code'}>
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem 1rem 1rem' }}>
                
                {/* Printable QR Container */}
                <div id="printable-qr-container" style={{ textAlign: 'center' }}>
                    {memorialName && (
                        <h3 style={{ fontSize: '1.25rem', color: '#2d1b4e', fontFamily: 'serif', margin: '0 0 0.5rem 0' }}>
                            {memorialName}
                        </h3>
                    )}
                    <div style={{
                        background: 'white',
                        padding: '1.25rem',
                        display: 'inline-block',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid #eedbfa',
                        marginBottom: '1.25rem'
                    }}>
                        <QRCode value={memorialUrl} size={240} />
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#665e75', fontSize: '0.9rem' }}>
                        Scan to visit this memorial page.
                    </p>
                    <a
                        href={memorialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'block', color: '#815bb5', wordBreak: 'break-all', fontSize: '0.9rem', marginBottom: '1.75rem', fontWeight: '500' }}
                    >
                        {memorialUrl}
                    </a>
                </div>

                {/* Actions Bar */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    borderTop: '1px solid #eedbfa',
                    paddingTop: '1.25rem'
                }}>
                    <button
                        type="button"
                        onClick={handleDownloadPNG}
                        disabled={downloading}
                        style={{
                            flex: '1 1 140px',
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: downloading ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(61, 37, 86, 0.15)',
                            transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                        <FaDownload /> {downloading ? 'Exporting...' : 'Download PNG'}
                    </button>

                    <button
                        type="button"
                        onClick={handleDownloadSVG}
                        style={{
                            flex: '1 1 120px',
                            background: '#faf7fd',
                            color: '#6c43a6',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid #eedbfa',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#eedbfa'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#faf7fd'; }}
                    >
                        <FaFileCode /> SVG
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        style={{
                            flex: '1 1 130px',
                            background: '#10b981',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                            transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                        <FaPrint /> Print QR
                    </button>
                </div>
            </div>
        </Modal>
    );
}
