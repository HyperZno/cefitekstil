import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { Plus, X, Trash2, ArrowLeft, Upload, Loader2, CheckCircle, Package, Layers, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addProduct, updateProduct } = useProducts();
    const { categories } = useCategories();

    // Check for edit mode
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    // State Definitions
    const [loading, setLoading] = useState(false); // For initial data fetch
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [activeTab, setActiveTab] = useState('details');

    // Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        code: '',
        mainCategory: '',
        subCategory: '',
        price: '',
        discountPrice: '',
        brand: 'Çe&Fi',
        description: '',
        specifications: [],
        variants: [],
        featured: false,
        packageQuantity: 1
    });

    // Helper for display
    const categoryDisplay = `${newProduct.mainCategory}${newProduct.subCategory ? ` / ${newProduct.subCategory}` : ''}`;

    // Variant Helper State
    const [currentVariant, setCurrentVariant] = useState({
        color: { name: '', hex: '#000000' },
        files: [],
        sizes: []
    });

    // Fetch product data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchProductData = async () => {
                try {
                    setLoading(true);
                    const res = await productsAPI.getAll();
                    const product = res.data.find(p => p._id === editId);

                    if (product) {
                        setNewProduct({
                            name: product.name,
                            code: product.code || '',
                            mainCategory: product.mainCategory || '',
                            subCategory: product.subCategory || '',
                            price: product.price,
                            discountPrice: product.discountPrice || '',
                            brand: product.brand || 'Çe&Fi',
                            description: product.description || '',
                            specifications: product.specifications || [],
                            variants: product.variants ? product.variants.map(v => ({
                                ...v,
                                files: [], // New files to upload
                                images: v.images || [] // Existing images
                            })) : [],
                            featured: product.featured || false,
                            packageQuantity: product.packageQuantity || 1
                        });
                    }
                } catch (error) {
                    console.error("Error fetching product:", error);
                    alert("Ürün bilgileri alınamadı.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProductData();
        }
    }, [editId, isEditMode]);

    // UI Helpers for Variant Management
    const [sizeInput, setSizeInput] = useState({ size: '', stock: '', price: '', discountPrice: '' });

    const handleAddVariant = () => {
        if (!currentVariant.color.name) {
            alert('Lütfen bir renk adı girin.');
            return;
        }
        if (currentVariant.sizes.length === 0) {
            alert('En az bir beden ve stok bilgisi eklemelisiniz.');
            return;
        }
        if (currentVariant.files.length === 0) {
            alert('En az bir görsel eklemelisiniz.');
            return;
        }

        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, currentVariant]
        });
        setCurrentVariant({ color: { name: '', hex: '#000000' }, files: [], sizes: [] });
    };

    const removeVariant = (index) => {
        const updated = [...newProduct.variants];
        updated.splice(index, 1);
        setNewProduct({ ...newProduct, variants: updated });
    };

    const handleVariantFileChange = (e) => {
        const files = Array.from(e.target.files);
        setCurrentVariant({ ...currentVariant, files: [...currentVariant.files, ...files] });
    };

    const addSizeToVariant = (size, stock, price, discountPrice) => {
        if (!size || stock === '' || price === '') {
            alert('Lütfen beden, stok ve fiyat bilgilerini girin.');
            return;
        }
        setCurrentVariant({
            ...currentVariant,
            sizes: [
                ...currentVariant.sizes,
                {
                    size,
                    stock: parseInt(stock),
                    price: parseFloat(price),
                    discountPrice: discountPrice ? parseFloat(discountPrice) : undefined
                }
            ]
        });
    };

    const removeSizeFromVariant = (index) => {
        const updated = [...currentVariant.sizes];
        updated.splice(index, 1);
        setCurrentVariant({ ...currentVariant, sizes: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newProduct.variants.length === 0) {
            alert('Lütfen en az bir ürün varyantı (renk/beden) ekleyin.');
            setActiveTab('variants');
            return;
        }

        setStatus('loading');

        let result;
        if (isEditMode) {
            result = await updateProduct(editId, newProduct);
        } else {
            result = await addProduct(newProduct);
        }

        if (result.success) {
            setStatus('success');
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
        } else {
            console.error(result.error);
            setStatus('error');
            alert('Hata: ' + result.error);
        }
    };

    if (status === 'success') {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="lux-card" style={{ padding: '60px', textAlign: 'center', border: '1px solid #dcfce7', background: '#f0fdf4', maxWidth: '500px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)' }}>
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#14532d', fontWeight: 900 }}>{isEditMode ? 'Ürün Güncellendi!' : 'Ürün Eklendi!'}</h2>
                    <p style={{ opacity: 0.8, color: '#15803d', fontSize: '1rem' }}>İşlem başarıyla tamamlandı. Yönlendiriliyorsunuz...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="lux-section animate-in" style={{ paddingTop: '100px', paddingBottom: '40px', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="lux-container" style={{ maxWidth: '1200px' }}>

                {/* Header Compact */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            onClick={() => navigate('/admin')}
                            className="lux-icon-btn"
                            style={{
                                width: '40px', height: '40px', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--silk-charcoal)', lineHeight: 1.1 }}>{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h1>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Katalog yönetimi</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    {/* LEFT COLUMN: FORM */}
                    <div>
                        <AnimatePresence mode="wait">
                            {activeTab === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="lux-card"
                                    style={{ padding: '30px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}
                                >
                                    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--silk-charcoal)', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                                        <Package size={20} className="text-silk-red" />
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ürün Detayları</h3>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label className="admin-label-compact">ÜRÜN ADI</label>
                                        <input
                                            type="text"
                                            className="lux-input-compact"
                                            name="name"
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            placeholder="Örn: Lüks Deri Ceket"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label className="admin-label-compact">ÜRÜN KODU (SKU)</label>
                                            <input
                                                type="text"
                                                className="lux-input-compact"
                                                name="code"
                                                value={newProduct.code}
                                                onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                                                placeholder="Örn: LDC-001"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label-compact">MARKA</label>
                                            <input
                                                type="text"
                                                className="lux-input-compact"
                                                name="brand"
                                                value={newProduct.brand}
                                                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                                placeholder="Örn: Çe&Fi"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label className="admin-label-compact">ANA KATEGORİ</label>
                                            <select
                                                className="lux-input-compact"
                                                name="mainCategory"
                                                value={newProduct.mainCategory}
                                                onChange={(e) => setNewProduct({ ...newProduct, mainCategory: e.target.value, subCategory: '' })}
                                            >
                                                <option value="">Seçiniz</option>
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="admin-label-compact">ALT KATEGORİ</label>
                                            <select
                                                className="lux-input-compact"
                                                name="subCategory"
                                                value={newProduct.subCategory}
                                                onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                                                disabled={!newProduct.mainCategory}
                                            >
                                                <option value="">Seçiniz</option>
                                                {newProduct.mainCategory && categories.find(cat => cat.name === newProduct.mainCategory)?.subCategories.map(subCat => (
                                                    <option key={subCat} value={subCat}>{subCat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label className="admin-label-compact">FİYAT (₺)</label>
                                            <input
                                                type="number"
                                                className="lux-input-compact"
                                                name="price"
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                placeholder="Örn: 1200.00"
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-label-compact">İNDİRİMLİ FİYAT (₺) <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>(Opsiyonel)</span></label>
                                            <input
                                                type="number"
                                                className="lux-input-compact"
                                                name="discountPrice"
                                                value={newProduct.discountPrice}
                                                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                                                placeholder="Örn: 999.99"
                                                step="0.01"
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label className="admin-label-compact">PAKET ADEDİ <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>(Toptan Satış)</span></label>
                                            <input
                                                type="number"
                                                className="lux-input-compact"
                                                name="packageQuantity"
                                                value={newProduct.packageQuantity}
                                                onChange={(e) => setNewProduct({ ...newProduct, packageQuantity: e.target.value })}
                                                placeholder="1"
                                                min="1"
                                                style={{ background: 'white' }}
                                            />
                                            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                                                Bir pakette kaç adet ürün var? Tekli satış için 1 girin.
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label className="admin-label-compact">AÇIKLAMA</label>
                                        <textarea
                                            className="lux-input-compact"
                                            name="description"
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            rows="4"
                                            placeholder="Ürün hakkında detaylı bilgi giriniz..."
                                            style={{ resize: 'vertical', minHeight: '100px' }}
                                        ></textarea>
                                    </div>

                                    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--silk-charcoal)', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                                        <Info size={20} className="text-silk-red" />
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ek Bilgiler</h3>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label className="admin-label-compact">ÖZELLİKLER</label>
                                        {newProduct.specifications.map((spec, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    className="lux-input-compact"
                                                    placeholder="Özellik Adı (Örn: Malzeme)"
                                                    value={spec.key}
                                                    onChange={(e) => {
                                                        const newSpecs = [...newProduct.specifications];
                                                        newSpecs[index].key = e.target.value;
                                                        setNewProduct({ ...newProduct, specifications: newSpecs });
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    className="lux-input-compact"
                                                    placeholder="Değer (Örn: Pamuk)"
                                                    value={spec.value}
                                                    onChange={(e) => {
                                                        const newSpecs = [...newProduct.specifications];
                                                        newSpecs[index].value = e.target.value;
                                                        setNewProduct({ ...newProduct, specifications: newSpecs });
                                                    }}
                                                />
                                                <button type="button" onClick={() => {
                                                    const newSpecs = newProduct.specifications.filter((_, i) => i !== index);
                                                    setNewProduct({ ...newProduct, specifications: newSpecs });
                                                }} className="lux-btn" style={{ background: '#ef4444', color: 'white', padding: '0 15px' }}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setNewProduct({ ...newProduct, specifications: [...newProduct.specifications, { key: '', value: '' }] })} className="lux-btn" style={{ background: '#334155', color: 'white', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                                            <Plus size={16} style={{ marginRight: '6px' }} /> Özellik Ekle
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            name="featured"
                                            checked={newProduct.featured}
                                            onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <label htmlFor="featured" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--silk-charcoal)', cursor: 'pointer' }}>Öne Çıkan Ürün</label>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                                        <button type="button" onClick={() => setActiveTab('variants')} className="lux-btn" style={{ background: 'var(--silk-charcoal)', color: 'white', padding: '0 25px' }}>
                                            Devam Et <ChevronRight size={16} style={{ marginLeft: '6px' }} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'variants' && (
                                <motion.div
                                    key="variants"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="lux-card"
                                    style={{ padding: '30px', background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}
                                >
                                    <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--silk-charcoal)', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                                        <Layers size={20} className="text-silk-red" />
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Varyant Yönetimi</h3>
                                    </div>

                                    {/* Add Variant Box */}
                                    <div style={{ background: '#fcfcfc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '15px', marginBottom: '15px' }}>
                                            <div>
                                                <label className="admin-label-compact">RENK ADI</label>
                                                <input
                                                    type="text"
                                                    className="lux-input-compact"
                                                    value={currentVariant.color.name}
                                                    onChange={e => setCurrentVariant({ ...currentVariant, color: { ...currentVariant.color, name: e.target.value } })}
                                                    placeholder="Örn: Mavi"
                                                    style={{ background: 'white' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="admin-label-compact">RENK</label>
                                                <div style={{ height: '40px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', padding: '4px' }}>
                                                    <input
                                                        type="color"
                                                        style={{ width: '100%', height: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
                                                        value={currentVariant.color.hex}
                                                        onChange={e => setCurrentVariant({ ...currentVariant, color: { ...currentVariant.color, hex: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label className="admin-label-compact">GÖRSEL YÜKLE</label>
                                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '15px', textAlign: 'center', background: 'white', position: 'relative', cursor: 'pointer' }}>
                                                <input type="file" multiple accept="image/*" onChange={handleVariantFileChange} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }} />
                                                <Upload size={20} style={{ color: '#94a3b8', marginBottom: '5px' }} />
                                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Görsel Seç veya Sürükle</p>
                                                {currentVariant.files.length > 0 && <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '5px' }}>{currentVariant.files.length} dosya seçildi</p>}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label className="admin-label-compact">BEDEN, STOK & FİYAT</label>
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    className="lux-input-compact"
                                                    placeholder="Beden (S, M, L)"
                                                    style={{ flex: 1, background: 'white' }}
                                                    value={sizeInput.size}
                                                    onChange={e => setSizeInput({ ...sizeInput, size: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    className="lux-input-compact"
                                                    placeholder="Stok"
                                                    style={{ width: '80px', background: 'white' }}
                                                    value={sizeInput.stock}
                                                    onChange={e => setSizeInput({ ...sizeInput, stock: e.target.value })}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <input
                                                    type="number"
                                                    className="lux-input-compact"
                                                    placeholder="Normal Fiyat (₺)"
                                                    style={{ flex: 1, background: 'white' }}
                                                    value={sizeInput.price}
                                                    onChange={e => setSizeInput({ ...sizeInput, price: e.target.value })}
                                                />
                                                <input
                                                    type="number"
                                                    className="lux-input-compact"
                                                    placeholder="İndirimli (opsiyonel)"
                                                    style={{ flex: 1, background: 'white' }}
                                                    value={sizeInput.discountPrice}
                                                    onChange={e => setSizeInput({ ...sizeInput, discountPrice: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    className="lux-btn"
                                                    style={{ background: '#334155', color: 'white', padding: '0 15px' }}
                                                    onClick={() => {
                                                        addSizeToVariant(sizeInput.size, sizeInput.stock, sizeInput.price, sizeInput.discountPrice);
                                                        setSizeInput({ size: '', stock: '', price: '', discountPrice: '' });
                                                    }}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                                {currentVariant.sizes.map((s, i) => (
                                                    <span key={i} style={{ fontSize: '0.75rem', background: 'white', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <strong>{s.size}</strong> · {s.stock} adet · {s.discountPrice ? <><s>{s.price}₺</s> <strong style={{ color: 'var(--silk-red)' }}>{s.discountPrice}₺</strong></> : <strong>{s.price}₺</strong>}
                                                        <X size={12} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeSizeFromVariant(i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <button type="button" className="lux-btn" style={{ width: '100%', background: 'var(--silk-charcoal)', color: 'white', justifyContent: 'center' }} onClick={handleAddVariant}>
                                            <Plus size={16} style={{ marginRight: '6px' }} /> Listeye Ekle
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button type="button" onClick={() => setActiveTab('details')} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <ArrowLeft size={16} /> Geri
                                        </button>
                                        <div></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: STICKY SUMMARY */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="lux-card" style={{ padding: '20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginBottom: '15px' }}>Özet</h3>

                            <div style={{ paddingBottom: '15px', borderBottom: '1px solid #f1f5f9', marginBottom: '15px' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--silk-charcoal)', minHeight: '1.2em' }}>
                                    {newProduct.name || <span style={{ opacity: 0.3 }}>Ürün Adı</span>}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                                    {categoryDisplay}
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--silk-red)', marginTop: '8px' }}>
                                    {newProduct.price ? `₺${newProduct.price} ` : ''}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>VARYANTLAR</span>
                                    <span style={{ color: '#64748b' }}>{newProduct.variants.length}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {newProduct.variants.length === 0 ? (
                                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontStyle: 'italic' }}>Henüz eklenmedi.</div>
                                    ) : (
                                        newProduct.variants.map((v, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.color.hex, border: '1px solid #cbd5e1' }}></div>
                                                <div style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600 }}>{v.color.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{v.sizes.reduce((a, b) => a + b.stock, 0)} ad.</div>
                                                <Trash2 size={14} style={{ cursor: 'pointer', color: '#ef4444', opacity: 0.5 }} onClick={() => removeVariant(i)} hover={{ opacity: 1 }} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="lux-btn"
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    height: '45px',
                                    background: 'var(--silk-charcoal)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    marginTop: '5px'
                                }}
                            >
                                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} /> YAYINLA</div>}
                            </button>
                        </div>
                    </div>
                </form>

                <style>{`
                    .admin-label-compact {
                        display: block;
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: #64748b;
                        margin-bottom: 6px;
                        letter-spacing: 0.5px;
                    }
                    .lux-input-compact {
                        width: 100%;
                        height: 42px;
                        padding: 0 15px;
                        border-radius: 8px;
                        border: 1px solid #e2e8f0;
                        background: #fcfcfc;
                        font-size: 0.9rem;
                        transition: all 0.2s;
                        outline: none;
                    }
                    .lux-input-compact:focus {
                        border-color: var(--silk-charcoal);
                        background: white;
                        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
                    }
                `}</style>
            </div >
        </div >
    );
};

export default AddProduct;
