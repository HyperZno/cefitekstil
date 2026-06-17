import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer style={{ background: 'var(--silk-charcoal)', color: 'white', padding: '60px 0 40px' }}>
            <div className="lux-container" style={{ textAlign: 'center' }}>

                {/* LOGO HEADER */}
                <div style={{ marginBottom: '40px' }}>
                    <Link to="/">
                        <img src="images/logo.png" alt="Logo" style={{ height: '120px', objectFit: 'contain' }} />
                    </Link>
                </div>

                {/* MINIMAL NAV LINKS */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    fontWeight: 600
                }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>{t.home}</Link>
                    <Link to="/hakkimizda" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>{t.about}</Link>
                    <Link to="/hizmetler" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>{t.services}</Link>
                    <Link to="/sss" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>{t.faq}</Link>
                    <Link to="/iletisim" style={{ color: 'white', textDecoration: 'none', opacity: 0.6 }}>{t.contact}</Link>
                </div>

                {/* CONTACT & ADDRESS */}
                <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ fontSize: '1.4rem', color: 'var(--silk-crimson)', fontWeight: 900 }}>
                        <Phone size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                        +90 532 412 13 89
                    </div>
                    <div style={{ opacity: 0.5, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <MapPin size={16} />
                        Bağlar, Diyarbakır, Türkiye
                    </div>
                </div>

                {/* BOTTOM LEGAL */}
                <div style={{
                    paddingTop: '30px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.65rem',
                    opacity: 0.2,
                    letterSpacing: '0.3em'
                }}>
                    © 2025 ÇE&Fİ TEKSTİL. ISTANBUL.
                </div>

            </div>
        </footer>
    );
};

export default Footer;
