import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CommentContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]); // Displayed comments
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch approved comments for public view
    const fetchPublicComments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/comments`);
            if (res.data.success) {
                setComments(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchPublicComments();
    }, [fetchPublicComments]);

    const addComment = async (commentData, recaptchaToken) => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/comments`, {
                ...commentData,
                recaptchaToken
            });

            if (res.data.success) {
                return { success: true, message: res.data.message };
            }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || err.message
            };
        } finally {
            setLoading(false);
        }
    };

    // Admin Actions
    const fetchAdminComments = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${API_URL}/comments/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setComments(res.data.data);
                return res.data.data;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const approveComment = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(`${API_URL}/comments/${id}/status`,
                { status: 'approved' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAdminComments();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteComment = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API_URL}/comments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAdminComments();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CommentContext.Provider value={{
            comments,
            loading,
            error,
            addComment,
            fetchPublicComments,
            fetchAdminComments,
            approveComment,
            deleteComment
        }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = () => useContext(CommentContext);
