'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
    FaPlus, 
    FaUpload, 
    FaSave, 
    FaTrash, 
    FaArrowLeft, 
    FaArrowRight, 
    FaImages, 
    FaCheckCircle, 
    FaEye 
} from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Modal from '@/components/Modal';
import { uploadGalleryImages, saveMemorialGallery } from '@/lib/api/gallery';

export default function UserGalleryManager({ memorial, token, onSaveSuccess }) {
    const memorialId = memorial?._id || memorial?.id;
    const fileInputRef = useRef(null);

    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);

    // Sync photos state when memorial prop updates
    useEffect(() => {
        if (memorial?.galleryPhotos) {
            setPhotos([...memorial.galleryPhotos]);
        } else {
            setPhotos([]);
        }
        setIsDirty(false);
    }, [memorial]);

    // Trigger file dialog
    const handleAddPhotosClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle batch upload
    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const uploadedItems = await uploadGalleryImages(files);
            
            const newPhotos = uploadedItems.map(item => ({
                url: item.url,
                description: ''
            }));

            setPhotos(prev => [...prev, ...newPhotos]);
            setIsDirty(true);
            setSuccessMessage(`Uploaded ${uploadedItems.length} photo(s). Click "Save Changes" to apply.`);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload photos. Please try again.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // Description change handler
    const handleDescriptionChange = (index, value) => {
        setPhotos(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], description: value };
            return updated;
        });
        setIsDirty(true);
    };

    // Remove photo handler
    const handleRemovePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setIsDirty(true);
        setSuccessMessage('Photo removed. Click "Save Changes" to apply.');
    };

    // Reorder photo handler
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

    // Save changes to backend
    const handleSave = async () => {
        if (!memorialId) {
            setError('Memorial ID missing. Please save memorial basic info first.');
            return;
        }

        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updatedMemorial = await saveMemorialGallery(memorialId, photos, token);
            setIsDirty(false);
            setSuccessMessage('Gallery saved successfully!');
            
            if (onSaveSuccess) {
                onSaveSuccess(updatedMemorial);
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(err.response?.data?.message || 'Failed to save gallery changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploading || saving}
            />

            {/* Header & Controls Bar */}
            <div style={{ 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem',
                borderBottom: '1px solid #eedbfa',
                paddingBottom: '1rem'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#6e5c53', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaImages style={{ color: '#c48f95' }} /> Photo Gallery Manager
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#8c7e75', fontSize: '0.88rem' }}>
                        Add, describe, reorder, and organize photos for this memorial gallery.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Add Photos Button */}
                    <button
                        type="button"
                        onClick={handleAddPhotosClick}
                        disabled={uploading || saving}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '50px',
                            background: '#faf7fd',
                            color: '#815bb5',
                            border: '1px solid #eedbfa',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: (uploading || saving) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaPlus /> Add Photos
                    </button>

                    {/* Save Changes Button */}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || uploading}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.4rem',
                            borderRadius: '50px',
                            background: isDirty ? '#c48f95' : '#e5d7d3',
                            color: isDirty ? '#ffffff' : '#8c7e75',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                            boxShadow: isDirty ? '0 4px 14px rgba(196, 143, 149, 0.3)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaSave />
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Error Message Reuse */}
            {error && <ErrorMessage message={error} />}

            {/* Success Banner */}
            {successMessage && (
                <div style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    fontSize: '0.9rem'
                }}>
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Uploading Progress State */}
            {uploading && (
                <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: '#faf7fd',
                    border: '1px dashed #c48f95',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <LoadingSpinner />
                    <span style={{ color: '#6e5c53', fontWeight: '500', fontSize: '0.95rem' }}>
                        Uploading photos to Cloudinary... Please wait.
                    </span>
                </div>
            )}

            {/* Gallery Photos Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#6e5c53', fontSize: '0.95rem' }}>
                    Gallery Photos ({photos.length})
                </span>
                {isDirty && (
                    <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '600', background: '#fef3c7', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                        Unsaved Changes
                    </span>
                )}
            </div>

            {/* Empty Gallery State */}
            {photos.length === 0 && !uploading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: '#faf7fd',
                    borderRadius: '16px',
                    border: '2px dashed #eedbfa',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1px solid #eedbfa',
                        color: '#c48f95',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        fontSize: '1.8rem'
                    }}>
                        <FaImages />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#6e5c53', fontSize: '1.1rem' }}>Your photo gallery is empty</h4>
                        <p style={{ margin: 0, color: '#8c7e75', fontSize: '0.88rem' }}>
                            Upload photos to share cherishable memories on this memorial.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddPhotosClick}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.65rem 1.4rem',
                            borderRadius: '50px',
                            background: '#c48f95',
                            color: 'white',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            marginTop: '0.5rem'
                        }}
                    >
                        <FaUpload /> Upload Photos
                    </button>
                </div>
            ) : null}

            {/* Image Preview Grid */}
            {photos.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                borderRadius: '14px',
                                border: '1px solid #eedbfa',
                                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            {/* Image Thumbnail Container */}
                            <div 
                                style={{ position: 'relative', width: '100%', height: '165px', backgroundColor: '#faf7fd', cursor: 'pointer' }}
                                onClick={() => setPreviewPhoto(photo)}
                                title="Click to view photo preview"
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.description || `Gallery photo ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                                <span style={{
                                    position: 'absolute',
                                    top: '8px',
                                    left: '8px',
                                    background: 'rgba(45, 27, 78, 0.75)',
                                    color: 'white',
                                    padding: '0.15rem 0.55rem',
                                    borderRadius: '50px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>
                                    #{index + 1}
                                </span>
                                <span style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(255, 255, 255, 0.85)',
                                    color: '#815bb5',
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'center',
                                    fontSize: '0.75rem'
                                }}>
                                    <FaEye />
                                </span>
                            </div>

                            {/* Caption Input & Actions */}
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#8c7e75', marginBottom: '0.3rem' }}>
                                        Description:
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Add photo caption..."
                                        value={photo.description || ''}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem 0.65rem',
                                            borderRadius: '8px',
                                            border: '1px solid #eedbfa',
                                            fontSize: '0.85rem',
                                            color: '#2d1b4e',
                                            resize: 'vertical',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                {/* Actions: Reorder Arrows & Remove Button */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid #f7f0f5' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleMovePhoto(index, 'prev')}
                                            disabled={index === 0}
                                            title="Move left"
                                            style={{
                                                padding: '0.35rem 0.55rem',
                                                borderRadius: '6px',
                                                border: '1px solid #eedbfa',
                                                background: index === 0 ? '#f3f4f6' : '#faf7fd',
                                                color: index === 0 ? '#9ca3af' : '#c48f95',
                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FaArrowLeft style={{ fontSize: '0.75rem' }} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMovePhoto(index, 'next')}
                                            disabled={index === photos.length - 1}
                                            title="Move right"
                                            style={{
                                                padding: '0.35rem 0.55rem',
                                                borderRadius: '6px',
                                                border: '1px solid #eedbfa',
                                                background: index === photos.length - 1 ? '#f3f4f6' : '#faf7fd',
                                                color: index === photos.length - 1 ? '#9ca3af' : '#c48f95',
                                                cursor: index === photos.length - 1 ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <FaArrowRight style={{ fontSize: '0.75rem' }} />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#fef2f2',
                                            color: '#ef4444',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
                                    >
                                        <FaTrash style={{ fontSize: '0.72rem' }} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox Modal Preview Reuse */}
            {previewPhoto && (
                <Modal 
                    isOpen={!!previewPhoto} 
                    onClose={() => setPreviewPhoto(null)} 
                    title="Photo Preview"
                >
                    <div style={{ textAlign: 'center', padding: '0.5rem 1rem 1.5rem 1rem' }}>
                        <div style={{ 
                            position: 'relative', 
                            width: '100%', 
                            maxHeight: '65vh', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#faf7fd'
                        }}>
                            <img 
                                src={previewPhoto.url} 
                                alt={previewPhoto.description || 'Gallery Preview'}
                                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }}
                            />
                        </div>
                        {previewPhoto.description && (
                            <p style={{ marginTop: '1.25rem', color: '#5c544d', fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                                &ldquo;{previewPhoto.description}&rdquo;
                            </p>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
