import axios from 'axios';

export async function fetchTributes(memorialId, { page = 1, limit = 10, sort = 'newest' } = {}) {
    const res = await axios.get(`/api/memorials/${memorialId}/guestbook?page=${page}&limit=${limit}&sort=${sort}`);
    return res.data;
}

export async function createTribute(memorialId, data) {
    const res = await axios.post(`/api/memorials/${memorialId}/guestbook`, data);
    return res.data;
}

export async function updateTribute(memorialId, entryId, data) {
    const res = await axios.put(`/api/memorials/${memorialId}/guestbook/${entryId}`, data);
    return res.data;
}

export async function deleteTribute(memorialId, entryId) {
    const res = await axios.delete(`/api/memorials/${memorialId}/guestbook/${entryId}`);
    return res.data;
}

export async function toggleLikeTribute(memorialId, entryId, visitorId = null) {
    const res = await axios.post(`/api/memorials/${memorialId}/guestbook/${entryId}/like`, { visitorId });
    return res.data;
}

export async function createReply(memorialId, entryId, data) {
    const res = await axios.post(`/api/memorials/${memorialId}/guestbook/${entryId}/reply`, data);
    return res.data;
}

export async function deleteReply(memorialId, entryId, replyId) {
    const res = await axios.delete(`/api/memorials/${memorialId}/guestbook/${entryId}/reply?replyId=${replyId}`);
    return res.data;
}

export async function moderateTribute(entryId, data) {
    const res = await axios.patch(`/api/admin/tributes/${entryId}`, data);
    return res.data;
}
