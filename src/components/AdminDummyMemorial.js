'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaUpload, FaEye, FaPlus, FaTrash, FaQrcode, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import QRCode from 'react-qr-code';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

export default function AdminDummyMemorial({ token }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);
    const [demoUrl, setDemoUrl] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        deathDate: '',
        profilePicture: '',
        coverPicture: '',
        biography: '',
        lifeSummary: '',
        memorialQuote: '',
        achievements: '',
        profession: '',
        website: '',
        youtubeVideos: [],
        galleryPhotos: [],
        familyMembers: [],
        lifeEvents: [],
        cemeteryName: '',
        graveLocation: '',
        latitude: null,
        longitude: null
    });

    useEffect(() => {
        const fetchDummyMemorial = async () => {
            try {
                if (typeof window !== 'undefined') {
                    setDemoUrl(`${window.location.origin}/demo`);
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await axios.get('/api/admin/dummy-memorial', config);
                const data = res.data.data;
                
                if (data) {
                    const formatDate = (dateString) => {
                        if (!dateString) return '';
                        return new Date(dateString).toISOString().split('T')[0];
                    };

                    setFormData({
                        ...data,
                        birthDate: formatDate(data.birthDate),
                        deathDate: formatDate(data.deathDate),
                        youtubeVideos: data.youtubeVideos || [],
                        galleryPhotos: data.galleryPhotos || [],
                        familyMembers: (data.familyMembers || []).map(member => ({
                            id: member.id || ('fm_' + Math.random().toString(36).substring(2, 9)),
                            name: member.name || '',
                            relationship: member.relationship || '',
                            dates: member.dates || '',
                            gender: member.gender || '',
                            avatarUrl: member.avatarUrl || '',
                            parentIds: Array.isArray(member.parentIds) ? member.parentIds : [],
                            spouseIds: Array.isArray(member.spouseIds) ? member.spouseIds : [],
                            generation: typeof member.generation === 'number' ? member.generation : 0,
                            memorialRefId: member.memorialRefId || '',
                            bio: member.bio || ''
                        })),
                        lifeEvents: (data.lifeEvents || []).map(event => ({
                            ...event,
                            date: formatDate(event.date)
                        }))
                    });
                }
            } catch (err) {
                console.error('Error fetching dummy memorial:', err);
                setMessage('Failed to load dummy memorial');
            } finally {
                setLoading(false);
            }
        };

        fetchDummyMemorial();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await axios.post('/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setFormData(prev => ({
                ...prev,
                [field]: res.data.url
            }));
            setMessage(`${field === 'profilePicture' ? 'Profile' : 'Cover'} picture uploaded successfully`);
        } catch (err) {
            console.error('Upload error:', err);
            setMessage('Failed to upload image');
        } finally {
            setUploading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleMemberAvatarUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await axios.post('/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = res.data.data?.url || res.data.url;
            updateFamilyMember(index, 'avatarUrl', url);
            setMessage('Family member image uploaded successfully');
        } catch (err) {
            console.error('Upload error:', err);
            setMessage('Failed to upload family member image');
        } finally {
            setUploading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const addFamilyMember = () => {
        const newMember = {
            id: 'fm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            name: '',
            relationship: '',
            dates: '',
            gender: '',
            avatarUrl: '',
            parentIds: [],
            spouseIds: [],
            generation: 0,
            memorialRefId: '',
            bio: ''
        };
        setFormData(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, newMember]
        }));
    };

    const removeFamilyMember = (index) => {
        const memberToRemove = formData.familyMembers[index];
        const removedId = memberToRemove?.id;

        const updated = formData.familyMembers
            .filter((_, i) => i !== index)
            .map(member => ({
                ...member,
                parentIds: (member.parentIds || []).filter(pid => pid !== removedId),
                spouseIds: (member.spouseIds || []).filter(sid => sid !== removedId)
            }));

        setFormData({ ...formData, familyMembers: updated });
    };

    const updateFamilyMember = (index, field, value) => {
        const updated = [...formData.familyMembers];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setFormData({ ...formData, familyMembers: updated });
    };

    const isDescendant = (candidateId, targetId, members = formData.familyMembers) => {
        if (candidateId === targetId) return true;
        const children = members.filter(m => (m.parentIds || []).includes(candidateId));
        for (const child of children) {
            if (child.id === targetId || isDescendant(child.id, targetId, members)) {
                return true;
            }
        }
        return false;
    };

    const addParent = (memberIndex, parentIdToAdd) => {
        if (!parentIdToAdd) return;
        const currentMember = formData.familyMembers[memberIndex];
        if (!currentMember || parentIdToAdd === currentMember.id) return;

        if (isDescendant(currentMember.id, parentIdToAdd, formData.familyMembers)) {
            alert('Cannot select a descendant as a parent (circular lineage loop)');
            return;
        }

        const updated = [...formData.familyMembers];
        const currentParentIds = updated[memberIndex].parentIds || [];

        if (!currentParentIds.includes(parentIdToAdd)) {
            updated[memberIndex] = {
                ...updated[memberIndex],
                parentIds: [...currentParentIds, parentIdToAdd]
            };
            setFormData({ ...formData, familyMembers: updated });
        }
    };

    const removeParent = (memberIndex, parentIdToRemove) => {
        const updated = [...formData.familyMembers];
        const currentParentIds = updated[memberIndex].parentIds || [];
        updated[memberIndex] = {
            ...updated[memberIndex],
            parentIds: currentParentIds.filter(id => id !== parentIdToRemove)
        };
        setFormData({ ...formData, familyMembers: updated });
    };

    const addSpouse = (memberIndex, spouseIdToAdd) => {
        if (!spouseIdToAdd) return;
        const currentMember = formData.familyMembers[memberIndex];
        if (!currentMember || spouseIdToAdd === currentMember.id) return;

        const updated = formData.familyMembers.map(m => ({ ...m, spouseIds: [...(m.spouseIds || [])] }));
        const targetMember = updated[memberIndex];
        const spouseMember = updated.find(m => m.id === spouseIdToAdd);

        if (targetMember && !targetMember.spouseIds.includes(spouseIdToAdd)) {
            targetMember.spouseIds.push(spouseIdToAdd);
        }

        if (spouseMember && !spouseMember.spouseIds.includes(targetMember.id)) {
            spouseMember.spouseIds.push(targetMember.id);
        }

        setFormData({ ...formData, familyMembers: updated });
    };

    const removeSpouse = (memberIndex, spouseIdToRemove) => {
        const currentMember = formData.familyMembers[memberIndex];
        if (!currentMember) return;

        const updated = formData.familyMembers.map(m => {
            if (m.id === currentMember.id) {
                return { ...m, spouseIds: (m.spouseIds || []).filter(id => id !== spouseIdToRemove) };
            }
            if (m.id === spouseIdToRemove) {
                return { ...m, spouseIds: (m.spouseIds || []).filter(id => id !== currentMember.id) };
            }
            return m;
        });

        setFormData({ ...formData, familyMembers: updated });
    };

    const addChild = (memberIndex, childIdToAdd) => {
        if (!childIdToAdd) return;
        const currentMember = formData.familyMembers[memberIndex];
        if (!currentMember || childIdToAdd === currentMember.id) return;

        if (isDescendant(childIdToAdd, currentMember.id, formData.familyMembers)) {
            alert('Cannot select an ancestor as a child (circular lineage loop)');
            return;
        }

        const updated = formData.familyMembers.map(m => {
            if (m.id === childIdToAdd) {
                const pIds = m.parentIds || [];
                if (!pIds.includes(currentMember.id)) {
                    return { ...m, parentIds: [...pIds, currentMember.id] };
                }
            }
            return m;
        });

        setFormData({ ...formData, familyMembers: updated });
    };

    const removeChild = (memberIndex, childIdToRemove) => {
        const currentMember = formData.familyMembers[memberIndex];
        if (!currentMember) return;

        const updated = formData.familyMembers.map(m => {
            if (m.id === childIdToRemove) {
                return { ...m, parentIds: (m.parentIds || []).filter(id => id !== currentMember.id) };
            }
            return m;
        });

        setFormData({ ...formData, familyMembers: updated });
    };

    const addLifeEvent = () => {
        setFormData({
            ...formData,
            lifeEvents: [...formData.lifeEvents, { title: '', date: '', description: '' }]
        });
    };

    const removeLifeEvent = (index) => {
        const updated = formData.lifeEvents.filter((_, i) => i !== index);
        setFormData({ ...formData, lifeEvents: updated });
    };

    const updateLifeEvent = (index, field, value) => {
        const updated = [...formData.lifeEvents];
        updated[index][field] = value;
        setFormData({ ...formData, lifeEvents: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.birthDate || !formData.deathDate) {
            alert('Please fill in both birth and death dates');
            return;
        }

        const sanitizedFormData = {
            ...formData,
            lifeEvents: formData.lifeEvents.map(event => {
                if (!event.date) {
                    const { date, ...rest } = event;
                    return rest;
                }
                return event;
            })
        };

        setSaving(true);
        setMessage('');

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put('/api/admin/dummy-memorial', sanitizedFormData, config);
            setMessage('Dummy memorial saved successfully');
        } catch (err) {
            console.error('Error saving dummy memorial:', err);
            setMessage('Failed to save dummy memorial');
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#2d1b4e', fontFamily: 'serif', margin: 0 }}>Dummy Memorial</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowQRModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', color: '#0369a1', padding: '0.5rem 1rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                        <FaQrcode /> Show QR Code
                    </button>
                    <Link href="/demo" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3e8ff', color: '#7e22ce', padding: '0.5rem 1rem', borderRadius: '50px', textDecoration: 'none', fontWeight: '500' }}>
                        <FaEye /> View Demo
                    </Link>
                </div>
            </div>
            
            <p style={{ color: '#665e75', marginBottom: '2rem' }}>Configure the public demo memorial that users can view.</p>

            {message && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', background: message.includes('Failed') ? '#fee2e2' : '#d1fae5', color: message.includes('Failed') ? '#ef4444' : '#059669', borderRadius: '8px', textAlign: 'center' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#3d2556' }}>Basic Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>First Name *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Last Name *</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Birth Date *</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Death Date *</label>
                            <input type="date" name="deathDate" value={formData.deathDate} onChange={handleChange} required className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Profession</label>
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Website</label>
                            <input type="url" name="website" value={formData.website} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                    </div>
                </div>

                {/* Resting Place */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#3d2556' }}>Resting Place</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Cemetery Name</label>
                            <input type="text" name="cemeteryName" value={formData.cemeteryName || ''} onChange={handleChange} placeholder="e.g. Greenwood Cemetery" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Grave Location</label>
                            <input type="text" name="graveLocation" value={formData.graveLocation || ''} onChange={handleChange} placeholder="e.g. Plot 42, Section B (or search map below)" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Pinpoint Location on Map</label>
                        <LocationPicker
                            initialLocation={formData.graveLocation}
                            initialLat={formData.latitude}
                            initialLng={formData.longitude}
                            onChange={(loc) => {
                                setFormData(prev => ({
                                    ...prev,
                                    graveLocation: loc.name,
                                    latitude: loc.latitude,
                                    longitude: loc.longitude
                                }));
                            }}
                        />
                    </div>
                </div>

                {/* Photos */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#3d2556' }}>Photos</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Profile Picture</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profilePicture')} />
                            {formData.profilePicture && (
                                <Image
                                    src={formData.profilePicture}
                                    alt="Profile"
                                    width={100}
                                    height={100}
                                    unoptimized
                                    style={{ width: '100px', height: 'auto', marginTop: '0.5rem', borderRadius: '8px' }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Cover Picture</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverPicture')} />
                            {formData.coverPicture && (
                                <Image
                                    src={formData.coverPicture}
                                    alt="Cover"
                                    width={200}
                                    height={112}
                                    unoptimized
                                    style={{ width: '200px', height: 'auto', marginTop: '0.5rem', borderRadius: '8px' }}
                                />
                            )}
                        </div>
                    </div>
                    {uploading && <p>Uploading...</p>}
                </div>

                {/* Biography */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#3d2556' }}>Story</h2>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Biography</label>
                        <textarea name="biography" value={formData.biography} onChange={handleChange} rows={5} placeholder="Share the story of their life..." className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Life Summary</label>
                        <textarea name="lifeSummary" value={formData.lifeSummary} onChange={handleChange} rows={3} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Achievements</label>
                        <textarea name="achievements" value={formData.achievements} onChange={handleChange} rows={3} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                    </div>
                </div>

                {/* Family Members */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#3d2556' }}>Family Lineage & Members</h2>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#665e75', fontSize: '0.9rem' }}>
                                Configure family members for the demo memorial.
                            </p>
                        </div>
                        <button type="button" onClick={addFamilyMember} style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', background: '#f3e8ff', color: '#7e22ce', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                            <FaPlus /> Add Family Member
                        </button>
                    </div>

                    {formData.familyMembers.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: '#faf7fd', borderRadius: '12px', border: '1px dashed #eedbfa' }}>
                            <p style={{ margin: 0, color: '#665e75' }}>No family members added yet. Click &quot;Add Family Member&quot; above to start building the demo tree.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {formData.familyMembers.map((member, i) => {
                                const derivedChildren = formData.familyMembers.filter(m => (m.parentIds || []).includes(member.id));

                                return (
                                    <div 
                                        key={member.id || i} 
                                        style={{ 
                                            background: '#faf7fd', 
                                            padding: '1.5rem', 
                                            borderRadius: '12px', 
                                            border: '1px solid #eedbfa' 
                                        }}
                                    >
                                        {/* Header of member card */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eedbfa', paddingBottom: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.name || 'Member'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#815bb5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        {member.name ? member.name.charAt(0).toUpperCase() : (i + 1)}
                                                    </div>
                                                )}
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d1b4e' }}>
                                                    {member.name || `Member #${i + 1}`} {member.relationship ? `(${member.relationship})` : ''}
                                                </h3>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeFamilyMember(i)} 
                                                style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
                                                title="Remove Member"
                                            >
                                                <FaTrash /> Remove
                                            </button>
                                        </div>

                                        {/* Grid fields */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                            {/* Name */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Name *</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Full Name" 
                                                    value={member.name || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'name', e.target.value)} 
                                                    className="form-input"
                                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                />
                                            </div>

                                            {/* Relationship */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Relationship</label>
                                                <select 
                                                    value={member.relationship || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'relationship', e.target.value)}
                                                    className="form-input"
                                                    style={{ width: '100%', height: '38px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                >
                                                    <option value="">Select Relationship</option>
                                                    <option value="Spouse">Spouse</option>
                                                    <option value="Partner">Partner</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Father">Father</option>
                                                    <option value="Daughter">Daughter</option>
                                                    <option value="Son">Son</option>
                                                    <option value="Sister">Sister</option>
                                                    <option value="Brother">Brother</option>
                                                    <option value="Grandmother">Grandmother</option>
                                                    <option value="Grandfather">Grandfather</option>
                                                    <option value="Granddaughter">Granddaughter</option>
                                                    <option value="Grandson">Grandson</option>
                                                    <option value="Aunt">Aunt</option>
                                                    <option value="Uncle">Uncle</option>
                                                    <option value="Niece">Niece</option>
                                                    <option value="Nephew">Nephew</option>
                                                    <option value="Cousin">Cousin</option>
                                                    <option value="Friend">Friend</option>
                                                    <option value="Colleague">Colleague</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            {/* Dates */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Dates (e.g. 1950 - 2020)</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="1950 - 2020" 
                                                    value={member.dates || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'dates', e.target.value)} 
                                                    className="form-input"
                                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Gender</label>
                                                <select 
                                                    value={member.gender || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'gender', e.target.value)}
                                                    className="form-input"
                                                    style={{ width: '100%', height: '38px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            {/* Generation */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Generation Level</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="0 (Root), -1 (Parent), 1 (Child)" 
                                                    value={member.generation !== undefined ? member.generation : 0} 
                                                    onChange={(e) => updateFamilyMember(i, 'generation', parseInt(e.target.value, 10) || 0)} 
                                                    className="form-input"
                                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                />
                                            </div>

                                            {/* Profile Image / Avatar */}
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Profile Photo / Avatar</label>
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleMemberAvatarUpload(e, i)} 
                                                    style={{ fontSize: '0.85rem' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Relationships Section (Parents, Spouse, Children) */}
                                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #eedbfa', marginBottom: '1rem' }}>
                                            <h4 style={{ margin: '0 0 1rem 0', color: '#2d1b4e', fontSize: '0.95rem', fontWeight: '600' }}>
                                                Family Relationships
                                            </h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                                                
                                                {/* PARENTS SELECTOR */}
                                                <div>
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                        Parents
                                                    </label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: (member.parentIds || []).length > 0 ? '0.5rem' : '0.4rem' }}>
                                                        {(member.parentIds || []).map(pid => {
                                                            const parentObj = formData.familyMembers.find(m => m.id === pid);
                                                            return (
                                                                <span key={pid} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f3e8ff', color: '#7e22ce', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                    {parentObj ? (parentObj.name || 'Unnamed Parent') : 'Parent'}
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => removeParent(i, pid)} 
                                                                        style={{ background: 'none', border: 'none', color: '#7e22ce', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
                                                                        title="Remove Parent"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <select 
                                                        value=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                addParent(i, e.target.value);
                                                            }
                                                        }}
                                                        className="form-input"
                                                        style={{ width: '100%', height: '38px', fontSize: '0.85rem', padding: '0.4rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                    >
                                                        <option value="">[ Select parent ]</option>
                                                        {formData.familyMembers
                                                            .filter(other => 
                                                                other.id !== member.id && 
                                                                !(member.parentIds || []).includes(other.id) &&
                                                                !isDescendant(member.id, other.id, formData.familyMembers)
                                                            )
                                                            .map(other => (
                                                                <option key={other.id} value={other.id}>
                                                                    {other.name || 'Unnamed Member'} {other.relationship ? `(${other.relationship})` : ''}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                {/* SPOUSE SELECTOR */}
                                                <div>
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                        Spouse / Partner
                                                    </label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: (member.spouseIds || []).length > 0 ? '0.5rem' : '0.4rem' }}>
                                                        {(member.spouseIds || []).map(sid => {
                                                            const spouseObj = formData.familyMembers.find(m => m.id === sid);
                                                            return (
                                                                <span key={sid} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fce7f3', color: '#be185d', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                    {spouseObj ? (spouseObj.name || 'Unnamed Spouse') : 'Spouse'}
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => removeSpouse(i, sid)} 
                                                                        style={{ background: 'none', border: 'none', color: '#be185d', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
                                                                        title="Remove Spouse"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                    <select 
                                                        value=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                addSpouse(i, e.target.value);
                                                            }
                                                        }}
                                                        className="form-input"
                                                        style={{ width: '100%', height: '38px', fontSize: '0.85rem', padding: '0.4rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                    >
                                                        <option value="">[ Select spouse ]</option>
                                                        {formData.familyMembers
                                                            .filter(other => 
                                                                other.id !== member.id && 
                                                                !(member.spouseIds || []).includes(other.id)
                                                            )
                                                            .map(other => (
                                                                <option key={other.id} value={other.id}>
                                                                    {other.name || 'Unnamed Member'} {other.relationship ? `(${other.relationship})` : ''}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                {/* CHILDREN (DERIVED AUTOMATICALLY) */}
                                                <div>
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                        Children <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#665e75' }}>(Derived automatically)</span>
                                                    </label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: derivedChildren.length > 0 ? '0.5rem' : '0.4rem' }}>
                                                        {derivedChildren.length === 0 ? (
                                                            <span style={{ fontSize: '0.8rem', color: '#a39c95', fontStyle: 'italic' }}>No children derived yet.</span>
                                                        ) : (
                                                            derivedChildren.map(childObj => (
                                                                <span key={childObj.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                    {childObj.name || 'Unnamed Child'}
                                                                    <button 
                                                                        type="button" 
                                                                        onClick={() => removeChild(i, childObj.id)} 
                                                                        style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
                                                                        title="Remove Child Link"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                    <select 
                                                        value=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                addChild(i, e.target.value);
                                                            }
                                                        }}
                                                        className="form-input"
                                                        style={{ width: '100%', height: '38px', fontSize: '0.85rem', padding: '0.4rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                    >
                                                        <option value="">[ Select child to add ]</option>
                                                        {formData.familyMembers
                                                            .filter(other => 
                                                                other.id !== member.id && 
                                                                !(other.parentIds || []).includes(member.id) &&
                                                                !isDescendant(other.id, member.id, formData.familyMembers)
                                                            )
                                                            .map(other => (
                                                                <option key={other.id} value={other.id}>
                                                                    {other.name || 'Unnamed Member'} {other.relationship ? `(${other.relationship})` : ''}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                            </div>
                                        </div>

                                        {/* Biography & Memorial Reference */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Biography / Note</label>
                                                <textarea 
                                                    rows={2} 
                                                    placeholder="Brief story or memory about this family member..." 
                                                    value={member.bio || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'bio', e.target.value)} 
                                                    className="form-input"
                                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#3d2556', marginBottom: '0.4rem' }}>Linked Memorial ID (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="If this member has their own memorial, enter ID here" 
                                                    value={member.memorialRefId || ''} 
                                                    onChange={(e) => updateFamilyMember(i, 'memorialRefId', e.target.value)} 
                                                    className="form-input"
                                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #eedbfa' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Life Events */}
                <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eedbfa' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#3d2556' }}>Life Events</h2>
                    {formData.lifeEvents.map((event, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Title</label>
                                <input type="text" value={event.title} onChange={(e) => updateLifeEvent(i, 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                            </div>
                            <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Date</label>
                                <input type="date" value={event.date} onChange={(e) => updateLifeEvent(i, 'date', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                            </div>
                            <div className="form-group" style={{ flex: 2, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#3d2556', fontWeight: '500' }}>Description</label>
                                <input type="text" value={event.description} onChange={(e) => updateLifeEvent(i, 'description', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eedbfa' }} />
                            </div>
                            <button type="button" onClick={() => removeLifeEvent(i)} style={{ padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}>
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addLifeEvent} style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', border: 'none', background: '#f3e8ff', color: '#7e22ce', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                        <FaPlus /> Add Life Event
                    </button>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        style={{
                            background: 'linear-gradient(135deg, #815bb5 0%, #3d2556 100%)',
                            color: 'white',
                            padding: '1rem 2rem',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            boxShadow: '0 4px 15px rgba(129, 91, 181, 0.3)',
                            transition: 'transform 0.2s, boxShadow 0.2s'
                        }}
                    >
                        <FaSave /> {saving ? 'Saving...' : 'Save Dummy Memorial'}
                    </button>
                </div>
            </form>

            {/* QR Code Modal */}
            {showQRModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '100%', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setShowQRModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#665e75' }}>
                            <FaTimes />
                        </button>
                        <h3 style={{ color: '#2d1b4e', marginBottom: '1.5rem', fontFamily: 'serif' }}>Demo Memorial QR Code</h3>
                        <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '12px', border: '1px solid #eedbfa' }}>
                            <QRCode value={demoUrl} size={256} />
                        </div>
                        <p style={{ marginTop: '1.5rem', color: '#665e75', fontSize: '0.9rem' }}>
                            Scan this code to instantly open the Demo Memorial. You can download or print this code for demonstrations.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
