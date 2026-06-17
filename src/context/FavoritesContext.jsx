import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('favorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }, [favorites]);

    const addToFavorites = (product) => {
        setFavorites(prev => {
            // Avoid duplicates
            if (prev.find(p => p._id === product._id)) {
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites(prev => prev.filter(p => p._id !== productId));
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product._id)) {
            removeFromFavorites(product._id);
        } else {
            addToFavorites(product);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some(p => p._id === productId);
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            toggleFavorite,
            isFavorite,
            clearFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
