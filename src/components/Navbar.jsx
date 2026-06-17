import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../context/CategoryContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showLang, setShowLang] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mobileLangOpen, setMobileLangOpen] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);
    const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
    const { lang, setLang, t } = useLanguage();
    const { cart, removeFromCart, updateQuantity, clearCart, placeBulkOrder } = useProducts();
    const dropdownRef = useRef(null);



    // ... inside Navbar component
    const { categories } = useCategories();

    // Remove the hardcoded categories array
    // const categories = [ ... ];

    const toggleMenu = () => setIsOpen(!isOpen);

    const flags = [
        { code: 'TR', name: 'Türkçe', img: 'https://flagpedia.net/data/flags/h80/tr.png' },
        { code: 'EN', name: 'English', img: 'https://flagpedia.net/data/flags/h80/gb.png' },
        { code: 'KU', name: 'Kürtçe', img: 'https://flagpedia.net/data/flags/h80/tr.png' }
    ];

    const activeLang = flags.find(f => f.code === lang);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLang(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="lux-nav">
                <div className="lux-nav-logo">
                    <Link to="/">
                        <img src="images/logo.png" alt="Logo" />
                    </Link>
                </div>

                <div className="lux-nav-links">
                    <Link to="/">{t.home}</Link>
                    <Link to="/hakkimizda">{t.about}</Link>

                    {/* Desktop Catalog Dropdown */}
                    <div
                        className="nav-dropdown-container"
                        onMouseEnter={() => setShowCatalog(true)}
                        onMouseLeave={() => setShowCatalog(false)}
                        style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                        <Link to="/katalog" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {t.services}
                            <ChevronDown size={14} style={{ transform: showCatalog ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </Link>

                        <AnimatePresence>
                            {showCatalog && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'white',
                                        minWidth: '200px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        borderRadius: '12px',
                                        padding: '10px',
                                        zIndex: 1100,
                                        marginTop: '10px'
                                    }}
                                >
                                    {categories.map(cat => (
                                        <Link
                                            key={cat._id}
                                            to={`/katalog?category=${cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}`}
                                            className="nav-dropdown-item"
                                            onClick={() => setShowCatalog(false)}
                                            style={{
                                                display: 'block',
                                                padding: '10px 15px',
                                                color: 'var(--silk-charcoal)',
                                                fontWeight: 500,
                                                borderRadius: '8px',
                                                transition: '0.2s'
                                            }}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link to="/sss">{t.faq}</Link>
                    <Link to="/iletisim">{t.contact}</Link>

                    {/* Desktop Language Dropdown */}
                    <div className="lang-dropdown-container" ref={dropdownRef}>
                        <div className="lang-active-display" onClick={() => setShowLang(!showLang)}>
                            <img src={activeLang.img} alt={lang} style={{ width: '18px', height: '12px', objectFit: 'cover' }} />
                            <span>{activeLang.name}</span>
                            <ChevronDown size={14} style={{ transform: showLang ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>

                        <AnimatePresence>
                            {showLang && (
                                <motion.div
                                    className="lang-dropdown-menu"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    {flags.map(f => (
                                        <div
                                            key={f.code}
                                            className={`lang-option ${lang === f.code ? 'active' : ''}`}
                                            onClick={() => { setLang(f.code); setShowLang(false); }}
                                        >
                                            <img src={f.img} alt={f.code} style={{ width: '18px', height: '12px', objectFit: 'cover' }} />
                                            <span>{f.name}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Cart Icon */}
                    <div className="cart-icon-container" onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--silk-red)', color: 'white', fontSize: '0.65rem', fontWeight: 900, minWidth: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>

                {/* Mobile Hamburger Button */}
                <div className="md-block-nav" style={{ display: 'none', alignItems: 'center', gap: '15px' }}>
                    <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--silk-red)', color: 'white', fontSize: '0.6rem', minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 1024px) {
          .md-block-nav { display: flex !important; }
        }
        .nav-dropdown-item:hover {
            background: var(--silk-cream);
            color: var(--silk-red) !important;
        }
        .cart-drawer-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 3000;
        }
        .cart-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            max-width: 450px;
            height: 100vh;
            background: white;
            z-index: 3001;
            box-shadow: -10px 0 40px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }
        .cart-header {
            padding: 30px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 30px;
        }
        .cart-item {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            padding-bottom: 25px;
            border-bottom: 1px solid #f5f5f5;
        }
        .cart-footer {
            padding: 30px;
            border-top: 1px solid #eee;
            background: #fafafa;
        }
      `}} />

            {/* CART DRAWER */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className="cart-drawer-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                        />
                        <motion.div
                            className="cart-drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className="cart-header">
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{t.cartTitle} ({cartCount})</h3>
                                <button onClick={() => setIsCartOpen(false)} style={{ background: '#f5f5f5', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="cart-items">
                                {cart.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                                        <ShoppingCart size={60} style={{ marginBottom: '20px' }} />
                                        <p>{t.cartEmpty}</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <img
                                                src={item.mainImage ? `http://localhost:5001${item.mainImage.startsWith('/') ? item.mainImage : '/' + item.mainImage}` : (item.image || '/placeholder.jpg')}
                                                alt={item.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontWeight: 800, marginBottom: '5px' }}>{item.name}</h4>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '4px 10px', borderRadius: '8px' }}>
                                                        <button onClick={() => updateQuantity(item._id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item._id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 900, color: 'var(--silk-red)' }}>{item.price * item.quantity} ₺</div>
                                                        <button onClick={() => removeFromCart(item._id)} style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', marginTop: '5px' }}>
                                                            <Trash2 size={12} /> SİL
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="cart-footer">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.cartTotal}</span>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--silk-red)' }}>{cartTotal} ₺</span>
                                    </div>
                                    <button
                                        className="lux-btn"
                                        onClick={() => {
                                            const confirmed = window.confirm('Siparişinizi onay için admine göndermek istiyor musunuz?');
                                            if (confirmed) {
                                                const orderData = {
                                                    items: cart,
                                                    total: cartTotal,
                                                    status: 'Onay Bekliyor'
                                                };
                                                placeBulkOrder(orderData);
                                                setIsCartOpen(false);

                                                // Show success message and redirect
                                                alert('✅ Siparişiniz başarıyla gönderildi! Admin onayından sonra sizinle iletişime geçilecektir.');
                                                navigate('/');
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '18px',
                                            borderRadius: '14px',
                                            background: 'var(--silk-red)',
                                            color: 'white',
                                            fontWeight: 700,
                                            marginBottom: '10px'
                                        }}
                                    >
                                        ADMİNE GÖNDER
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '14px',
                                            background: '#f1f5f9',
                                            border: 'none',
                                            color: '#64748b',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Sepeti Temizle
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 250 }}
                    >
                        <button
                            onClick={toggleMenu}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <X size={32} />
                        </button>

                        <Link to="/" onClick={toggleMenu} style={{ fontSize: '1.8rem' }}>{t.home}</Link>
                        <Link to="/hakkimizda" onClick={toggleMenu} style={{ fontSize: '1.8rem' }}>{t.about}</Link>

                        {/* Mobile Catalog Link with Toggle Logic */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Link
                                to="/katalog"
                                onClick={(e) => {
                                    if (!mobileCatalogOpen) {
                                        e.preventDefault();
                                        setMobileCatalogOpen(true);
                                    } else {
                                        toggleMenu();
                                    }
                                }}
                                style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                {t.services} <ChevronDown size={20} style={{ transform: mobileCatalogOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </Link>

                            <AnimatePresence>
                                {mobileCatalogOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}
                                    >
                                        {categories.map(cat => (
                                            <Link
                                                key={cat._id}
                                                to={`/katalog?category=${cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}`}
                                                onClick={toggleMenu}
                                                style={{ fontSize: '1rem', opacity: 0.8, fontWeight: 400 }}
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/sss" onClick={toggleMenu} style={{ fontSize: '1.8rem' }}>{t.faq}</Link>
                        <Link to="/iletisim" onClick={toggleMenu} style={{ fontSize: '1.8rem' }}>{t.contact}</Link>


                        {/* Mobile Language Dropdown */}
                        <div style={{ width: '100%', padding: '0 20px', marginTop: '10px' }}>
                            <div
                                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)'
                                }}
                            >
                                <img src={activeLang.img} alt={lang} style={{ width: '20px', height: '14px', objectFit: 'cover' }} />
                                <span>{activeLang.name}</span>
                                <ChevronDown size={16} style={{ transform: mobileLangOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                            </div>

                            <AnimatePresence>
                                {mobileLangOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden', marginTop: '10px' }}
                                    >
                                        {flags.filter(f => f.code !== lang).map(f => (
                                            <div
                                                key={f.code}
                                                onClick={() => { setLang(f.code); setMobileLangOpen(false); toggleMenu(); }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    color: 'rgba(255,255,255,0.8)',
                                                    padding: '10px',
                                                    fontSize: '1rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                }}
                                            >
                                                <img src={f.img} alt={f.code} style={{ width: '18px', height: '12px' }} />
                                                <span>{f.name}</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
