import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import { canManageMemorialGallery } from '@/lib/auth';
import { processFamilyMembers } from '@/lib/lineage';

/**
 * Service helper to update a memorial document (including galleryPhotos) with reusable authorization
 * 
 * Rules:
 * - Authenticates session
 * - Allows admin users
 * - Allows memorial creator/owner
 * - Rejects unauthorized users with 403
 * - Preserves existing galleryPhotos format [{ url, description }]
 * 
 * @param {Object} session - User session object
 * @param {string} memorialId - Target memorial ObjectId
 * @param {Object} body - Request body containing updates (e.g. { galleryPhotos: [...] })
 * @returns {Promise<{ success: boolean, status: number, data?: Object, message?: string }>}
 */
export async function updateMemorialService(session, memorialId, body) {
    if (!session || !session.id) {
        return { success: false, status: 401, message: 'Not authorized' };
    }

    if (!memorialId) {
        return { success: false, status: 400, message: 'Memorial ID is required' };
    }

    await connectDB();

    const memorial = await Memorial.findById(memorialId);
    if (!memorial) {
        return { success: false, status: 404, message: 'Memorial not found' };
    }

    // Reusable authorization check (Admin or Creator/Owner)
    const authResult = await canManageMemorialGallery(session, memorial);
    if (!authResult.authorized) {
        return {
            success: false,
            status: authResult.status || 403,
            message: authResult.message || 'Not authorized to update this memorial'
        };
    }

    // Check if update is specifically for galleryPhotos
    const isGalleryUpdateOnly = Object.keys(body).length === 1 && Boolean(body.galleryPhotos);

    // If general edit (not gallery-only), check draft status restriction for non-admins
    if (!isGalleryUpdateOnly && memorial.status !== 'draft' && authResult.user?.role !== 'admin') {
        return {
            success: false,
            status: 403,
            message: 'Cannot edit memorial after QR code is requested or generated'
        };
    }

    // Clean update data and protect system fields
    const updateData = { ...body };
    delete updateData.status;
    delete updateData.paymentId;
    delete updateData.paymentStatus;
    delete updateData.userId;
    delete updateData._id;

    if (updateData.familyMembers) {
        updateData.familyMembers = processFamilyMembers(updateData.familyMembers);
    }

    // Perform database update
    const updatedMemorial = await Memorial.findByIdAndUpdate(memorialId, updateData, {
        new: true,
        runValidators: true
    });

    return {
        success: true,
        status: 200,
        data: updatedMemorial
    };
}
