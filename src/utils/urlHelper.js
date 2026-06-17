export const getImageUrl = (path) => {
    if (!path) return '/images/placeholder.jpg';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        // Remove /api from the end of API_URL if it exists, because /uploads is served from root
        const baseUrl = API_URL.replace('/api', '');
        return `${baseUrl}${path}`;
    }
    return path;
};
