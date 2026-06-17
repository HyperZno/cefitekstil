import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, CheckCircle, Star, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useComments } from '../context/CommentContext';
import ReCAPTCHA from 'react-google-recaptcha';

const LeaveComment = () => {
    const { t } = useLanguage();
    const { addComment } = useComments();
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);

    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !text) return;
        if (!recaptchaToken) {
            setError('Lütfen robot olmadığınızı doğrulayın.');
            return;
        }

        setLoading(true);
        setError('');

        const result = await addComment({ name, text, rating }, recaptchaToken);

        setLoading(false);
        if (result.success) {
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } else {
            setError(result.message);
            // Reset ReCAPTCHA on error
            recaptchaRef.current.reset();
            setRecaptchaToken(null);
        }
    };

    const onRecaptchaChange = (token) => {
        setRecaptchaToken(token);
        if (token) setError('');
    };

    return (
        <div className="lux-section animate-in" style={{ minHeight: '100vh', padding: 0, overflow: 'hidden', background: 'white' }}>
            <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>

                {/* LEFT SIDE - FORM */}
                <div style={{ flex: '1', padding: '180px 80px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>

                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            top: '140px',
                            left: '80px',
                            background: 'white',
                            border: '1px solid #eee',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: 900,
                            fontSize: '0.6rem',
                            letterSpacing: '2px',
                            color: 'var(--silk-charcoal)',
                            zIndex: 20,
                            padding: '10px 20px',
                            borderRadius: '20px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ArrowLeft size={10} /> {t.home.toUpperCase()}
                    </motion.button>

                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        {!submitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div style={{ marginBottom: '45px' }}>
                                    <h1 style={{ fontSize: '2.4rem', marginBottom: '12px', fontWeight: 900, color: 'var(--silk-charcoal)' }}>{t.leaveComment}</h1>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.5, lineHeight: 1.6, maxWidth: '300px' }}>Değerli fikirleriniz bizim için önemli. Deneyiminizi paylaşın.</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    {/* STAR RATING */}
                                    <div style={{ marginBottom: '40px' }}>
                                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '15px', display: 'block', color: 'var(--silk-red)', letterSpacing: '2px' }}>MARKA PUANINIZ</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHover(star)}
                                                    onMouseLeave={() => setHover(0)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                                >
                                                    <Star
                                                        size={24}
                                                        fill={(hover || rating) >= star ? "var(--silk-red)" : "none"}
                                                        color={(hover || rating) >= star ? "var(--silk-red)" : "#ddd"}
                                                        style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lux-input-group" style={{ marginBottom: '35px' }}>
                                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '10px', display: 'block', color: 'var(--silk-charcoal)', letterSpacing: '2px' }}>{t.commentName.toUpperCase()}</label>
                                        <input
                                            type="text"
                                            className="lux-input"
                                            style={{
                                                border: 'none',
                                                borderBottom: '1px solid #ddd',
                                                padding: '12px 0',
                                                fontSize: '0.95rem',
                                                borderRadius: 0,
                                                background: 'transparent',
                                                width: '100%',
                                                transition: 'border-color 0.3s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--silk-red)'}
                                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="lux-input-group" style={{ marginBottom: '50px' }}>
                                        <label style={{ fontSize: '0.6rem', fontWeight: 900, marginBottom: '10px', display: 'block', color: 'var(--silk-charcoal)', letterSpacing: '2px' }}>MESAJINIZ</label>
                                        <textarea
                                            className="lux-input"
                                            style={{
                                                minHeight: '120px',
                                                resize: 'none',
                                                border: '1px solid #f5f5f5',
                                                padding: '20px',
                                                borderRadius: '12px',
                                                background: '#fcfcfc',
                                                fontSize: '0.9rem',
                                                width: '100%',
                                                lineHeight: 1.6,
                                                transition: 'all 0.3s'
                                            }}
                                            onFocus={(e) => e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'}
                                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                                            placeholder={t.commentPlaceholder}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div style={{ marginBottom: '30px' }}>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                            onChange={onRecaptchaChange}
                                        />
                                    </div>
                                    {/* The provided code snippet for comments.map seems to be intended for a different context,
                                        as this component is for *leaving* a comment, not displaying a list of them.
                                        However, following the instruction to insert it, it would go here.
                                        Note: 'comments' variable is not defined in this component's scope.
                                        Assuming 'comments' would be passed as a prop or fetched within this component.
                                    */}
                                    {/*
                                    {comments.map((comment) => {
                                        const initials = comment.name
                                            .split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .substring(0, 2);

                                        return (
                                            <motion.div
                                                key={comment._id || comment.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                style={{
                                                    marginBottom: '30px',
                                                    paddingBottom: '30px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    gap: '20px'
                                                }}
                                            >
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, var(--silk-red), #e11d48)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    fontWeight: '900',
                                                    flexShrink: 0,
                                                    boxShadow: '0 5px 15px rgba(220, 38, 38, 0.2)'
                                                }}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--silk-charcoal)' }}>{comment.name}</div>
                                                            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {[...Array(comment.rating)].map((_, i) => (
                                                                <Star key={i} size={14} fill="var(--silk-red)" stroke="none" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p style={{ lineHeight: 1.6, opacity: 0.8, fontSize: '0.95rem' }}>"{comment.text}"</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    */}

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                color: '#dc2626',
                                                background: '#fef2f2',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginBottom: '20px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <AlertCircle size={16} />
                                            {error}
                                        </motion.div>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="lux-btn"
                                        style={{ width: '100%', justifyContent: 'center', borderRadius: 0, height: '60px', fontSize: '0.9rem', letterSpacing: '2px', opacity: loading ? 0.7 : 1 }}
                                    >
                                        {loading ? 'GÖNDERİLİYOR...' : (
                                            <>
                                                {t.commentSubmit.toUpperCase()} <Send size={16} style={{ marginLeft: '10px' }} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', paddingTop: '60px' }}
                            >
                                <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                                    <CheckCircle size={40} />
                                </div>
                                <h3 style={{ fontSize: '2rem', marginBottom: '12px', color: '#065f46' }}>Teşekkür Ederiz!</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6 }}>{t.commentPending}</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE - PHOTO */}
                <div style={{ flex: '1.2', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        backgroundImage: 'url(images/ceyiz.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(to right, white 0%, transparent 40%)'
                    }}></div>

                    <div style={{ position: 'absolute', bottom: '80px', right: '80px', textAlign: 'right', color: 'white', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <h2 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 0.9, marginBottom: '15px' }}>PİKE<br />SETLERİ</h2>
                        <p style={{ letterSpacing: '5px', fontWeight: 600, fontSize: '0.7rem', opacity: 0.9 }}>PREMİUM ÇEYİZ KOLEKSİYONU</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LeaveComment;
