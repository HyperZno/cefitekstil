import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #eee', padding: '32px 0' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
                <h3 style={{ fontSize: '1.2rem' }}>{question}</h3>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {isOpen && <p style={{ marginTop: '20px', color: 'var(--silk-slate)', fontSize: '1rem' }}>{answer}</p>}
        </div>
    );
};

const FAQ = () => {
    const { t, lang } = useLanguage();

    const questions = {
        TR: [
            { question: 'Toptan sipariş limiti nedir?', answer: 'Toptan siparişlerde minimum tutar 10.000 TL olarak belirlenmiştir.' },
            { question: 'Yurtdışına gönderim yapıyor musunuz?', answer: 'Evet, dünyanın her yerine anlaşmalı kargo firmalarımızla sevkiyat yapmaktayız.' },
            { question: 'Özel tasarım üretim yapıyor musunuz?', answer: 'Yüksek adetli siparişlerde firmanıza özel nakış ve tasarım çalışmaları gerçekleştirebiliriz.' }
        ],
        EN: [
            { question: 'What is the wholesale order limit?', answer: 'The minimum amount for wholesale orders is set at 10,000 TL.' },
            { question: 'Do you ship internationally?', answer: 'Yes, we ship all over the world with our contracted cargo companies.' },
            { question: 'Do you do custom design production?', answer: 'For high volume orders, we can carry out embroidery and design work special for your company.' }
        ],
        KU: [
            { question: 'Lîmîta fermanê ya toptan çi ye?', answer: 'Ji bo fermanên toptan mîqdara herî kêm wekî 10,000 TL hatiye diyarkirin.' },
            { question: 'Ma hun dişînin derveyî welat?', answer: 'Erê, em bi parîkariyên kargoyê yên peymankirî re dişînin hemî cîhanê.' },
            { question: 'Ma hun hilberîna sêwirana taybet dikin?', answer: 'Ji bo fermanên bi mîqdara zêde, em dikarin sêwirana taybet ji bo fîrmaya we bikin.' }
        ]
    };

    const faqs = questions[lang] || questions.TR;

    return (
        <div className="lux-section animate-in" style={{ paddingTop: '200px' }}>
            <div className="lux-container" style={{ maxWidth: '800px' }}>
                <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '60px' }}>{t.faqTitle}</h1>
                {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
            </div>
        </div>
    );
};

export default FAQ;
