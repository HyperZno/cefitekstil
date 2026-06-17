import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useComments } from '../context/CommentContext';

const CommentSection = () => {
    const { t } = useLanguage();
    const { comments } = useComments();

    const approvedComments = comments.filter(c => c.status === 'approved');

    return (
        <section className="lux-section" style={{ background: 'var(--silk-white)', borderTop: '1px solid #eee', overflow: 'hidden' }}>
            <div className="lux-container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <MessageSquare size={40} color="var(--silk-red)" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{t.commentsTitle}</h2>
                        <div style={{ width: '40px', height: '2px', background: 'var(--silk-red)', margin: '0 auto', marginBottom: '30px' }}></div>
                        <Link to="/yorum-ekle" style={{ textDecoration: 'none' }}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="lux-btn"
                                style={{ margin: '0 auto', padding: '15px 40px', cursor: 'pointer' }}
                            >
                                {t.leaveComment}
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* MARQUEE CONTAINER */}
            <div style={{ width: '100%', overflow: 'hidden', padding: '20px 0' }}>
                {approvedComments.length > 0 ? (
                    approvedComments.length <= 3 ? (
                        /* STATIC GRID FOR <= 3 COMMENTS */
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                            {approvedComments.map((comment, index) => {
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
                                        className="lux-card"
                                        style={{
                                            flex: '0 0 300px',
                                            height: '300px',
                                            padding: '30px',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            background: 'white'
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'var(--silk-red)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{comment.name}</div>
                                                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                            {[...Array(comment.rating || 5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={12}
                                                                    fill="var(--silk-red)"
                                                                    color="var(--silk-red)"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' }}>
                                                "{comment.text}"
                                            </p>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.4, fontStyle: 'italic', textAlign: 'right' }}>
                                            {new Date(comment.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        /* MARQUEE FOR > 3 COMMENTS */
                        <motion.div
                            style={{ display: 'flex', gap: '30px', paddingLeft: '30px' }}
                            animate={{ x: ["0%", "-100%"] }}
                            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                        >
                            {[...approvedComments, ...approvedComments, ...approvedComments].slice(0, 12).map((comment, index) => {
                                const initials = comment.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .substring(0, 2);

                                return (
                                    <motion.div
                                        key={`${comment.id || comment._id}-${index}`}
                                        className="lux-card"
                                        style={{
                                            flex: '0 0 300px', // Fixed width
                                            height: '300px', // Square
                                            padding: '30px',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            background: 'white'
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '50%',
                                                        background: 'var(--silk-red)',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{comment.name}</div>
                                                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                                                            {[...Array(comment.rating || 5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={12}
                                                                    fill="var(--silk-red)"
                                                                    color="var(--silk-red)"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' }}>
                                                "{comment.text}"
                                            </p>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.4, fontStyle: 'italic', textAlign: 'right' }}>
                                            {new Date(comment.createdAt || Date.now()).toLocaleDateString('tr-TR')}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )
                ) : (
                    <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>Henüz yorum yapılmamış.</div>
                )}
            </div>
        </section>
    );
};

export default CommentSection;
