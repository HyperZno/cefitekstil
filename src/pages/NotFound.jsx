import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Ghost } from 'lucide-react';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <div className="lux-section animate-in" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--silk-white)'
        }}>
            <div className="lux-container" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '40px' }}>
                        <Ghost size={120} color="var(--silk-red)" strokeWidth={1} style={{ opacity: 0.1 }} />
                        <h1 style={{
                            fontSize: '10rem',
                            fontWeight: 900,
                            color: 'var(--silk-charcoal)',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            letterSpacing: '-5px',
                            margin: 0
                        }}>404</h1>
                    </div>

                    <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 900 }}>{t.error404Title}</h2>
                    <p style={{
                        fontSize: '1.1rem',
                        opacity: 0.5,
                        maxWidth: '500px',
                        margin: '0 auto 50px',
                        lineHeight: 1.6
                    }}>
                        {t.error404Message}
                    </p>

                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="lux-btn"
                            style={{ margin: '0 auto', padding: '18px 45px', borderRadius: '40px' }}
                        >
                            <ArrowLeft size={18} /> {t.backToHome}
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
