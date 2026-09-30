'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
    FaUpload, 
    FaSave, 
    FaTrash, 
    FaArrowLeft, 
    FaArrowRight, 
    FaImages, 
    FaCheckCircle, 
    FaExclamationCircle,
    FaEye
} from 'react-icons/fa';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchAdminMemorials, uploadGalleryImages, saveMemorialGallery } from '@/lib/api/gallery';

export default function AdminGalleryManager({ token }) {
    const [memorials, setMemorials] = useState([]);
    const [selectedMemorialId, setSelectedMemorialId] = useState('');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    // Fetch list of all memorials
    useEffect(() => {
        let isMounted = true;
        const loadMemorials = async () => {
            try {
                setLoading(true);
                const data = await fetchAdminMemorials(token);
                if (isMounted) {
                    setMemorials(data || []);
                    if (data && data.length > 0) {
                        const firstId = data[0]._id;
                        setSelectedMemorialId(firstId);
                        setPhotos(data[0].galleryPhotos || []);
                    }
                }
            } catch (err) {
                console.error('Error fetching memorials for gallery:', err);
                if (isMounted) {
                    setMessage({ text: 'Failed to load memorials list.', type: 'error' });
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadMemorials();
        return () => { isMounted = false; };
    }, [token]);

    // Handle selecting a memorial from dropdown
    const handleSelectMemorial = (e) => {
        const id = e.target.value;
        if (isDirty) {
            if (!confirm('You have unsaved gallery changes. Switch memorial without saving?')) {
                return;
            }
        }
        setSelectedMemorialId(id);
        const selected = memorials.find(m => m._id === id);
        setPhotos(selected?.galleryPhotos ? [...selected.galleryPhotos] : []);
        setIsDirty(false);
        setMessage(null);
    };

    // Handle batch image upload
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setMessage(null);

        try {
            const uploadedItems = await uploadGalleryImages(files);
            
            const newPhotos = uploadedItems.map(item => ({
                url: item.url,
                description: ''
            }));

            setPhotos(prev => [...prev, ...newPhotos]);
            setIsDirty(true);
            setMessage({ text: `Successfully uploaded ${uploadedItems.length} image(s). Don't forget to save gallery!`, type: 'success' });
        } catch (err) {
            console.error('Upload error:', err);
            setMessage({ text: err.response?.data?.message || 'Failed to upload images. Please try again.', type: 'error' });
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    // Update photo description
    const handleDescriptionChange = (index, value) => {
        setPhotos(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], description: value };
            return updated;
        });
        setIsDirty(true);
    };

    // Remove photo from gallery
    const handleRemovePhoto = (index) => {
        if (!confirm('Remove this photo from the gallery list?')) return;

        setPhotos(prev => prev.filter((_, i) => i !== index));
        setIsDirty(true);
        setMessage({ text: 'Photo removed from list. Click "Save Gallery" to persist changes.', type: 'success' });
    };

    // Reorder photos (move left/right in array)
    const handleMovePhoto = (index, direction) => {
        const targetIndex = direction === 'prev' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= photos.length) return;

        setPhotos(prev => {
            const updated = [...prev];
            const temp = updated[index];
            updated[index] = updated[targetIndex];
            updated[targetIndex] = temp;
            return updated;
        });
        setIsDirty(true);
    };

    // Save gallery to backend
    const handleSave = async () => {
        if (!selectedMemorialId) return;

        setSaving(true);
        setMessage(null);

        try {
            const updatedMemorial = await saveMemorialGallery(selectedMemorialId, photos, token);
            
            // Update local state memorials list
            setMemorials(prev => prev.map(m => {
                if (m._id === selectedMemorialId) {
                    return { ...m, galleryPhotos: updatedMemorial.galleryPhotos || photos };
                }
                return m;
            }));

            setIsDirty(false);
            setMessage({ text: 'Gallery saved successfully!', type: 'success' });
        } catch (err) {
            console.error('Save error:', err);
            setMessage({ text: err.response?.data?.message || 'Failed to save gallery changes.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const currentMemorial = memorials.find(m => m._id === selectedMemorialId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaImages style={{ color: '#815bb5' }} /> Gallery Management
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#665e75', fontSize: '0.95rem' }}>
                        Manage, upload, reorder, and describe photos for any memorial.
                    </p>
                </div>

                {/* Save Button */}
                {selectedMemorialId && (
                    <button
                        onClick={handleSave}
                        disabled={saving || uploading}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.75rem',
                            borderRadius: '50px',
                            background: isDirty ? 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)' : '#e2d5f3',
                            color: isDirty ? '#ffffff' : '#665e75',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                            boxShadow: isDirty ? '0 4px 14px rgba(129, 91, 181, 0.3)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaSave />
                        {saving ? 'Saving Gallery...' : 'Save Gallery'}
                    </button>
                )}
            </div>

            {/* Notification Banner */}
            {message && (
                <div style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: message.type === 'success' ? '#d1fae5' : '#fef2f2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
                    fontSize: '0.95rem'
                }}>
                    {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                    <span>{message.text}</span>
                </div>
            )}

            {/* Memorial Selector Bar */}
            <div style={{
                background: '#faf7fd',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #eedbfa',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '280px' }}>
                    <label htmlFor="memorial-select" style={{ fontWeight: '600', color: '#3d2556', whiteSpace: 'nowrap' }}>
                        Select Memorial:
                    </label>
                    <select
                        id="memorial-select"
                        value={selectedMemorialId}
                        onChange={handleSelectMemorial}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid #d4bfe8',
                            background: 'white',
                            color: '#2d1b4e',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {memorials.length === 0 ? (
                            <option value="">No memorials found</option>
                        ) : (
                            memorials.map(m => (
                                <option key={m._id} value={m._id}>
                                    {m.firstName} {m.lastName} ({m.galleryPhotos?.length || 0} photos)
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {currentMemorial && (
                    <Link
                        href={`/memorial/${currentMemorial._id}`}
                        target="_blank"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#815bb5',
                            textDecoration: 'none',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                        }}
                    >
                        <FaEye /> View Public Memorial
                    </Link>
                )}
            </div>

            {/* Main Editor Section */}
            {selectedMemorialId ? (
                <div>
                    {/* Batch Upload Dropzone Card */}
                    <div style={{
                        border: '2px dashed #cbb2eb',
                        borderRadius: '16px',
                        padding: '2.5rem 1.5rem',
                        textAlign: 'center',
                        background: '#fdfbfe',
                        marginBottom: '2rem',
                        transition: 'all 0.2s ease'
                    }}>
                        <input
                            type="file"
                            id="gallery-file-input"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            disabled={uploading}
                        />
                        <label
                            htmlFor="gallery-file-input"
                            style={{
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: '#faf7fd',
                                border: '1px solid #eedbfa',
                                color: '#815bb5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                <FaUpload />
                            </div>
                            <div>
                                <span style={{ fontWeight: '600', color: '#2d1b4e', fontSize: '1.05rem', display: 'block' }}>
                                    {uploading ? 'Uploading images to Cloudinary...' : 'Click to Upload Photos'}
                                </span>
                                <span style={{ color: '#665e75', fontSize: '0.85rem' }}>
                                    Supports multiple JPEG, PNG, WEBP files
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Photos Count & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ margin: 0, color: '#3d2556', fontSize: '1.2rem', fontFamily: 'serif' }}>
                            Gallery Photos ({photos.length})
                        </h3>
                        {isDirty && (
                            <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: '600', background: '#fef3c7', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
                                Unsaved Changes
                            </span>
                        )}
                    </div>

                    {/* Gallery Photos Grid */}
                    {photos.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            background: '#faf7fd',
                            borderRadius: '16px',
                            border: '1px solid #eedbfa',
                            color: '#665e75'
                        }}>
                            <FaImages style={{ fontSize: '2.5rem', color: '#cbb2eb', marginBottom: '1rem' }} />
                            <p style={{ margin: 0 }}>No photos in this gallery yet. Upload some images above!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #eedbfa',
                                        boxShadow: '0 4px 16px rgba(129, 91, 181, 0.06)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                    }}
                                >
                                    {/* Image Thumbnail Container */}
                                    <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#faf7fd' }}>
                                        <Image
                                            src={photo.url}
                                            alt={photo.description || `Gallery photo ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            unoptimized
                                        />
                                        
                                        {/* Order Badge */}
                                        <span style={{
                                            position: 'absolute',
                                            top: '10px',
                                            left: '10px',
                                            background: 'rgba(45, 27, 78, 0.75)',
                                            color: 'white',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            #{index + 1}
                                        </span>
                                    </div>

                                    {/* Description Input & Actions */}
                                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'space-between' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#665e75', marginBottom: '0.4rem' }}>
                                                Description:
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="Enter photo memory / caption..."
                                                value={photo.description || ''}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.6rem 0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2d5f3',
                                                    fontSize: '0.88rem',
                                                    color: '#2d1b4e',
                                                    resize: 'vertical',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>

                                        {/* Card Actions (Reorder & Remove) */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f3eafb' }}>
                                            {/* Reorder Arrows */}
                                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMovePhoto(index, 'prev')}
                                                    disabled={index === 0}
                                                    title="Move earlier"
                                                    style={{
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e2d5f3',
                                                        background: index === 0 ? '#f3f4f6' : '#faf7fd',
                                                        color: index === 0 ? '#9ca3af' : '#815bb5',
                                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <FaArrowLeft style={{ fontSize: '0.8rem' }} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleMovePhoto(index, 'next')}
                                                    disabled={index === photos.length - 1}
                                                    title="Move later"
                                                    style={{
                                                        padding: '0.4rem 0.6rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e2d5f3',
                                                        background: index === photos.length - 1 ? '#f3f4f6' : '#faf7fd',
                                                        color: index === photos.length - 1 ? '#9ca3af' : '#815bb5',
                                                        cursor: index === photos.length - 1 ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(index)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: '#fef2f2',
                                                    color: '#ef4444',
                                                    fontSize: '0.82rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                            >
                                                <FaTrash style={{ fontSize: '0.75rem' }} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
