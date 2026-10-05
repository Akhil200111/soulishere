'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { FaPlus, FaTrash, FaUpload } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import UserGalleryManager from '@/components/UserGalleryManager';
import UserVideoManager from '@/components/UserVideoManager';

const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { ssr: false });

function CreateMemorialContent() {
    const { isAuthenticated, loading: authLoading, token } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(!!editId);
    const [uploading, setUploading] = useState(false);

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
        const fetchMemorial = async () => {
            if (!editId) return;

            try {
                const res = await axios.get(`/api/memorials/${editId}`);
                const data = res.data.data;

                // Format dates to YYYY-MM-DD for input fields
                const formatDate = (dateString) => {
                    if (!dateString) return '';
                    return new Date(dateString).toISOString().split('T')[0];
                };

                setFormData({
                    ...data,
                    birthDate: formatDate(data.birthDate),
                    deathDate: formatDate(data.deathDate),
                    // Ensure arrays exists
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
            } catch (err) {
                console.error('Error fetching memorial:', err);
                alert('Failed to load memorial data');
                router.push('/dashboard');
            } finally {
                setDataLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchMemorial();
        }
    }, [editId, isAuthenticated, router]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [authLoading, isAuthenticated, router]);

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
            setFormData({ ...formData, [field]: res.data.data.url });
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
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
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload family member image');
        } finally {
            setUploading(false);
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

        // Remove the member and clean up references to this member in parentIds and spouseIds of remaining members
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

        // Manual validation backing up HTML5 required
        if (!formData.birthDate || !formData.deathDate) {
            alert('Please fill in both birth and death dates');
            return;
        }

        // Clean up empty date strings in lifeEvents to avoid Mongoose CastError
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

        setLoading(true);

        try {
            let res;
            if (editId) {
                // Update existing
                res = await axios.put(`/api/memorials/${editId}`, sanitizedFormData);
                alert('Memorial updated successfully');
            } else {
                // Create new
                res = await axios.post('/api/memorials', sanitizedFormData);
            }
            router.push(`/memorial/${res.data.data._id}`);
        } catch (err) {
            console.error('Error saving memorial:', err);
            alert(err.response?.data?.message || 'Failed to save memorial');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || dataLoading) return <LoadingSpinner />;

    return (
        <div className="create-memorial" style={{ padding: '7rem 0 4rem', background: 'var(--lavender-blush)', minHeight: '100vh' }}>
            <div className="container">
                <h1>{editId ? 'Edit Memorial' : 'Create Memorial'}</h1>
                <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
                    {editId ? 'Update the details below.' : 'Fill in the details below to create a beautiful memorial for your loved one.'}
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h2>Basic Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Birth Date *</label>
                                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Death Date *</label>
                                <input type="date" name="deathDate" value={formData.deathDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Profession</label>
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Website</label>
                                <input type="url" name="website" value={formData.website} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Resting Place */}
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h2>Resting Place</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label>Cemetery Name</label>
                                <input type="text" name="cemeteryName" value={formData.cemeteryName || ''} onChange={handleChange} placeholder="e.g. Greenwood Cemetery" />
                            </div>
                            <div className="form-group">
                                <label>Grave Location</label>
                                <input type="text" name="graveLocation" value={formData.graveLocation || ''} onChange={handleChange} placeholder="e.g. Plot 42, Section B (or search map below)" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Pinpoint Location on Map</label>
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
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h2>Photos</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Profile Picture</label>
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
                                <label>Cover Picture</label>
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
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h2>Story</h2>
                        <div className="form-group">
                            <label>Biography</label>
                            <textarea name="biography" value={formData.biography} onChange={handleChange} rows={5} placeholder="Share the story of their life..." />
                        </div>
                        <div className="form-group">
                            <label>Life Summary</label>
                            <textarea name="lifeSummary" value={formData.lifeSummary} onChange={handleChange} rows={3} />
                        </div>
                        <div className="form-group">
                            <label>Achievements</label>
                            <textarea name="achievements" value={formData.achievements} onChange={handleChange} rows={3} />
                        </div>
                    </div>

                    {/* Family Members */}
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 style={{ margin: 0 }}>Family Lineage & Members</h2>
                                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--gray)', fontSize: '0.9rem' }}>
                                    Add family members to build the dynamic lineage tree. Connect parents and spouses to establish tree relationships.
                                </p>
                            </div>
                            <button type="button" className="btn btn-secondary" onClick={addFamilyMember} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaPlus /> Add Family Member
                            </button>
                        </div>

                        {formData.familyMembers.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#F8F5FA', borderRadius: '12px', border: '1px dashed #d4cdc5' }}>
                                <p style={{ margin: 0, color: '#6A5B78' }}>No family members added yet. Click &quot;Add Family Member&quot; above to start building the lineage tree.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {formData.familyMembers.map((member, i) => {
                                    const otherMembers = formData.familyMembers.filter((m, idx) => idx !== i && m.id !== member.id);

                                    return (
                                        <div 
                                            key={member.id || i} 
                                            style={{ 
                                                background: '#FAF8FC', 
                                                padding: '1.5rem', 
                                                borderRadius: '12px', 
                                                border: '1px solid #EAE6EF' 
                                            }}
                                        >
                                            {/* Header of member card */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #EAE6EF', paddingBottom: '0.75rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    {member.avatarUrl ? (
                                                        <img src={member.avatarUrl} alt={member.name || 'Member'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#9D4EDD', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                            {member.name ? member.name.charAt(0).toUpperCase() : (i + 1)}
                                                        </div>
                                                    )}
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#240046' }}>
                                                        {member.name || `Member #${i + 1}`} {member.relationship ? `(${member.relationship})` : ''}
                                                    </h3>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary btn-small" 
                                                    onClick={() => removeFamilyMember(i)} 
                                                    style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                                    title="Remove Member"
                                                >
                                                    <FaTrash /> Remove
                                                </button>
                                            </div>

                                            {/* Grid fields */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                                {/* Name */}
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Name *</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Full Name" 
                                                        value={member.name || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'name', e.target.value)} 
                                                    />
                                                </div>

                                                {/* Relationship */}
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Relationship</label>
                                                    <select 
                                                        value={member.relationship || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'relationship', e.target.value)}
                                                        className="form-input"
                                                        style={{ height: '42px' }}
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
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Dates (e.g. 1950 - 2020)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="1950 - 2020" 
                                                        value={member.dates || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'dates', e.target.value)} 
                                                    />
                                                </div>

                                                {/* Gender */}
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Gender</label>
                                                    <select 
                                                        value={member.gender || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'gender', e.target.value)}
                                                        className="form-input"
                                                        style={{ height: '42px' }}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>

                                                {/* Generation */}
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Generation Level</label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0 (Root), -1 (Parent), 1 (Child)" 
                                                        value={member.generation !== undefined ? member.generation : 0} 
                                                        onChange={(e) => updateFamilyMember(i, 'generation', parseInt(e.target.value, 10) || 0)} 
                                                    />
                                                </div>

                                                {/* Profile Image / Avatar */}
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Profile Photo / Avatar</label>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => handleMemberAvatarUpload(e, i)} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Relationships Section (Parents, Spouse, Children) */}
                                            {(() => {
                                                const derivedChildren = formData.familyMembers.filter(m => (m.parentIds || []).includes(member.id));
                                                
                                                return (
                                                    <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid #EAE6EF', marginBottom: '1rem' }}>
                                                        <h4 style={{ margin: '0 0 1rem 0', color: '#240046', fontSize: '0.95rem', fontWeight: '600' }}>
                                                            Family Relationships
                                                        </h4>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                                                            
                                                            {/* PARENTS SELECTOR */}
                                                            <div>
                                                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                                    Parents
                                                                </label>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: (member.parentIds || []).length > 0 ? '0.5rem' : '0.4rem' }}>
                                                                    {(member.parentIds || []).map(pid => {
                                                                        const parentObj = formData.familyMembers.find(m => m.id === pid);
                                                                        return (
                                                                            <span key={pid} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F3E8FF', color: '#7E22CE', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                                {parentObj ? (parentObj.name || 'Unnamed Parent') : 'Parent'}
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => removeParent(i, pid)} 
                                                                                    style={{ background: 'none', border: 'none', color: '#7E22CE', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
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
                                                                    style={{ height: '38px', fontSize: '0.85rem' }}
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
                                                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                                    Spouse / Partner
                                                                </label>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: (member.spouseIds || []).length > 0 ? '0.5rem' : '0.4rem' }}>
                                                                    {(member.spouseIds || []).map(sid => {
                                                                        const spouseObj = formData.familyMembers.find(m => m.id === sid);
                                                                        return (
                                                                            <span key={sid} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#FCE7F3', color: '#BE185D', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                                {spouseObj ? (spouseObj.name || 'Unnamed Spouse') : 'Spouse'}
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => removeSpouse(i, sid)} 
                                                                                    style={{ background: 'none', border: 'none', color: '#BE185D', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
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
                                                                    style={{ height: '38px', fontSize: '0.85rem' }}
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
                                                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556', display: 'block', marginBottom: '0.4rem' }}>
                                                                    Children <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#6A5B78' }}>(Derived automatically)</span>
                                                                </label>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: derivedChildren.length > 0 ? '0.5rem' : '0.4rem' }}>
                                                                    {derivedChildren.length === 0 ? (
                                                                        <span style={{ fontSize: '0.8rem', color: '#a39c95', fontStyle: 'italic' }}>No children derived yet.</span>
                                                                    ) : (
                                                                        derivedChildren.map(childObj => (
                                                                            <span key={childObj.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#E0F2FE', color: '#0369A1', padding: '0.25rem 0.65rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: '500' }}>
                                                                                {childObj.name || 'Unnamed Child'}
                                                                                <button 
                                                                                    type="button" 
                                                                                    onClick={() => removeChild(i, childObj.id)} 
                                                                                    style={{ background: 'none', border: 'none', color: '#0369A1', cursor: 'pointer', padding: 0, fontSize: '0.95rem', lineHeight: 1 }}
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
                                                                    style={{ height: '38px', fontSize: '0.85rem' }}
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
                                                );
                                            })()}

                                            {/* Biography & Memorial Reference */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Biography / Note</label>
                                                    <textarea 
                                                        rows={2} 
                                                        placeholder="Brief story or memory about this family member..." 
                                                        value={member.bio || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'bio', e.target.value)} 
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#3d2556' }}>Linked Memorial ID (Optional)</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="If this member has their own memorial, enter ID here" 
                                                        value={member.memorialRefId || ''} 
                                                        onChange={(e) => updateFamilyMember(i, 'memorialRefId', e.target.value)} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Photo Gallery Manager for Creators */}
                    {editId && (
                        <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                            <UserGalleryManager
                                memorial={{ ...formData, _id: editId }}
                                token={token}
                                onSaveSuccess={(updated) => {
                                    if (updated?.galleryPhotos) {
                                        setFormData(prev => ({ ...prev, galleryPhotos: updated.galleryPhotos }));
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* YouTube Video Manager for Creators */}
                    {editId && (
                        <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                            <UserVideoManager
                                memorial={{ ...formData, _id: editId }}
                                token={token}
                                onSaveSuccess={(updated) => {
                                    if (updated?.youtubeVideos) {
                                        setFormData(prev => ({ ...prev, youtubeVideos: updated.youtubeVideos }));
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Life Events */}
                    <div className="form-section" style={{ background: 'white', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <h2>Life Events</h2>
                        {formData.lifeEvents.map((event, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                                    <label>Title</label>
                                    <input type="text" value={event.title} onChange={(e) => updateLifeEvent(i, 'title', e.target.value)} />
                                </div>
                                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                                    <label>Date</label>
                                    <input type="date" value={event.date} onChange={(e) => updateLifeEvent(i, 'date', e.target.value)} />
                                </div>
                                <div className="form-group" style={{ flex: 2, minWidth: '200px' }}>
                                    <label>Description</label>
                                    <input type="text" value={event.description} onChange={(e) => updateLifeEvent(i, 'description', e.target.value)} />
                                </div>
                                <button type="button" className="btn btn-secondary btn-small" onClick={() => removeLifeEvent(i)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={addLifeEvent}>
                            <FaPlus /> Add Life Event
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Memorial' : 'Create Memorial (Draft)')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateMemorial() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CreateMemorialContent />
        </Suspense>
    );
}
