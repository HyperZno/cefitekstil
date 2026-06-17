import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { contactAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            setErrorMessage('Lütfen robot olmadığınızı doğrulayın.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        try {
            await contactAPI.submit(formData);
            setStatus('success');
            setFormData({ name: '', company: '', email: '', phone: '', subject: '', message: '' });
            setRecaptchaToken(null);
            if (recaptchaRef.current) recaptchaRef.current.reset();
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message || 'Bir hata oluştu.');
        }
    };

    return (
        <div className="lux-section animate-in" style={{ paddingTop: '200px', paddingBottom: 0 }}>
            <div className="lux-container">
                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '80px', marginBottom: '100px' }}>
                    <div>
                        <h1 style={{ fontSize: '4rem', marginBottom: '40px' }}>{t.reachUs.split(' ')[0]} <br /><span className="lux-text-glow">{t.reachUs.split(' ')[1] || ''}</span></h1>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--silk-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}><Phone /></div>
                                <div><h4 style={{ marginBottom: '5px' }}>{t.phone}</h4><p>+90 5XX XXX XX XX</p></div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--silk-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}><Mail /></div>
                                <div><h4 style={{ marginBottom: '5px' }}>{t.email}</h4><p>info@cefitekstil.com</p></div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--silk-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}><MapPin /></div>
                                <div><h4 style={{ marginBottom: '5px' }}>{t.address}</h4><p>Güngören, İstanbul, Türkiye</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="lux-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <AnimatePresence mode='wait'>
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', minHeight: '400px' }}
                                >
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Mesajınız İletildi</h3>
                                    <p style={{ opacity: 0.7 }}>En kısa sürede size geri dönüş yapacağız.</p>
                                    <button onClick={() => setStatus('idle')} style={{ marginTop: '30px', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: 'var(--silk-charcoal)' }}>Yeni Mesaj Gönder</button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                >
                                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>AD SOYAD *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="lux-input"
                                                style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', outline: 'none' }}
                                                placeholder="Adınız Soyadınız"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>FİRMA ADI</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="lux-input"
                                                style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', outline: 'none' }}
                                                placeholder="Firma Adı (Opsiyonel)"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>TELEFON NUMARASI</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="lux-input"
                                                style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', outline: 'none' }}
                                                placeholder="05XX XXX XX XX"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>E-POSTA ADRESİ</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="lux-input"
                                                style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', outline: 'none' }}
                                                placeholder="ornek@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>KONU *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="lux-input"
                                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', outline: 'none' }}
                                            placeholder="Mesajınızın konusu..."
                                        />
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>MESAJ *</label>
                                        <textarea
                                            name="message"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="lux-input"
                                            style={{ width: '100%', padding: '15px', border: '1px solid #eee', height: '120px', borderRadius: '8px', background: '#f9f9f9', outline: 'none', resize: 'vertical' }}
                                            placeholder="Mesajınız..."
                                        ></textarea>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                            onChange={onRecaptchaChange}
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div style={{ padding: '15px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                            <AlertCircle size={18} />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="lux-btn"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: status === 'loading' ? 0.7 : 1 }}
                                    >
                                        {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                        {t.sendMessage}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* MAP SECTION */}
            <div className="lux-container" style={{ marginBottom: '100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Mağazamız</h2>
                    <div style={{ width: '40px', height: '2px', background: 'var(--silk-red)', margin: '0 auto' }}></div>
                </div>

                <div style={{
                    position: 'relative',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '10px solid white'
                }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25177.047133420543!2d40.1498116743164!3d37.92737250000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40751fd47b0254df%3A0xf032f8663409ba21!2zw4dFJkbEsCBURUtTVMSwTA!5e0!3m2!1str!2str!4v1770991945889!5m2!1str!2str"
                        width="100%"
                        height="500"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Floating Info Card */}
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        left: '40px',
                        background: 'white',
                        padding: '30px',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        maxWidth: '300px',
                        display: 'none' // Hidden on mobile via CSS usually, but let's keep it simple or remove if responsive is hard
                    }} className="desktop-only">
                        <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '10px', color: 'var(--silk-charcoal)' }}>ÇE&Fİ TEKSTİL</div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, marginBottom: '20px' }}>
                            Kalitenin ve zarafetin adresi. Mağazamıza bekleriz.
                        </p>
                        <a
                            href="https://maps.google.com?q=Çe&Fi Tekstil"
                            target="_blank"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                textDecoration: 'none',
                                color: 'var(--silk-crimson)',
                                fontWeight: 700,
                                fontSize: '0.9rem'
                            }}
                        >
                            <MapPin size={18} /> Yol Tarifi Al
                        </a>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
              @media (max-width: 1024px) {
                .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
              }
              @media (max-width: 768px) {
                .form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
                .form-row > div { marginBottom: 20px; }
                .lux-section { paddingTop: 150px !important; }
                h1 { fontSize: 3rem !important; }
              }
              @media (min-width: 768px) {
                .desktop-only { display: block !important; }
              }
            `}} />
        </div>
    );
};

export default Contact;
