/**
 * Centralized helper for memorial QR code URL generation.
 * QR value format: ${window.location.origin}/memorial/${memorialId}?key=${qrAccessKey}
 *
 * @param {string|Object} memorial - Database _id string or memorial object containing _id and qrAccessKey
 * @param {string} [key] - Optional explicit access key
 * @returns {string} Standardized memorial URL for QR code encoding
 */
export function getMemorialQRUrl(memorial, key) {
    if (!memorial) return '';
    let id = '';
    let accessKey = key || '';

    if (typeof memorial === 'object' && memorial !== null) {
        id = memorial._id || memorial.id || '';
        if (!accessKey && memorial.qrAccessKey) {
            accessKey = memorial.qrAccessKey;
        }
    } else {
        id = String(memorial);
    }

    if (!id) return '';

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const query = accessKey ? `?key=${accessKey}` : '';
    return `${origin}/memorial/${id}${query}`;
}

