import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useComments } from '../context/CommentContext';
import { useCategories } from '../context/CategoryContext';
import { authAPI, contactAPI } from '../services/api';
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    BarChart3,
    Settings,
    Plus,
    Trash2,
    Check,
    X,
    Star,
    TrendingUp,
    Users,
    ShoppingBag,
    Bell,
    Search,
    ChevronRight,
    LogOut,
    Tag,
    Lock,
    Mail,
    User,
    SlidersHorizontal,
    Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ReCAPTCHA from 'react-google-recaptcha';

const Admin = () => {
    const navigate = useNavigate();
    const { products, orders, addProduct, deleteProduct } = useProducts();
    const { comments, approveComment, deleteComment, fetchAdminComments } = useComments();
    const { categories, addCategory, deleteCategory, updateCategory } = useCategories();

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [loginView, setLoginView] = useState('login'); // 'login' or 'register'
    const [authError, setAuthError] = useState('');

    // ReCAPTCHA
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = React.useRef(null);

    // Login/Register Form State
    const [authForm, setAuthForm] = useState({
        username: '',
        password: '',
        email: ''
    });

    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Product Management State - REMOVED (Moved to AddProduct.jsx)

    // Messages State
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        checkAuth();
    }, []);

    // Fetch data based on active tab
    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'comments') {
                fetchAdminComments();
            } else if (activeTab === 'messages') {
                fetchMessages();
            }
        }
    }, [isAuthenticated, activeTab]);

    const fetchMessages = async () => {
        try {
            const response = await contactAPI.getAll();
            if (response.success) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Mesajlar getirilemedi:', error);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
        try {
            await contactAPI.delete(id);
            setMessages(messages.filter(m => m._id !== id));
        } catch (error) {
            console.error('Mesaj silinemedi:', error);
            alert('Mesaj silinirken bir hata oluştu');
        }
    };

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setAuthLoading(false);
                return;
            }

            const response = await authAPI.verify();
            if (response.success) {
                setUser(response.data);
                setIsAuthenticated(true);
                // Load initial data
                fetchAdminComments();
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');

        if (!recaptchaToken) {
            setAuthError('Lütfen robot olmadığınızı doğrulayın.');
            return;
        }

        try {
            let response;
            if (loginView === 'login') {
                response = await authAPI.login(authForm.username, authForm.password, recaptchaToken);
            } else {
                response = await authAPI.register(authForm.username, authForm.email, authForm.password);
            }

            if (response.success) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data));
                setIsAuthenticated(true);
                setUser(response.data);
                fetchAdminComments(); // Fetch comments after login
            }
        } catch (error) {
            console.error('Auth Error:', error);
            setAuthError(error.message || 'Bir hata oluştu');
            setRecaptchaToken(null);
            if (recaptchaRef.current) recaptchaRef.current.reset();
        }
    };

    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (token) setAuthError('');
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setUser(null);
    };





    if (authLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Yükleniyor...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="lux-catalog-page animate-in" style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="lux-card" style={{ maxWidth: '400px', width: '100%', padding: '40px', background: 'white' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Lock size={40} color="var(--silk-red)" style={{ marginBottom: '15px' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--silk-charcoal)' }}>
                            {loginView === 'login' ? 'Admin Girişi' : 'Admin Kaydı'}
                        </h2>
                        <p style={{ opacity: 0.6 }}>Panel erişimi için lütfen {loginView === 'login' ? 'giriş yapın' : 'kayıt olun'}.</p>
                    </div>

                    {authError && (
                        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                            {authError}
                        </div>
                    )}

                    <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Kullanıcı Adı"
                                value={authForm.username}
                                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                                style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb' }}
                                required
                            />
                        </div>

                        {loginView === 'register' && (
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="email"
                                    placeholder="E-posta Adresi"
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                    style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb' }}
                                    required
                                />
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                            <input
                                type="password"
                                placeholder="Şifre"
                                value={authForm.password}
                                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                                style={{ width: '100%', padding: '15px 15px 15px 45px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb' }}
                                required
                            />
                        </div>

                        {/* ReCAPTCHA */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={onRecaptchaChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="lux-btn"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', justifyContent: 'center', marginTop: '10px' }}
                        >
                            {loginView === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                        {loginView === 'login' ? (
                            <span style={{ color: '#6b7280' }}>
                                Hesabınız yok mu?{' '}
                                <button
                                    onClick={() => { setLoginView('register'); setAuthForm({ ...authForm, email: '' }); setAuthError(''); }}
                                    style={{ color: 'var(--silk-red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Kayıt Ol
                                </button>
                            </span>
                        ) : (
                            <span style={{ color: '#6b7280' }}>
                                Zaten hesabınız var mı?{' '}
                                <button
                                    onClick={() => { setLoginView('login'); setAuthForm({ ...authForm, email: '' }); setAuthError(''); }}
                                    style={{ color: 'var(--silk-red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Giriş Yap
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const pendingComments = comments.filter(c => c.status === 'pending');
    const approvedComments = comments.filter(c => c.status === 'approved');

    const menuItems = [
        { id: 'dashboard', label: 'Panel', icon: <LayoutDashboard size={20} /> },
        { id: 'products', label: 'Katalog', icon: <Package size={20} /> },
        { id: 'orders', label: 'Siparişler', icon: <ShoppingBag size={20} /> },
        { id: 'categories', label: 'Kategoriler', icon: <Tag size={20} /> },
        { id: 'comments', label: 'Yorumlar', icon: <MessageSquare size={20} /> },
        { id: 'messages', label: 'Mesajlar', icon: <Mail size={20} /> },
        { id: 'analytics', label: 'Analiz', icon: <BarChart3 size={20} /> },
        { id: 'settings', label: 'Ayarlar', icon: <Settings size={20} /> }
    ];

    // --- SUB-PAGES ---

    const DashboardView = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--silk-charcoal)' }}>Hoşgeldin, <span style={{ color: 'var(--silk-red)' }}>{user?.username}</span></h1>
                    <p style={{ opacity: 0.5 }}>Mağazanızın bugünkü performansına hoş geldiniz.</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="admin-avatar" style={{ width: '45px', height: '45px', background: 'var(--silk-charcoal)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Users size={20} />
                    </div>
                    <button onClick={handleLogout} style={{ padding: '0 15px', borderRadius: '12px', border: '1px solid #fee2e2', color: '#dc2626', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <LogOut size={16} /> Çıkış
                    </button>
                </div>
            </div>

            <div className="grid-4" style={{ gap: '20px', marginBottom: '40px' }}>
                <div className="lux-card" style={{ padding: '25px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}><Package size={20} /></div>
                        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingUp size={14} /> +12%
                        </span>
                    </div>
                    <h4 style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>TOPLAM ÜRÜN</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{products.length}</div>
                </div>
                <div className="lux-card" style={{ padding: '25px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,0,0,0.05)', borderRadius: '12px', color: 'var(--silk-red)' }}><MessageSquare size={20} /></div>
                        <span style={{ color: 'var(--silk-red)', fontSize: '0.8rem', fontWeight: 700 }}>Bekleyen</span>
                    </div>
                    <h4 style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>YENİ YORUMLAR</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{pendingComments.length}</div>
                </div>
                <div className="lux-card" style={{ padding: '25px', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}><ShoppingBag size={20} /></div>
                        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>Aktif</span>
                    </div>
                    <h4 style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>KATEGORİ</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>3</div>
                </div>
                <div className="lux-card" style={{ padding: '25px', background: 'var(--silk-charcoal)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><Bell size={20} /></div>
                    </div>
                    <h4 style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>BİLDİRİMLER</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>8</div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '30px' }}>
                <div className="lux-card" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Son Yorumlar</h3>
                        <button onClick={() => setActiveTab('comments')} style={{ background: 'none', border: 'none', color: 'var(--silk-red)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Tümünü Gör</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {pendingComments.slice(0, 3).map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{c.text.substring(0, 40)}...</div>
                                </div>
                                <ChevronRight size={16} opacity={0.3} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lux-card" style={{ padding: '30px', background: 'linear-gradient(135deg, var(--silk-charcoal) 0%, #333 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '15px' }}>Hızlı Ürün Kontrolü</h3>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '30px' }}>Kataloğunuzdaki ürünleri kategorilere göre yönetmek için detaylı görünüme geçin.</p>
                    <button className="lux-btn" style={{ width: '100%', background: 'white', color: 'black' }} onClick={() => setActiveTab('products')}>
                        KATALOĞU YÖNET
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const CatalogView = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="admin-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Ürün <span style={{ color: 'var(--silk-red)' }}>Kataloğu</span></h2>
                    <p style={{ opacity: 0.5 }}>Gelişmiş kategori bazlı envanter yönetimi.</p>
                </div>
                <button className="lux-btn" style={{ height: '50px', borderRadius: '12px' }} onClick={() => navigate('/admin/urun-ekle')}>
                    <Plus size={18} /> YENİ ÜRÜN EKLE
                </button>
            </div>

            <div className="lux-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 30px', borderBottom: '1px solid #eee', display: 'flex', gap: '20px', alignItems: 'center', background: '#fafafa' }}>
                    <Search size={18} opacity={0.3} />
                    <input
                        type="text"
                        placeholder="Ürün veya kategori ara..."
                        style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {products.filter(p =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.mainCategory && p.mainCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).map(p => (
                        <div key={p.id || p._id} style={{ padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '12px', overflow: 'hidden' }}>
                                    <img src={p.mainImage || (p.variants?.[0]?.images?.[0]) || 'images/placeholder.jpg'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', opacity: 0.6 }}>
                                            <Tag size={10} style={{ marginRight: '4px' }} />
                                            {p.mainCategory || p.category}
                                            {p.subCategory ? ` / ${p.subCategory}` : ''}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--silk-red)', fontWeight: 800 }}>₺{p.price}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => navigate(`/admin/urun-ekle?edit=${p._id}`)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '10px' }} title="Düzenle">
                                    <Tag size={18} />
                                </button>
                                <button onClick={() => { if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) deleteProduct(p._id); }} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', padding: '10px' }} title="Sil">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const CommentsView = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="admin-view">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>Müşteri <span style={{ color: 'var(--silk-red)' }}>Yorumları</span></h2>
            <p style={{ opacity: 0.5, marginBottom: '40px' }}>Onay bekleyen ve yayındaki tüm yorumları kontrol edin.</p>

            <div className="grid-2" style={{ gap: '30px', alignItems: 'flex-start' }}>
                <div className="lux-card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 30px', background: 'rgba(255,0,0,0.03)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', borderBottom: '1px solid #eee' }}>BEKLEYENLER ({pendingComments.length})</div>
                    {pendingComments.length > 0 ? pendingComments.map(c => (
                        <div key={c._id} style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', background: 'white', marginBottom: '15px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 900, color: 'var(--silk-charcoal)' }}>{c.name}</div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {[...Array(c.rating)].map((_, i) => <Star key={i} size={12} fill="gold" stroke="none" />)}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>{c.text}</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => approveComment(c._id)} style={{ flex: 1, height: '40px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    <Check size={14} /> ONAYLA
                                </button>
                                <button onClick={() => deleteComment(c._id)} style={{ width: '40px', height: '40px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '40px', textAlign: 'center', opacity: 0.3 }}>Filtre temiz.</div>
                    )}
                </div>

                <div className="lux-card" style={{ padding: 0 }}>
                    <div style={{ padding: '20px 30px', background: '#f8f8f8', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', borderBottom: '1px solid #eee' }}>YAYINDAKİLER ({approvedComments.length})</div>
                    {approvedComments.map(c => (
                        <div key={c._id} style={{ padding: '20px 30px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(c.createdAt).toLocaleDateString('tr-TR')}</div>
                            </div>
                            <button onClick={() => deleteComment(c._id)} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', opacity: 0.3 }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    const AnalyticsView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-view">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '40px' }}>Veri <span style={{ color: 'var(--silk-red)' }}>Görselleştirme</span></h2>
            <div className="grid-3" style={{ gap: '20px', marginBottom: '40px' }}>
                <div className="lux-card" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <BarChart3 size={40} opacity={0.1} />
                    <p style={{ marginTop: '15px', fontWeight: 700, opacity: 0.3 }}>Ziyaretçi Grafiği</p>
                </div>
                <div className="lux-card" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <TrendingUp size={40} opacity={0.1} />
                    <p style={{ marginTop: '15px', fontWeight: 700, opacity: 0.3 }}>Dönüşüm Oranı</p>
                </div>
                <div className="lux-card" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Users size={40} opacity={0.1} />
                    <p style={{ marginTop: '15px', fontWeight: 700, opacity: 0.3 }}>Bölgesel İlgi</p>
                </div>
            </div>
            <div className="lux-card" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ opacity: 0.3, fontWeight: 900 }}>HAFTALIK PERFORMANS MATRİSİ — VERİ BEKLENİYOR</p>
            </div>
        </motion.div>
    );

    const MessagesView = () => (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Gelen Mesajlar</h2>
                <div style={{ background: 'white', padding: '10px 20px', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem', fontWeight: 700 }}>
                    Toplam: {messages.length}
                </div>
            </div>

            {messages.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {messages.map(msg => (
                        <div key={msg._id} className="lux-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{msg.name}</div>
                                        {msg.company && <div style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 600 }}>{msg.company}</div>}
                                        <div style={{ fontSize: '0.8rem', opacity: 0.4, marginTop: '2px' }}>
                                            {new Date(msg.createdAt).toLocaleString('tr-TR')}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMessage(msg._id)}
                                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Sil"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                <div style={{ fontWeight: 900, marginBottom: '10px', color: 'var(--silk-charcoal)' }}>{msg.subject}</div>
                                {msg.message}
                            </div>

                            {(msg.email || msg.phone) && (
                                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, marginTop: '5px' }}>
                                    {msg.email && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={14} /> {msg.email}</div>}
                                    {msg.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Phone size={14} /> {msg.phone}</div>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
                    <Mail size={48} style={{ marginBottom: '20px', opacity: 0.3 }} />
                    <h3>Henüz mesaj yok</h3>
                </div>
            )}
        </motion.div>
    );

    const CategoriesView = () => {
        const [newCatName, setNewCatName] = useState('');
        const [newCatImage, setNewCatImage] = useState(null);
        const [newSubCat, setNewSubCat] = useState('');
        const [selectedCatId, setSelectedCatId] = useState(null);

        // Handle Image Upload Preview
        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setNewCatImage(file);
            }
        };

        const handleAddCategory = async (e) => {
            e.preventDefault();
            if (!newCatName) return;

            const formData = new FormData();
            formData.append('name', newCatName);
            if (newCatImage) {
                formData.append('image', newCatImage);
            }

            const res = await addCategory(formData);
            if (res.success) {
                setNewCatName('');
                setNewCatImage(null);
                alert('Kategori eklendi!');
            } else {
                alert('Hata: ' + res.error);
            }
        };

        const handleAddSubCategory = async (catId) => {
            if (!newSubCat) return;
            const cat = categories.find(c => c._id === catId);
            const updatedSubs = [...(cat.subCategories || []), newSubCat];

            const formData = new FormData();
            formData.append('subCategories', JSON.stringify(updatedSubs));

            const res = await updateCategory(catId, formData);
            if (res.success) {
                setNewSubCat('');
                // setSelectedCatId(null);
            } else {
                alert('Hata: ' + res.error);
            }
        };

        const handleRemoveSubCategory = async (catId, subToRemove) => {
            if (!window.confirm(`${subToRemove} alt kategorisini silmek istediğinize emin misiniz?`)) return;
            const cat = categories.find(c => c._id === catId);
            const updatedSubs = cat.subCategories.filter(s => s !== subToRemove);

            const formData = new FormData();
            formData.append('subCategories', JSON.stringify(updatedSubs));

            await updateCategory(catId, formData);
        };

        const handleDeleteCategory = async (id) => {
            if (window.confirm('Bu kategoriyi ve tüm alt kategorilerini silmek istediğinize emin misiniz?')) {
                await deleteCategory(id);
            }
        };

        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-view">
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '40px' }}>Kategori <span style={{ color: 'var(--silk-red)' }}>Yönetimi</span></h2>

                <div className="grid-2" style={{ gap: '40px', alignItems: 'start' }}>
                    {/* ADD NEW CATEGORY */}
                    <div className="lux-card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Yeni Kategori Ekle</h3>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label className="admin-label-compact">KATEGORİ ADI</label>
                                <input
                                    type="text"
                                    className="lux-input-compact"
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                    placeholder="Örn: Ev Tekstili"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-label-compact">KAPAK GÖRSELİ</label>
                                <div style={{ border: '2px dashed #eee', padding: '20px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('cat-img-input').click()}>
                                    {newCatImage ? (
                                        <div style={{ color: 'var(--silk-green)', fontWeight: 600 }}>{newCatImage.name} seçildi</div>
                                    ) : (
                                        <div style={{ opacity: 0.5 }}>Görsel Seçmek İçin Tıkla</div>
                                    )}
                                    <input type="file" id="cat-img-input" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                                </div>
                            </div>
                            <button type="submit" className="lux-btn" style={{ justifyContent: 'center' }}>
                                <Plus size={18} /> KATEGORİ OLUŞTUR
                            </button>
                        </form>
                    </div>

                    {/* LIST CATEGORIES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {categories.map(cat => (
                            <div key={cat._id} className="lux-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img src={cat.image || 'images/placeholder-cat.jpg'} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{cat.name}</h4>
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, marginBottom: '10px', letterSpacing: '1px' }}>ALT KATEGORİLER</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                        {cat.subCategories && cat.subCategories.length > 0 ? cat.subCategories.map((sub, idx) => (
                                            <div key={idx} style={{ padding: '5px 12px', background: 'white', border: '1px solid #eee', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {sub}
                                                <X size={12} style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => handleRemoveSubCategory(cat._id, sub)} />
                                            </div>
                                        )) : (
                                            <div style={{ opacity: 0.5, fontSize: '0.9rem', fontStyle: 'italic' }}>Henüz alt kategori yok.</div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            placeholder="Yeni Alt Kategori..."
                                            className="lux-input-compact"
                                            style={{ flex: 1 }}
                                            value={selectedCatId === cat._id ? newSubCat : ''}
                                            onChange={(e) => { setSelectedCatId(cat._id); setNewSubCat(e.target.value); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubCategory(cat._id); }}
                                        />
                                        <button
                                            className="lux-btn"
                                            style={{ padding: '0 15px', background: 'var(--silk-charcoal)', color: 'white' }}
                                            onClick={() => { setSelectedCatId(cat._id); handleAddSubCategory(cat._id); }}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    const OrdersView = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ padding: '30px' }}
        >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '30px', color: 'var(--silk-charcoal)' }}>
                Siparişler ({orders.length})
            </h2>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                    <ShoppingBag size={60} style={{ marginBottom: '20px', color: '#ccc' }} />
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>Henüz sipariş bulunmuyor.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {orders.map(order => (
                        <motion.div
                            key={order.id}
                            whileHover={{ scale: 1.01 }}
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '25px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '5px' }}>
                                        Sipariş #{order.id}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                        {new Date(order.date).toLocaleDateString('tr-TR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div style={{
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                }}>
                                    {order.status || 'Onay Bekliyor'}
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: '#374151' }}>
                                    Ürünler:
                                </div>
                                <div style={{ display: 'grid', gap: '10px' }}>
                                    {order.cart?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '10px',
                                                background: '#f9fafb',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>x{item.quantity}</div>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--silk-red)' }}>
                                                {item.price * item.quantity} ₺
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                borderTop: '1px dashed #e5e7eb',
                                paddingTop: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>Toplam:</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--silk-red)' }}>
                                    {order.total} ₺
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );

    const SettingsView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-view">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '40px' }}>Yönetim <span style={{ color: 'var(--silk-red)' }}>Ayarları</span></h2>
            <div className="lux-card" style={{ maxWidth: '600px' }}>
                <div style={{ padding: '30px' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, display: 'block', marginBottom: '10px', opacity: 0.5 }}>ADMİN UNVANI</label>
                        <input type="text" className="lux-input" defaultValue="Üst Yönetici" style={{ borderBottom: '1px solid #eee' }} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, display: 'block', marginBottom: '10px', opacity: 0.5 }}>E-POSTA BİLDİRİMLERİ</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Yeni yorumlarda beni uyar</span>
                            <div style={{ width: '40px', height: '20px', background: 'var(--silk-red)', borderRadius: '10px' }}></div>
                        </div>
                    </div>
                    <button className="lux-btn" style={{ width: '100%', background: '#eee', color: 'black' }}>
                        ŞİFRE DEĞİŞTİR
                    </button>
                    <button className="lux-btn" style={{ width: '100%', marginTop: '15px', border: '1px solid #fee2e2', color: '#991b1b', background: 'none' }}>
                        <LogOut size={16} /> OTURUMU KAPAT
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="admin-layout">
            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #fdfdfd;
                    padding-top: 80px; /* Navbar space */
                }
                .admin-sidebar {
                    width: 280px;
                    background: white;
                    border-right: 1px solid #f0f0f0;
                    padding: 40px 20px;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 80px;
                    height: calc(100vh - 80px);
                }
                .admin-main {
                    flex: 1;
                    padding: 60px 80px;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: #888;
                    margin-bottom: 5px;
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .nav-item:hover {
                    background: #fcfcfc;
                    color: var(--silk-charcoal);
                }
                .nav-item.active {
                    background: #fdf2f2;
                    color: var(--silk-red);
                }
                .mobile-nav {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: white;
                    border-top: 1px solid #eee;
                    padding: 10px 0 25px 0;
                    justify-content: space-around;
                    z-index: 1000;
                    box-shadow: 0 -10px 40px rgba(0,0,0,0.05);
                }
                .mobile-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #888;
                }
                .mobile-item.active {
                    color: var(--silk-red);
                }
                @media (max-width: 1024px) {
                    .admin-sidebar { display: none; }
                    .admin-main { padding: 40px 25px 120px 25px; }
                    .mobile-nav { display: flex; }
                    .grid-4, .grid-3 { grid-template-columns: 1fr 1fr; }
                    .grid-2 { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .grid-4, .grid-3 { grid-template-columns: 1fr; }
                }
            `}</style>

            {/* DESKTOP SIDEBAR */}
            <aside className="admin-sidebar">
                <div style={{ marginBottom: '40px', padding: '0 20px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.3, letterSpacing: '2px', marginBottom: '10px' }}>YÖNETİM</div>
                </div>
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        {item.label}
                    </div>
                ))}
            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && <DashboardView key="dashboard" />}
                    {activeTab === 'products' && <CatalogView key="products" />}
                    {activeTab === 'orders' && <OrdersView key="orders" />}
                    {activeTab === 'categories' && <CategoriesView key="categories" />}
                    {activeTab === 'comments' && <CommentsView key="comments" />}
                    {activeTab === 'messages' && <MessagesView key="messages" />}
                    {activeTab === 'analytics' && <AnalyticsView key="analytics" />}
                    {activeTab === 'settings' && <SettingsView key="settings" />}
                </AnimatePresence>
            </main>

            {/* MOBILE BOTTOM NAV */}
            <nav className="mobile-nav">
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`mobile-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span>{item.label.toUpperCase()}</span>
                    </div>
                ))}
            </nav>
        </div >
    );
};

export default Admin;
