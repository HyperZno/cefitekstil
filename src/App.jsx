import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './pages/Catalog';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import AddProduct from './pages/admin/AddProduct';
import ProductDetail from './pages/ProductDetail';
import LeaveComment from './pages/LeaveComment';
import NotFound from './pages/NotFound';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import { CommentProvider } from './context/CommentContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './App.css';

import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <LanguageProvider>
                <ProductProvider>
                    <CommentProvider>
                        <FavoritesProvider>
                            <div className="app-container">
                                <Navbar />
                                <main>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/hakkimizda" element={<About />} />
                                        <Route path="/katalog" element={<Catalog />} />
                                        <Route path="/iletisim" element={<Contact />} />
                                        <Route path="/sss" element={<FAQ />} />
                                        <Route path="/admin" element={<Admin />} />
                                        <Route path="/admin/urun-ekle" element={<AddProduct />} />
                                        <Route path="/urun/:slug" element={<ProductDetail />} />
                                        <Route path="/yorum-ekle" element={<LeaveComment />} />
                                        <Route path="*" element={<NotFound />} />
                                    </Routes>
                                </main>
                                <Footer />
                            </div>
                        </FavoritesProvider>
                    </CommentProvider>
                </ProductProvider>
            </LanguageProvider>
        </Router>
    );
}

export default App;
