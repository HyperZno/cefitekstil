import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Wind, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import CommentSection from '../components/CommentSection';

const Home = () => {
    const { t, lang } = useLanguage();

    const homeContent = {
        TR: {
            cat1: 'Çocuk & Bebek',
            desc1: 'En hassas tenler için en yumuşak dokular.',
            cat2: 'İç Giyim',
            desc2: 'Yüksek kalite ve konforlu tasarımlar.',
            cat3: 'Çeyiz',
            featTitle: 'Premium Kalite',
            featDesc: 'Her dikişte mükemmellik vaadi.',
            f1: 'Hassas Üretim',
            f1d: 'Çocuklarınız için antialerjik ve doğal kumaşlar.',
            f2: 'Zanaatkarlık',
            f2d: '20 yılı aşkın tecrübeyle el işçiliği çeyiz setleri.',
            f3: 'Global Lojistik',
            f3d: 'Dünyanın her yerine hızlı ve güvenli sevkiyat.'
        },
        EN: {
            cat1: 'Kids & Baby',
            desc1: 'Softer textures for the most sensitive skins.',
            cat2: 'Underwear',
            desc2: 'High quality and comfortable designs.',
            cat3: 'Trousseau',
            featTitle: 'Premium Quality',
            featDesc: 'The promise of perfection in every stitch.',
            f1: 'Precision Production',
            f1d: 'Hypoallergenic and natural fabrics for kids.',
            f2: 'Craftsmanship',
            f2d: 'Handcrafted trousseau sets with 20+ years of experience.',
            f3: 'Global Logistics',
            f3d: 'Fast and secure worldwide wholesale shipping.'
        },
        KU: {
            cat1: 'Zarok & Pitik',
            desc1: 'Ji bo çermên herî hestiyar tevneke nerm.',
            cat2: 'Cilên Navxweyî',
            desc2: 'Sêwiranên bi kalîte û rihet.',
            cat3: 'Çeyiz',
            featTitle: 'Kalîteya Bilind',
            featDesc: 'Di her dirûnê de soza kamilbûnê.',
            f1: 'Hilberîna Hestiyar',
            f1d: 'Ji bo zarokên we qumaşên antî-alerjîk û xwezayî.',
            f2: 'Hostayî',
            f2d: 'Bi tecrûbeya zêdetirî 20 salan setên çeyizê yên destan.',
            f3: 'Lojîstîka Global',
            f3d: 'Ji bo hemî cîhanê sewkiyata bilez û ewledar.'
        }
    };

    const c = homeContent[lang] || homeContent.TR;

    return (
        <div className="animate-in">

            {/* LUXURY HERO */}
            <style>{`
                .hero-v3 {
                    padding-top: 400px;
                    padding-bottom: 60px;
                    text-align: left;
                    background-image: url(images/hero.jpg);
                    background-size: cover;
                    background-position: center 50%;
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: flex-start;
                    color: white;
                    overflow: hidden;
                    margin: 0;
                }
                .hero-content {
                    position: relative;
                    z-index: 2;
                    padding-left: 60px;
                    width: 100%;
                    max-width: 800px;
                }
                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 100%);
                    z-index: 1;
                }

                @media (max-width: 768px) {
                    .hero-v3 {
                        padding-top: 150px;
                        padding-bottom: 40px;
                        background-position: center bottom;
                        align-items: center;
                        text-align: center;
                    }
                    .hero-content {
                        padding-left: 20px;
                        padding-right: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-overlay {
                        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 100%);
                    }
                    /* Adjust buttons for mobile */
                    .hero-btn-group {
                        justify-content: center;
                    }
                }
            `}</style>

            <section className="lux-section hero-v3">
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            style={{
                                fontSize: 'clamp(2rem, 8vw, 4rem)',
                                fontWeight: 800,
                                marginBottom: '10px',
                                letterSpacing: '-0.02em',
                                color: 'white',
                                fontFamily: '"Montserrat", sans-serif',
                                textTransform: 'uppercase',
                                lineHeight: 1
                            }}
                        >
                            ÇE&Fİ <span style={{ fontWeight: 200, color: 'rgba(255,255,255,0.95)' }}>TEKSTİL</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 1.1 }}
                            style={{
                                fontSize: '0.8rem',
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                                marginBottom: '40px',
                                opacity: 0.8,
                                color: 'rgba(255,255,255,0.7)',
                                fontFamily: '"Montserrat", sans-serif'
                            }}
                        >
                            {t.heroSub}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.4 }}
                            className="hero-btn-group"
                            style={{ display: 'flex', gap: '15px' }}
                        >
                            <Link to="/hizmetler" className="lux-btn" style={{ background: 'white', color: 'black', padding: '12px 35px', fontSize: '0.8rem', border: 'none' }}>{t.explore} <ArrowRight size={16} /></Link>
                            <Link to="/iletisim" className="lux-btn lux-btn-outline" style={{ borderColor: 'white', color: 'white', padding: '12px 35px', fontSize: '0.8rem' }}>{t.offer}</Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* BENTO CATEGORIES */}
            <section className="lux-section">
                <div className="lux-container">
                    <div style={{ marginBottom: '80px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', marginBottom: '20px' }}>{t.categories}</h2>
                        <div style={{ width: '60px', height: '2px', background: 'var(--silk-red)', margin: '0 auto' }}></div>
                    </div>

                    <div className="bento-grid">
                        <div className="bento-item item-1">
                            <img src="images/cocuk-bebek.jpg" alt="Çocuk & Bebek" />
                            <div className="bento-content">
                                <h3 style={{ fontSize: '3rem' }}>{c.cat1}</h3>
                                <p>{c.desc1}</p>
                            </div>
                        </div>
                        <div className="bento-item item-2">
                            <img src="images/ic-giyim.jpg" alt="İç Giyim" />
                            <div className="bento-content">
                                <h3 style={{ fontSize: '2rem' }}>{c.cat2}</h3>
                                <p>{c.desc2}</p>
                            </div>
                        </div>
                        <div className="bento-item item-3">
                            <img src="images/ceyiz.jpg" alt="Çeyiz" />
                            <div className="bento-content">
                                <h3>{c.cat3}</h3>
                            </div>
                        </div>
                        <div className="bento-item item-4">
                            <div style={{ padding: '40px', background: 'var(--silk-charcoal)', height: '100%', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Wind size={40} style={{ marginBottom: '20px', color: 'var(--silk-crimson)' }} />
                                <h4>{c.featTitle}</h4>
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{c.featDesc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="lux-section" style={{ background: 'var(--silk-white)', borderTop: '1px solid #eee' }}>
                <div className="lux-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', textAlign: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <div className="lux-spin-hover" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                <Heart size={48} color="maroon" style={{ marginBottom: '24px' }} />
                            </div>
                            <h3 style={{ marginBottom: '16px' }}>{c.f1}</h3>
                            <p style={{ color: 'var(--silk-slate)' }}>{c.f1d}</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <div className="lux-spin-hover" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                <Star size={48} color="maroon" style={{ marginBottom: '24px' }} />
                            </div>
                            <h3 style={{ marginBottom: '16px' }}>{c.f2}</h3>
                            <p style={{ color: 'var(--silk-slate)' }}>{c.f2d}</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <div className="lux-spin-hover" style={{ display: 'inline-block', cursor: 'pointer' }}>
                                <ShoppingBag size={48} color="maroon" style={{ marginBottom: '24px' }} />
                            </div>
                            <h3 style={{ marginBottom: '16px' }}>{c.f3}</h3>
                            <p style={{ color: 'var(--silk-slate)' }}>{c.f3d}</p>
                        </div>
                    </div>
                </div>
            </section>

            <CommentSection />
        </div>
    );
};

export default Home;
