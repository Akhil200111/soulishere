import axios from 'axios';

/**
 * Validates a YouTube URL or direct Video ID and extracts the canonical 11-character ID.
 * Supports:
 * - Standard watch URLs (https://www.youtube.com/watch?v=VIDEO_ID)
 * - Short links (https://youtu.be/VIDEO_ID)
 * - Embed links (https://www.youtube.com/embed/VIDEO_ID)
 * - YouTube Shorts (https://www.youtube.com/shorts/VIDEO_ID)
 * - Direct 11-character Video IDs
 * 
 * @param {string} input 
 * @returns {{ isValid: boolean, videoId: string, error: string | null }}
 */
export function parseYouTubeUrl(input) {
    if (!input || typeof input !== 'string') {
        return { isValid: false, videoId: '', error: 'Please enter a YouTube URL or Video ID.' };
    }

    const trimmed = input.trim();

    if (!trimmed) {
        return { isValid: false, videoId: '', error: 'Please enter a YouTube URL or Video ID.' };
    }

    // Direct 11-character video ID format check (letters, digits, underscore, hyphen)
    const directIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    if (directIdRegex.test(trimmed)) {
        return { isValid: true, videoId: trimmed, error: null };
    }

    // Comprehensive URL regex matching watch, shorts, embed, v, and short URLs
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/i;

    const match = trimmed.match(youtubeUrlRegex);
    if (match && match[1]) {
        return { isValid: true, videoId: match[1], error: null };
    }

    return { 
        isValid: false, 
        videoId: '', 
        error: 'Invalid YouTube URL. Please enter a valid YouTube link (e.g., https://www.youtube.com/watch?v=..., https://youtu.be/..., https://youtube.com/shorts/..., or https://youtube.com/embed/...)' 
    };
}

/**
 * Helper function to extract 11-character YouTube video ID from various YouTube URL formats.
 * @param {string} url 
 * @returns {string} YouTube Video ID or empty string if invalid
 */
export function extractYouTubeVideoId(url) {
    const result = parseYouTubeUrl(url);
    return result.videoId || '';
}

/**
 * Save updated YouTube videos to a memorial
 * @param {string} memorialId 
 * @param {Array<{title: string, youtubeUrl: string, youtubeVideoId?: string, description?: string, displayOrder?: number}>} youtubeVideos 
 * @param {string} token 
 */
export async function saveMemorialVideos(memorialId, youtubeVideos, token) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const payload = { youtubeVideos };
    const res = await axios.put(`/api/memorials/${memorialId}`, payload, config);
    return res.data?.data;
}
