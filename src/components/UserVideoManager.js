'use client';

import { useState, useEffect } from 'react';
import { 
    FaPlus, 
    FaSave, 
    FaTrash, 
    FaArrowLeft, 
    FaArrowRight, 
    FaVideo, 
    FaCheckCircle, 
    FaEye,
    FaEdit,
    FaPlay,
    FaYoutube
} from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Modal from '@/components/Modal';
import { saveMemorialVideos, extractYouTubeVideoId, parseYouTubeUrl } from '@/lib/api/video';

export default function UserVideoManager({ memorial, token, onSaveSuccess }) {
    const memorialId = memorial?._id || memorial?.id;

    const [videos, setVideos] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formTitle, setFormTitle] = useState('');
    const [formUrl, setFormUrl] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formError, setFormError] = useState(null);

    // Preview lightbox modal state
    const [previewVideo, setPreviewVideo] = useState(null);

    // Sync videos state when memorial prop updates
    useEffect(() => {
        if (memorial?.youtubeVideos) {
            setVideos([...memorial.youtubeVideos]);
        } else {
            setVideos([]);
        }
        setIsDirty(false);
    }, [memorial]);

    // Open Add Modal
    const handleOpenAddModal = () => {
        setEditingIndex(null);
        setFormTitle('');
        setFormUrl('');
        setFormDescription('');
        setFormError(null);
        setIsFormModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (index) => {
        const target = videos[index];
        if (!target) return;

        setEditingIndex(index);
        setFormTitle(target.title || '');
        setFormUrl(target.youtubeUrl || target.url || '');
        setFormDescription(target.description || '');
        setFormError(null);
        setIsFormModalOpen(true);
    };

    // Close Add/Edit Modal
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingIndex(null);
        setFormError(null);
    };

    // Submit Add/Edit Video Form
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        if (!formTitle.trim()) {
            setFormError('Please enter a video title.');
            return;
        }

        if (!formUrl.trim()) {
            setFormError('Please paste a YouTube URL.');
            return;
        }

        const validation = parseYouTubeUrl(formUrl);
        if (!validation.isValid) {
            setFormError(validation.error || 'Invalid YouTube URL or Video ID. Please check the URL format.');
            return;
        }

        const videoObject = {
            title: formTitle.trim(),
            youtubeUrl: formUrl.trim(),
            youtubeVideoId: validation.videoId,
            description: formDescription.trim(),
            displayOrder: editingIndex !== null ? (videos[editingIndex]?.displayOrder ?? editingIndex) : videos.length
        };

        if (editingIndex !== null) {
            // Update existing video
            setVideos(prev => {
                const updated = [...prev];
                updated[editingIndex] = { ...updated[editingIndex], ...videoObject };
                return updated;
            });
            setSuccessMessage('Video updated. Click "Save Changes" to persist.');
        } else {
            // Add new video
            setVideos(prev => [...prev, videoObject]);
            setSuccessMessage('Video added to list. Click "Save Changes" to persist.');
        }

        setIsDirty(true);
        handleCloseFormModal();
    };

    // Remove video handler
    const handleRemoveVideo = (index) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
        setIsDirty(true);
        setSuccessMessage('Video removed from list. Click "Save Changes" to persist.');
    };

    // Reorder video handler
    const handleMoveVideo = (index, direction) => {
        const targetIndex = direction === 'prev' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= videos.length) return;

        setVideos(prev => {
            const updated = [...prev];
            const temp = updated[index];
            updated[index] = updated[targetIndex];
            updated[targetIndex] = temp;
            
            // Recalculate displayOrder
            return updated.map((v, i) => ({ ...v, displayOrder: i }));
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
            const updatedMemorial = await saveMemorialVideos(memorialId, videos, token);
            setIsDirty(false);
            setSuccessMessage('YouTube videos saved successfully!');
            
            if (onSaveSuccess) {
                onSaveSuccess(updatedMemorial);
            }
        } catch (err) {
            console.error('Save error:', err);
            setError(err.response?.data?.message || 'Failed to save YouTube videos.');
        } finally {
            setSaving(false);
        }
    };

    const urlValidation = parseYouTubeUrl(formUrl);
    const currentExtractedId = urlValidation.videoId;
    const currentUrlError = formUrl ? urlValidation.error : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header & Controls Bar */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1rem',
                borderBottom: '1px solid #eedbfa',
                paddingBottom: '1rem'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#6e5c53', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaYoutube style={{ color: '#ef4444', fontSize: '1.6rem' }} /> YouTube Video Manager
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#8c7e75', fontSize: '0.88rem' }}>
                        Add, describe, preview, reorder, and organize YouTube videos for this memorial.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Add Video Button */}
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
                        disabled={saving}
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
                            cursor: saving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaPlus /> Add Video
                    </button>

                    {/* Save Changes Button */}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
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
                            cursor: saving ? 'not-allowed' : 'pointer',
                            boxShadow: isDirty ? '0 4px 14px rgba(196, 143, 149, 0.3)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaSave />
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
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

            {/* Counter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#6e5c53', fontSize: '0.95rem' }}>
                    YouTube Videos ({videos.length})
                </span>
                {isDirty && (
                    <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '600', background: '#fef3c7', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                        Unsaved Changes
                    </span>
                )}
            </div>

            {/* Empty State */}
            {videos.length === 0 && (
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
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'center',
                        fontSize: '1.8rem'
                    }}>
                        <FaVideo />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 0.35rem 0', color: '#6e5c53', fontSize: '1.1rem' }}>No YouTube videos added</h4>
                        <p style={{ margin: 0, color: '#8c7e75', fontSize: '0.88rem' }}>
                            Add YouTube video links to feature meaningful video memories on this memorial.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleOpenAddModal}
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
                        <FaPlus /> Add First Video
                    </button>
                </div>
            )}

            {/* Video Cards Grid */}
            {videos.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem'
                }}>
                    {videos.map((video, index) => {
                        const videoId = video.youtubeVideoId || extractYouTubeVideoId(video.youtubeUrl || video.url);
                        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

                        return (
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
                                    justify: 'space-between'
                                }}
                            >
                                {/* Thumbnail Container */}
                                <div 
                                    style={{ 
                                        position: 'relative', 
                                        width: '100%', 
                                        height: '165px', 
                                        backgroundColor: '#1f1924', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justify: 'center'
                                    }}
                                    onClick={() => setPreviewVideo(video)}
                                    title="Click to preview video"
                                >
                                    {thumbnailUrl ? (
                                        <img
                                            src={thumbnailUrl}
                                            alt={video.title || `Video ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <FaVideo style={{ color: '#8c7e75', fontSize: '2.5rem' }} />
                                    )}

                                    {/* Play Overlay Icon */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        background: 'rgba(239, 68, 68, 0.9)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justify: 'center',
                                        fontSize: '1.2rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        transition: 'transform 0.2s ease'
                                    }}>
                                        <FaPlay style={{ marginLeft: '3px' }} />
                                    </div>

                                    {/* Index Badge */}
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

                                    {/* Eye Badge */}
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

                                {/* Content Details */}
                                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#2d1b4e', fontWeight: '600', lineHeight: '1.3' }}>
                                        {video.title}
                                    </h4>

                                    {video.description ? (
                                        <p style={{ margin: 0, color: '#8c7e75', fontSize: '0.83rem', lineHeight: '1.4', flexGrow: 1 }}>
                                            {video.description}
                                        </p>
                                    ) : (
                                        <p style={{ margin: 0, color: '#b5a8a0', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                            No description added.
                                        </p>
                                    )}

                                    {/* Actions Bar */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', marginTop: 'auto', borderTop: '1px solid #f7f0f5' }}>
                                        {/* Reorder Arrows */}
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleMoveVideo(index, 'prev')}
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
                                                onClick={() => handleMoveVideo(index, 'next')}
                                                disabled={index === videos.length - 1}
                                                title="Move right"
                                                style={{
                                                    padding: '0.35rem 0.55rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #eedbfa',
                                                    background: index === videos.length - 1 ? '#f3f4f6' : '#faf7fd',
                                                    color: index === videos.length - 1 ? '#9ca3af' : '#c48f95',
                                                    cursor: index === videos.length - 1 ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <FaArrowRight style={{ fontSize: '0.75rem' }} />
                                            </button>
                                        </div>

                                        {/* Edit & Delete Buttons */}
                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditModal(index)}
                                                title="Edit Video"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #eedbfa',
                                                    background: '#faf7fd',
                                                    color: '#815bb5',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FaEdit style={{ fontSize: '0.75rem' }} /> Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVideo(index)}
                                                title="Delete Video"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: '#fef2f2',
                                                    color: '#ef4444',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FaTrash style={{ fontSize: '0.72rem' }} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Video Modal */}
            {isFormModalOpen && (
                <Modal
                    isOpen={isFormModalOpen}
                    onClose={handleCloseFormModal}
                    title={editingIndex !== null ? 'Edit YouTube Video' : 'Add YouTube Video'}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', padding: '0.5rem 0.5rem 1rem 0.5rem' }}>
                        {formError && <ErrorMessage message={formError} />}

                        {/* Title Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.4rem' }}>
                                Video Title *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. In Loving Memory - Celebration of Life"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleFormSubmit(e); }}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1px solid #eedbfa',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>

                        {/* YouTube URL Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.4rem' }}>
                                YouTube Video URL *
                            </label>
                            <input
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                                value={formUrl}
                                onChange={(e) => setFormUrl(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleFormSubmit(e); }}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1px solid #eedbfa',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                                required
                            />
                            {currentExtractedId ? (
                                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <FaCheckCircle /> Detected Video ID: <strong>{currentExtractedId}</strong>
                                </p>
                            ) : (
                                currentUrlError && (
                                    <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#dc2626', lineHeight: '1.4' }}>
                                        {currentUrlError}
                                    </p>
                                )
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#2d1b4e', marginBottom: '0.4rem' }}>
                                Description (Optional)
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Brief description of this video memory..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1px solid #eedbfa',
                                    fontSize: '0.9rem',
                                    resize: 'vertical',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        {/* Live Embedded Video Preview in Form */}
                        {currentExtractedId && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#8c7e75', marginBottom: '0.35rem' }}>
                                    Live Preview:
                                </label>
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${currentExtractedId}`}
                                        title="Live Preview"
                                        frameBorder="0"
                                        allowFullScreen
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={handleCloseFormModal}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '50px',
                                    border: '1px solid #eedbfa',
                                    background: 'white',
                                    color: '#6e5c53',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleFormSubmit}
                                style={{
                                    padding: '0.6rem 1.4rem',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: '#c48f95',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(196, 143, 149, 0.3)'
                                }}
                            >
                                {editingIndex !== null ? 'Update Video' : 'Add Video'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Video Lightbox Preview Modal */}
            {previewVideo && (
                <Modal 
                    isOpen={!!previewVideo} 
                    onClose={() => setPreviewVideo(null)} 
                    title={previewVideo.title || 'Video Preview'}
                >
                    <div style={{ textAlign: 'center', padding: '0.5rem 0.5rem 1.25rem 0.5rem' }}>
                        <div style={{ 
                            position: 'relative', 
                            width: '100%', 
                            aspectRatio: '16/9', 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#000'
                        }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${previewVideo.youtubeVideoId || extractYouTubeVideoId(previewVideo.youtubeUrl || previewVideo.url)}`}
                                title={previewVideo.title}
                                frameBorder="0"
                                allowFullScreen
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        {previewVideo.description && (
                            <p style={{ marginTop: '1.15rem', color: '#5c544d', fontSize: '0.98rem', lineHeight: 1.5 }}>
                                {previewVideo.description}
                            </p>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
