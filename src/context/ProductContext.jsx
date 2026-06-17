import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);

    // Fetch products from API on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll();
            setProducts(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Ürünler yüklenirken hata:', err);
            setError(err.message);
            // Fallback to empty array if API fails
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData) => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('code', productData.code || '');
            formData.append('mainCategory', productData.mainCategory);
            formData.append('subCategory', productData.subCategory);
            formData.append('price', productData.price);
            formData.append('discountPrice', productData.discountPrice || 0);
            formData.append('description', productData.description || '');
            formData.append('brand', productData.brand || 'Çe&Fi');
            formData.append('featured', productData.featured);

            // Serialize objects
            formData.append('specifications', JSON.stringify(productData.specifications || []));

            // Handle Variants & Images
            // WE CANNOT send File objects inside JSON string.
            // So we strip files from variants array before stringifying, 
            // and append them separately as FormData files.

            const variantsForJson = productData.variants.map(v => {
                const { files, ...rest } = v; // Exclude raw file objects from JSON
                return rest;
            });

            formData.append('variants', JSON.stringify(variantsForJson));

            // Append images
            productData.variants.forEach((variant, index) => {
                if (variant.files && variant.files.length > 0) {
                    variant.files.forEach(file => {
                        formData.append(`images_${index}`, file);
                    });
                }
            });

            const response = await productsAPI.create(formData);

            // Add to local state
            setProducts(prev => [response.data, ...prev]);

            return { success: true, data: response.data };
        } catch (err) {
            console.error('Ürün eklenirken hata:', err);
            return { success: false, error: err.message };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('code', productData.code || '');
            formData.append('mainCategory', productData.mainCategory);
            formData.append('subCategory', productData.subCategory);
            formData.append('price', productData.price);
            formData.append('discountPrice', productData.discountPrice || 0);
            formData.append('description', productData.description || '');
            formData.append('brand', productData.brand || 'Çe&Fi');
            formData.append('featured', productData.featured);
            formData.append('packageQuantity', productData.packageQuantity || 1);

            // Serialize objects
            formData.append('specifications', JSON.stringify(productData.specifications || []));

            // Handle Variants
            // For update, we might have existing images (strings) and new images (Files)
            // The backend needs to handle this mix. 
            // Usually, we send the new structure. 
            // Simplification: We follow the same structure as add, but backend needs to be smart.

            const variantsForJson = productData.variants.map(v => {
                const { files, ...rest } = v;
                return rest;
            });
            formData.append('variants', JSON.stringify(variantsForJson));

            // Append NEW images
            productData.variants.forEach((variant, index) => {
                if (variant.files && variant.files.length > 0) {
                    variant.files.forEach(file => {
                        // Only append if it's a File object (new upload)
                        if (file instanceof File) {
                            formData.append(`images_${index}`, file);
                        }
                    });
                }
            });

            // Also handle existing images deletion if backend supports it based on the variants JSON
            // (The variants JSON contains the 'images' array with URLs of kept images)

            const response = await productsAPI.update(id, formData);

            // Update local state
            setProducts(prev => prev.map(p => p._id === id ? response.data : p));

            return { success: true, data: response.data };
        } catch (err) {
            console.error('Ürün güncellenirken hata:', err);
            return { success: false, error: err.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productsAPI.delete(id);

            // Remove from local state
            setProducts(prev => prev.filter(p => p._id !== id));

            return { success: true };
        } catch (err) {
            console.error('Ürün silinirken hata:', err);
            return { success: false, error: err.message };
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);

            // Use discount price if available, otherwise use regular price
            const itemPrice = product.discountPrice && product.discountPrice > 0
                ? product.discountPrice
                : product.price;

            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1, price: itemPrice }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item._id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const placeBulkOrder = (orderData) => {
        setOrders([...orders, { ...orderData, cart, id: Date.now(), date: new Date().toISOString() }]);
        clearCart();
        alert('Siparişiniz başarıyla alındı!');
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            fetchProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            orders,
            placeBulkOrder
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
