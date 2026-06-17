import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const { products } = useProducts();
    const { t } = useLanguage();
    const [filter, setFilter] = useState('Hepsi');

    const categories = [t.all, 'Bebek', 'İç Giyim', 'Çeyiz'];
    const filtered = products.filter(p => filter === t.all || p.category === filter || (filter === 'Hepsi' && t.all === 'Hepsi'));

    return (
        <div className="lux-section animate-in" style={{ paddingTop: '200px' }}>
            <div className="lux-container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 style={{ fontSize: '5rem' }}>{t.catalog}</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{
                                    background: filter === cat ? 'var(--silk-red)' : 'transparent',
                                    color: filter === cat ? 'white' : 'var(--silk-charcoal)',
                                    border: '1px solid var(--silk-charcoal)',
                                    padding: '10px 24px',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    transition: '0.3s'
                                }}
                            >{cat}</button>
                        ))}
                    </div>
                </div>

                <div className="grid-3">
                    {filtered.map(p => (
                        <div key={p.id} className="lux-card" style={{ textAlign: 'center' }}>
                            <div style={{ aspectRatio: '1', background: '#eee', backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '24px', borderRadius: '16px' }}></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--silk-red)' }}>{p.category.toUpperCase()}</span>
                            <h3 style={{ margin: '10px 0' }}>{p.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--silk-slate)', marginBottom: '20px' }}>{p.description}</p>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--silk-red)' }}>₺{p.price}</div>
                        </div>
                    ))}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
              @media (max-width: 768px) {
                h1 { fontSize: 3rem !important; }
              }
            `}} />
        </div>
    );
};

export default Services;
