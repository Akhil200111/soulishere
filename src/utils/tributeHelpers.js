/**
 * Formats a date into a warm, respectful relative time string (e.g. "2 days ago", "Just now").
 */
export function getRelativeTime(dateInput) {
    if (!dateInput) return '';

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    }

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Returns initials from an author name (e.g. "John Doe" -> "JD").
 */
export function getAuthorInitials(name) {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates a deterministic warm neutral color based on name for initial avatars.
 */
export function getAvatarBg(name) {
    const palette = [
        '#E8DFD8',
        '#DFE4DF',
        '#E4DFE8',
        '#E8E4DF',
        '#DDE3E8',
        '#E8DDD9'
    ];
    if (!name) return palette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palette.length;
    return palette[index];
}

/**
 * Gets or creates a persistent anonymous visitor ID stored in localStorage.
 * Used to track likes/unlikes for guest visitors without requiring login.
 */
export function getOrCreateVisitorId() {
    if (typeof window === 'undefined') return null;
    let visitorId = localStorage.getItem('soulishere_visitor_id');
    if (!visitorId) {
        visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('soulishere_visitor_id', visitorId);
    }
    return visitorId;
}
