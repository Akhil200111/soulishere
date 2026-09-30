import axios from 'axios';

/**
 * Fetch all memorials for admin management
 */
export async function fetchAdminMemorials(token) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const res = await axios.get('/api/admin/memorials', config);
    return res.data?.data || [];
}

/**
 * Upload multiple images to Cloudinary via existing route
 * @param {FileList|File[]} files 
 */
export async function uploadGalleryImages(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    const res = await axios.post('/api/upload/multiple', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return res.data?.data || [];
}

/**
 * Save updated gallery photos to a memorial
 * @param {string} memorialId 
 * @param {Array<{url: string, description: string}>} galleryPhotos 
 * @param {string} token 
 */
export async function saveMemorialGallery(memorialId, galleryPhotos, token) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const payload = { galleryPhotos };
    const res = await axios.put(`/api/memorials/${memorialId}`, payload, config);
    return res.data?.data;
}
