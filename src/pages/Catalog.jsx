import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { getImageUrl } from '../utils/urlHelper';

const Catalog = () => {
    const { t } = useLanguage();
    const { products, addToCart } = useProducts();
    const { categories, loading: categoriesLoading } = useCategories(); // Get from context
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); // New state
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Update selected category from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
            setSelectedSubCategory(null); // Reset subcategory when main category changes
        } else {
            setSelectedCategory(null);
        }
    }, [location.search]);

    // Derived: Current Category Object
    const currentCategoryObj = useMemo(() => {
        if (!selectedCategory || !categories.length) return null;
        return categories.find(c => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase());
    }, [selectedCategory, categories]);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => {
            // Match Main Category - compare against BOTH slug AND name from the category object
            const matchesCategory = selectedCategory
                ? (
                    // Direct match with selected slug/name
                    p.mainCategory === selectedCategory ||
                    p.mainCategory.toLowerCase() === selectedCategory.toLowerCase() ||
                    // Match using the category object's name (e.g., "Çeyiz")
                    (currentCategoryObj && (
                        p.mainCategory === currentCategoryObj.name ||
                        p.mainCategory.toLowerCase() === currentCategoryObj.name.toLowerCase()
                    ))
                )
                : true;

            // Match Sub Category
            const matchesSubCategory = selectedSubCategory
                ? (p.subCategory === selectedSubCategory)
                : true;

            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSubCategory && matchesSearch;
        });

        if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return result;
    }, [products, selectedCategory, selectedSubCategory, searchTerm, sortBy, currentCategoryObj]);

    const handleProductClick = (product) => {
        // Navigate to product detail page
        // Using ID as slug fallback if slug property missing
        const slug = product._id;
        navigate(`/urun/${slug}`);
    };

    return (
        <div className="lux-catalog-page animate-in">
            <style>{`
                .lux-catalog-page {
                    padding-top: 120px;
                    min-height: 100vh;
                    background: #fcfcfc;
                }
                .category-hero {
                    background: var(--silk-charcoal);
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                    margin-bottom: 0;
                }
                .category-section-wrapper {
                    background: white;
                    padding: 100px 0 120px 0;
                    margin-top: -80px;
                }
                .cat-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 40px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .cat-card {
                    background: white;
                    padding: 0;
                    border-radius: 30px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid #eee;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    overflow: hidden;
                    position: relative;
                }
                .cat-card.active {
                    border-color: var(--silk-red);
                    transform: translateY(-10px);
                    box-shadow: 0 20px 50px rgba(183,18,52,0.15);
                }
                .cat-card:hover:not(.active) {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                }
                .cat-image {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                }
                .cat-label {
                    padding: 30px;
                    background: white;
                    text-align: center;
                }
                .toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 40px;
                    background: white;
                    padding: 20px 30px;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .search-bar {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #f5f5f5;
                    padding: 12px 20px;
                    border-radius: 12px;
                }
                .search-bar input {
                    background: none;
                    border: none;
                    width: 100%;
                    outline: none;
                    font-weight: 500;
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                    padding-bottom: 100px;
                }
                .product-card {
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid #eee;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.07);
                }
                .product-img {
                    height: 320px;
                    overflow: hidden;
                    position: relative;
                }
                .product-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }
                .product-card:hover .product-img img {
                    transform: scale(1.05);
                }
                .product-info {
                    padding: 20px;
                }
                @media (max-width: 768px) {
                    .cat-grid { grid-template-columns: 1fr; margin-top: 20px; }
                    .toolbar { flex-direction: column; }
                }
            `}</style>

            {!selectedCategory ? (
                <div className="category-selection">
                    <div className="category-hero">
                        <div className="lux-container">
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px' }}>{t.catalog}</h1>
                            <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
                                Çe&Fi Tekstil'in özenle hazırlanmış, her zevke hitap eden koleksiyonlarını keşfedin.
                            </p>
                        </div>
                    </div>
                    <div className="category-section-wrapper">
                        <div className="lux-container">
                            <div className="cat-grid">
                                {categories.map(cat => (
                                    <motion.div
                                        key={cat._id}
                                        className="cat-card lux-card"
                                        whileHover={{ y: -10 }}
                                        onClick={() => setSelectedCategory(cat.slug || cat.name)}
                                    >
                                        <img src={getImageUrl(cat.image)} alt={cat.name} className="cat-image" onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-cat.jpg' }} />
                                        <div className="cat-label">
                                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{cat.name}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="lux-container">
                    {/* BREADCRUMB / BACK */}
                    <button
                        onClick={() => setSelectedCategory(null)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700, color: 'var(--silk-red)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        <X size={20} /> {t.catalog.toUpperCase()} / {currentCategoryObj ? currentCategoryObj.name.toUpperCase() : selectedCategory}
                    </button>

                    {/* SUBCATEGORY FILTER - NEW FEATURE */}
                    {currentCategoryObj && currentCategoryObj.subCategories && currentCategoryObj.subCategories.length > 0 && (
                        <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setSelectedSubCategory(null)}
                                style={{
                                    padding: '8px 20px',
                                    borderRadius: '50px',
                                    border: '1px solid #e2e8f0',
                                    background: selectedSubCategory === null ? 'var(--silk-charcoal)' : 'white',
                                    color: selectedSubCategory === null ? 'white' : 'var(--silk-charcoal)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Tümü
                            </button>
                            {currentCategoryObj.subCategories.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSubCategory(sub)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '50px',
                                        border: '1px solid #e2e8f0',
                                        background: selectedSubCategory === sub ? 'var(--silk-charcoal)' : 'white',
                                        color: selectedSubCategory === sub ? 'white' : 'var(--silk-charcoal)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="toolbar">
                        <div className="search-bar">
                            <Search size={20} style={{ opacity: 0.4 }} />
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <select
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #eee', fontWeight: 600 }}
                            >
                                <option value="newest">En Yeni</option>
                                <option value="price-low">En Düşük Fiyat</option>
                                <option value="price-high">En Yüksek Fiyat</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-grid">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map(product => {
                                // Determine display image: first uploaded image, or mainImage, or fallback
                                let displayImage = '/images/placeholder.jpg';
                                if (product.variants && product.variants.length > 0 && product.variants[0].images && product.variants[0].images.length > 0) {
                                    displayImage = getImageUrl(product.variants[0].images[0]);
                                } else if (product.mainImage) {
                                    displayImage = getImageUrl(product.mainImage);
                                } else if (product.image) {
                                    displayImage = getImageUrl(product.image);
                                }

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        key={product._id}
                                        className="product-card"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className="product-img">
                                            <img
                                                src={displayImage}
                                                alt={product.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg' }}
                                            />
                                            <div style={{ position: 'absolute', top: 15, right: 15 }}>
                                                <button
                                                    className="lux-btn"
                                                    style={{ padding: '10px', borderRadius: '50%' }}
                                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--silk-red)', letterSpacing: '1px', marginBottom: '5px' }}>
                                                {currentCategoryObj ? currentCategoryObj.name.toUpperCase() : product.mainCategory}
                                            </div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{product.name}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{product.price} ₺</span>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.4 }}>TOPTAN</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;
