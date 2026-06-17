import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (err) {
            console.error('Kategoriler yüklenirken hata:', err);
            setError('Kategoriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = async (categoryData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/categories`, categoryData, config);
            if (res.data.success) {
                setCategories([...categories, res.data.data]);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message };
        }
    };

    const updateCategory = async (id, categoryData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/categories/${id}`, categoryData, config);
            if (res.data.success) {
                setCategories(categories.map(c => c._id === id ? res.data.data : c));
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message };
        }
    };

    const deleteCategory = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, config);
            setCategories(categories.filter(c => c._id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.message || err.message };
        }
    };

    return (
        <CategoryContext.Provider value={{
            categories,
            loading,
            error,
            fetchCategories,
            addCategory,
            updateCategory,
            deleteCategory
        }}>
            {children}
        </CategoryContext.Provider>
    );
};
