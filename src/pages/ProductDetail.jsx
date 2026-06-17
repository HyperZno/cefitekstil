import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, Box, ChevronLeft, ChevronRight, Star, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { productsAPI } from '../services/api';
import { getImageUrl } from '../utils/urlHelper';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { products, loading: contextLoading, addToCart } = useProducts();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [packageCount, setPackageCount] = useState(1);
    const [activeTab, setActiveTab] = useState('desc');
    const [showCartNotification, setShowCartNotification] = useState(false);

    useEffect(() => {
        // If context is still loading, wait
        if (contextLoading && products.length === 0) return;

        const findProduct = () => {
            // Finding by ID (primary) or Name Slug (fallback)
            const found = products.find(p =>
                p._id === slug ||
                p.name.toLowerCase().replace(/ /g, '-') === slug
            );

            if (found) {
                setProduct(found);
                // Set initial image
                const mainImg = found.mainImage || (found.variants?.[0]?.images?.[0]) || found.image;
                setSelectedImage(getImageUrl(mainImg));
                setLoading(false);
            } else {
                // If not found in context (e.g. direct link and context not fully loaded or truly 404),
                // we could try to fetch individual product from API if an API endpoint exists
                // but for now let's show not found after a grace period or if we are sure
                // productsAPI.getBySlug(slug).then(...) could be implemented here
                setLoading(false);
            }
        };

        findProduct();
    }, [slug, products, contextLoading]);

    if (loading || contextLoading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yükleniyor...</div>;

    if (!product) return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <h2>Ürün bulunamadı.</h2>
            <button onClick={() => navigate('/katalog')} className="lux-btn" style={{ padding: '10px 20px', borderRadius: '8px' }}>Kataloğa Dön</button>
        </div>
    );

    // Collect all unique images from variants for the gallery
    const galleryImages = [
        product.mainImage,
        ...(product.variants?.flatMap(v => v.images) || []),
        product.image // fallback legacy image
    ].filter(Boolean).map(url => getImageUrl(url));

    // Deduplicate images
    const uniqueImages = [...new Set(galleryImages)];

    const handleAddToCart = () => {
        if (!selectedSize && product.variants.some(v => v.sizes.length > 0)) {
            alert('Lütfen bir beden seçiniz.');
            return;
        }
        // Use package quantity * selected package count
        const unitsPerPackage = product.packageQuantity || 1;
        const totalUnits = unitsPerPackage * packageCount;

        for (let i = 0; i < totalUnits; i++) {
            addToCart(product);
        }
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product);
    };

    // Get similar products from the same category
    const similarProducts = products
        .filter(p => p._id !== product?._id && p.mainCategory === product?.mainCategory)
        .slice(0, 4);

    // Get current price based on selected size
    const getCurrentPrice = () => {
        let basePrice, baseDiscountPrice;

        if (selectedSize && product.variants) {
            // Find the size data in all variants
            const sizeData = product.variants
                .flatMap(v => v.sizes)
                .find(s => s.size === selectedSize);

            // If size has specific pricing, use it
            if (sizeData?.price) {
                basePrice = sizeData.price;
                baseDiscountPrice = sizeData.discountPrice;
            } else {
                basePrice = product.price;
                baseDiscountPrice = product.discountPrice;
            }
        } else {
            // Fallback to product-level pricing
            basePrice = product.price;
            baseDiscountPrice = product.discountPrice;
        }

        // Multiply by package quantity for display
        const packageQuantity = product.packageQuantity || 1;
        return {
            price: basePrice * packageQuantity,
            discountPrice: baseDiscountPrice ? baseDiscountPrice * packageQuantity : undefined
        };
    };

    const currentPrice = getCurrentPrice();

    return (
        <div className="product-detail-page animate-in">
            <style>{`
                .product-detail-page {
                    padding-top: 140px;
                    padding-bottom: 80px;
                    background: #fdfdfd;
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif;
                }
                .pd-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 60px;
                }
                .gallery-section {
                    position: sticky;
                    top: 140px;
                    height: fit-content;
                }
                .main-image-container {
                    width: 100%;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #f1f1f1;
                    margin-bottom: 20px;
                    background: white;
                    aspect-ratio: 3/4;
                }
                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* or contain depending on style */
                }
                .thumbnails {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                }
                .thumb {
                    aspect-ratio: 3/4;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 1px solid transparent;
                    opacity: 0.7;
                    transition: all 0.2s;
                }
                .thumb.active {
                    border-color: var(--silk-red);
                    opacity: 1;
                }
                .thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .info-section {
                    padding-top: 10px;
                }
                .brand-title {
                    font-size: 1rem;
                    color: var(--silk-red);
                    font-weight: 700;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .product-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #1e293b;
                    line-height: 1.3;
                    margin-bottom: 15px;
                }
                .rating-row {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                    font-size: 0.9rem;
                    color: #fbbf24;
                    margin-bottom: 25px;
                }
                .price-box {
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 30px;
                }
                .price-val {
                    font-size: 2.2rem;
                    font-weight: 900;
                    color: var(--silk-charcoal);
                }
                .price-discount {
                    text-decoration: line-through;
                    color: #94a3b8;
                    font-size: 1.1rem;
                    margin-right: 10px;
                }

                .variant-label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 10px;
                    display: block;
                }
                .size-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 30px;
                }
                .size-btn {
                    min-width: 50px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e2e8f0;
                    background: white;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    padding: 0 15px;
                }
                .size-btn:hover {
                    border-color: var(--silk-charcoal);
                }
                .size-btn.active {
                    background: var(--silk-charcoal);
                    color: white;
                    border-color: var(--silk-charcoal);
                }

                .actions-row {
                    display: grid;
                    grid-template-columns: 3fr 1fr;
                    gap: 15px;
                    margin-bottom: 40px;
                }
                .add-cart-btn {
                    background: var(--silk-red);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    height: 55px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s;
                    box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);
                }
                .add-cart-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(220, 38, 38, 0.3);
                }
                .fav-btn {
                    border: 1px solid #e2e8f0;
                    background: white;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .fav-btn:hover {
                    border-color: var(--silk-red);
                    color: var(--silk-red);
                }

                .features-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 40px;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.85rem;
                    color: #475569;
                    background: white;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #f1f5f9;
                }

                .details-tabs {
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    gap: 30px;
                    margin-bottom: 20px;
                }
                .tab-btn {
                    padding: 15px 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #94a3b8;
                    cursor: pointer;
                    position: relative;
                }
                .tab-btn.active {
                    color: var(--silk-charcoal);
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--silk-charcoal);
                }

                @media (max-width: 900px) {
                    .pd-container {
                        grid-template-columns: 1fr;
                        padding-top: 100px;
                        gap: 30px;
                    }
                    .gallery-section {
                        position: static;
                    }
                    .product-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>

            <div className="pd-container">
                {/* LEFT: GALLERY */}
                <div className="gallery-section">
                    <div className="main-image-container">
                        <img src={selectedImage} alt={product.name} className="main-image" />
                    </div>
                    {uniqueImages.length > 1 && (
                        <div className="thumbnails">
                            {uniqueImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumb ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt={`view-${idx}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: INFO */}
                <div className="info-section">
                    <div className="brand-title">{product.brand || 'ÇE&Fİ TEKSTİL'}</div>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="rating-row">
                        <div style={{ display: 'flex' }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#fbbf24" strokeWidth={0} />)}</div>
                        <span>(Yeni Ürün)</span>
                    </div>

                    <div className="price-box">
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                            {currentPrice.discountPrice > 0 && (
                                <span className="price-discount">{currentPrice.price} ₺</span>
                            )}
                            <span className="price-val">{currentPrice.discountPrice > 0 ? currentPrice.discountPrice : currentPrice.price} ₺</span>
                        </div>
                    </div>

                    {/* Package Quantity Info */}
                    {product.packageQuantity > 1 && (
                        <div style={{
                            background: '#fff3cd',
                            border: '1px solid #ffc107',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Box size={20} style={{ color: '#856404' }} />
                            <span style={{ fontWeight: 700, color: '#856404' }}>
                                Paket İçeriği: {product.packageQuantity} Adet
                            </span>
                        </div>
                    )}

                    {/* Color Selection */}
                    {product.variants && product.variants.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', marginBottom: '12px' }}>
                                RENK SEÇİMİ
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {product.variants.map((variant, idx) => (
                                    variant.color && (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                setSelectedColor(variant.color);
                                                // Update gallery with this color's images
                                                if (variant.images && variant.images.length > 0) {
                                                    setSelectedImage(getImageUrl(variant.images[0]));
                                                }
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '8px 12px',
                                                border: selectedColor?.name === variant.color.name ? '2px solid var(--silk-red)' : '2px solid #e0e0e0',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s',
                                                background: selectedColor?.name === variant.color.name ? '#fff5f5' : 'white'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: variant.color.hex || '#000',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{variant.color.name}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {product.variants && product.variants.some(v => v.sizes.length > 0) && (
                        <div style={{ marginBottom: '20px' }}>
                            <label className="variant-label">BEDEN SEÇİNİ</label>
                            <div className="size-grid">
                                {Array.from(new Set(product.variants.flatMap(v => v.sizes.map(s => s.size)))).map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Package Quantity Selector */}
                    {product.packageQuantity > 1 && (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666', marginBottom: '12px' }}>
                                PAKET ADEDİ SEÇİMİ
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '15px',
                                background: '#f8f9fa',
                                borderRadius: '12px'
                            }}>
                                <button
                                    onClick={() => setPackageCount(Math.max(1, packageCount - 1))}
                                    disabled={packageCount <= 1}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '2px solid #ddd',
                                        background: packageCount <= 1 ? '#f0f0f0' : 'white',
                                        cursor: packageCount <= 1 ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: packageCount <= 1 ? '#ccc' : '#333'
                                    }}
                                >
                                    <Minus size={20} />
                                </button>

                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--silk-red)' }}>
                                        {packageCount}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        Paket ({packageCount * product.packageQuantity} Adet)
                                    </div>
                                </div>

                                <button
                                    onClick={() => setPackageCount(packageCount + 1)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '2px solid #ddd',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#333'
                                    }}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="actions-row">
                        <button className="add-cart-btn" onClick={handleAddToCart}>
                            <ShoppingCart size={20} />
                            SEPETE EKLE
                        </button>
                        <button
                            className="fav-btn"
                            onClick={handleToggleFavorite}
                            style={{
                                background: isFavorite(product._id) ? 'var(--silk-red)' : 'white',
                                color: isFavorite(product._id) ? 'white' : '#64748b'
                            }}
                        >
                            <Heart
                                size={20}
                                fill={isFavorite(product._id) ? 'white' : 'none'}
                            />
                        </button>
                    </div>

                    <div className="features-list">
                        <div className="feature-item">
                            <Truck size={18} className="text-silk-red" />
                            <span>Hızlı Teslimat (1-3 İş Günü)</span>
                        </div>
                        <div className="feature-item">
                            <ShieldCheck size={18} className="text-silk-red" />
                            <span>%100 Orijinal Ürün</span>
                        </div>
                        <div className="feature-item">
                            <Box size={18} className="text-silk-red" />
                            <span>Güvenli Paketleme</span>
                        </div>
                        <div className="feature-item">
                            <Share2 size={18} className="text-silk-red" />
                            <span>7/24 Müşteri Desteği</span>
                        </div>
                    </div>

                    {/* TABS for DESCRIPTION */}
                    <div className="details-tabs">
                        <div
                            className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                            onClick={() => setActiveTab('desc')}
                        >
                            Ürün Açıklaması
                        </div>
                        <div
                            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('specs')}
                        >
                            Özellikler
                        </div>
                    </div>

                    <div style={{ lineHeight: 1.6, color: '#475569', fontSize: '0.95rem' }}>
                        {activeTab === 'desc' ? (
                            <p>{product.description || 'Bu ürün için henüz açıklama girilmemiş.'}</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {product.specifications?.map((spec, i) => (
                                    <li key={i} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '5px' }}>
                                        <span style={{ fontWeight: 600 }}>{spec.key}:</span>
                                        <span>{spec.value}</span>
                                    </li>
                                ))}
                                {(!product.specifications || product.specifications.length === 0) && (
                                    <li>Ek özellik belirtilmemiş.</li>
                                )}
                            </ul>
                        )}
                    </div>

                </div>
            </div>

            {/* CART SUCCESS NOTIFICATION */}
            <AnimatePresence>
                {showCartNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            background: '#10b981',
                            color: 'white',
                            padding: '15px 25px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 600
                        }}
                    >
                        <ShoppingCart size={20} />
                        Ürün sepete eklendi!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIMILAR PRODUCTS SECTION */}
            {similarProducts.length > 0 && (
                <div style={{
                    background: '#f8fafc',
                    padding: '60px 0',
                    marginTop: '80px'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            marginBottom: '30px',
                            color: 'var(--silk-charcoal)'
                        }}>
                            Benzer Ürünler
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            {similarProducts.map(p => (
                                <motion.div
                                    key={p._id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => navigate(`/urun/${p._id}`)}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <div style={{
                                        aspectRatio: '3/4',
                                        overflow: 'hidden',
                                        background: '#f1f5f9'
                                    }}>
                                        <img
                                            src={getImageUrl(p.mainImage || p.image)}
                                            alt={p.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--silk-red)',
                                            fontWeight: 700,
                                            marginBottom: '5px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {p.mainCategory}
                                        </div>
                                        <h3 style={{
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            marginBottom: '8px',
                                            color: '#1e293b',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {p.name}
                                        </h3>
                                        <div style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 800,
                                            color: 'var(--silk-charcoal)'
                                        }}>
                                            {p.price} ₺
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
