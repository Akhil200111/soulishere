/**
 * Centralized helper for memorial QR code URL generation.
 * QR value must always be: ${window.location.origin}/memorial/${memorialId}
 * Uses the memorial's database _id. Never uses /demo or arbitrary IDs.
 *
 * @param {string|Object} memorialId - Database _id string or memorial object containing _id
 * @returns {string} Standardized memorial URL for QR code encoding
 */
export function getMemorialQRUrl(memorialId) {
    if (!memorialId) return '';
    const id = typeof memorialId === 'object' ? (memorialId._id || memorialId.id) : memorialId;
    if (!id) return '';

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/memorial/${id}`;
}
