import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Award, Target, Globe, User } from 'lucide-react';

const Counter = ({ value, suffix = "+" }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
            const controls = animate(0, numericValue, {
                duration: 2,
                onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
                ease: "easeOut"
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {displayValue.toLocaleString()}{suffix}
        </span>
    );
};

const About = () => {
    const { t } = useLanguage();

    const stats = [
        { label: t.experience, value: 20, suffix: "+", icon: <Award size={20} /> },
        { label: t.dealers, value: 500, suffix: "+", icon: <Globe size={20} /> },
        { label: t.productTypes, value: 10000, suffix: "+", icon: <Target size={20} /> }
    ];

    const founders = [
        { name: t.founderCetin, title: t.founderTitle, initial: 'ÇK' },
        { name: t.founderMehmet, title: t.founderTitle, initial: 'MO' }
    ];

    const timelineData = [
        { year: '2009', text: t.timeline2009 },
        { year: '2015', text: t.timeline2015 },
        { year: '2022', text: t.timeline2022 },
        { year: '2024', text: t.timeline2024 },
        { year: 'Gelecek', text: t.timelineFuture }
    ];

    return (
        <div className="lux-about-page animate-in" style={{ background: 'white' }}>
            <style>{`
                .lux-about-page {
                    padding-top: 100px;
                    padding-bottom: 80px;
                }
                .hero-split {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 60px;
                    align-items: center;
                    margin-bottom: 80px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-top: 40px;
                }
                .stat-card {
                    padding: 20px;
                    background: #fcfcfc;
                    border-radius: 16px;
                    border: 1px solid #f5f5f5;
                }
                .founders-section {
                    background: #fafafa;
                    padding: 80px 0;
                    margin-top: 60px;
                }
                .founder-card {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .founder-avatar {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    background: var(--silk-charcoal);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    font-weight: 900;
                    margin-bottom: 20px;
                    border: 6px solid white;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.05);
                    position: relative;
                    overflow: hidden;
                }
                .timeline-container {
                    position: relative;
                    padding: 80px 0;
                    background: white;
                }
                .timeline-line {
                    position: absolute;
                    left: 50%;
                    top: 150px;
                    bottom: 100px;
                    width: 1px;
                    background: #eee;
                    transform: translateX(-50%);
                }
                .timeline-item {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    margin-bottom: 60px;
                    position: relative;
                }
                .timeline-dot {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    width: 14px;
                    height: 14px;
                    background: var(--silk-red);
                    border: 3px solid white;
                    border-radius: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    box-shadow: 0 0 15px rgba(183,18,52,0.2);
                }
                .timeline-content {
                    padding: 25px;
                    background: #fafafa;
                    border-radius: 20px;
                    position: relative;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.02);
                }
                .timeline-content::after {
                    content: '';
                    position: absolute;
                    top: 15px;
                    width: 12px;
                    height: 12px;
                    background: #fafafa;
                    transform: rotate(45deg);
                }
                .item-left .timeline-content { grid-column: 1; text-align: right; }
                .item-left .timeline-content::after { right: -6px; }
                .item-right .timeline-content { grid-column: 2; text-align: left; }
                .item-right .timeline-content::after { left: -6px; }
                
                @media (max-width: 1024px) {
                    .hero-split { grid-template-columns: 1fr; gap: 40px; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .timeline-line { left: 30px; }
                    .timeline-dot { left: 30px; }
                    .timeline-item { grid-template-columns: 1fr; padding-left: 60px; text-align: left !important; }
                    .item-left .timeline-content, .item-right .timeline-content { grid-column: 1; text-align: left; }
                    .timeline-content::after { left: -6px !important; right: auto !important; }
                }
            `}</style>

            <div className="lux-container">
                {/* HERO SECTION */}
                <div className="hero-split">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--silk-red)', fontWeight: 900, display: 'block', marginBottom: '15px' }}>
                            {t.ourStory.toUpperCase()}
                        </span>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', color: 'var(--silk-charcoal)' }}>
                            Çe&Fi Tekstil <br />
                            <span style={{ color: 'var(--silk-red)' }}>{t.heritage.toUpperCase()}</span>
                        </h1>
                        <p style={{ fontSize: '1.05rem', color: 'var(--silk-slate)', lineHeight: 1.6, marginBottom: '30px' }}>
                            {t.aboutMainText}
                        </p>

                        <div className="stats-grid">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="stat-card">
                                    <div style={{ color: 'var(--silk-red)', marginBottom: '10px' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '3px' }}>
                                        <Counter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, letterSpacing: '0.5px' }}>{stat.label.toUpperCase()}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="lux-card"
                        style={{ padding: 0, overflow: 'hidden', height: '450px', borderRadius: '30px' }}
                    >
                        <img src="images/team.jpg" alt="Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                </div>
            </div>

            {/* FOUNDERS SECTION */}
            <section className="founders-section">
                <div className="lux-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2px', color: 'var(--silk-red)' }}>YÖNETİCİLERİMİZ</span>
                        <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '8px' }}>{t.foundersTitle}</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', maxWidth: '700px', margin: '0 auto' }}>
                        {founders.map((founder, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                className="founder-card"
                            >
                                <div className="founder-avatar">
                                    <span style={{ position: 'relative', zIndex: 1 }}>{founder.initial}</span>
                                    <User size={50} style={{ position: 'absolute', opacity: 0.05, bottom: -6 }} />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '3px' }}>{founder.name}</h3>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--silk-red)', letterSpacing: '0.5px' }}>{founder.title.toUpperCase()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIMELINE SECTION */}
            <section className="timeline-container">
                <div className="lux-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--silk-slate)' }}>EVRİMİMİZ</span>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>{t.timelineTitle}</h2>
                    </div>

                    <div className="timeline-line"></div>

                    {timelineData.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className={`timeline-item ${idx % 2 === 0 ? 'item-left' : 'item-right'}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--silk-red)', marginBottom: '10px', lineHeight: 1 }}>
                                    {item.year}
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--silk-charcoal)', fontWeight: 600, opacity: 0.8, lineHeight: 1.5 }}>
                                    {item.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <div className="lux-container">
                <div className="lux-card" style={{ padding: '60px', textAlign: 'center', background: 'var(--silk-charcoal)', color: 'white', borderRadius: '30px' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '20px' }}>Geleceği Dokuyoruz</h2>
                    <p style={{ fontSize: '1rem', opacity: 0.6, maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                        Tekstildeki tecrübemizi modern teknolojilerle birleştirerek, dünya çapında bir kalite standardı oluşturmayı hedefliyoruz. Çe&Fi ailesi olarak sürdürülebilir ve estetik bir gelecek için çalışıyoruz.
                    </p>
                    <Link to="/iletisim">
                        <button className="lux-btn" style={{ background: 'white', color: 'black', margin: '0 auto' }}>{t.joinUs}</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
