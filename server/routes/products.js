const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products (with optional category filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        // Build query
        const query = {};
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Ürünleri getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Ürün getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   POST /api/products
// @desc    Create new product with advanced variants
// @access  Private (Admin only)
router.post('/', protect, upload.any(), [
    body('name').trim().notEmpty().withMessage('Ürün adı gereklidir'),
    body('mainCategory').notEmpty().withMessage('Ana kategori gereklidir'),
    body('subCategory').notEmpty().withMessage('Alt kategori gereklidir'),
    body('price').isNumeric().withMessage('Fiyat sayısal olmalıdır')
], async (req, res) => {
    try {
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        let { name, mainCategory, subCategory, price, discountPrice, description, code, brand, featured, specifications, variants } = req.body;

        // Parse JSON fields if they came as strings (multipart/form-data quirks)
        if (typeof variants === 'string') variants = JSON.parse(variants);
        if (typeof specifications === 'string') specifications = JSON.parse(specifications);

        // Process Images
        // Expecting files with fieldnames like "variant-0-image-0", etc. OR
        // simpler: "variant_0", "variant_1" array of files for each variant.
        // Let's assume frontend sends files with fieldname "images_{variantIndex}" 

        if (variants && Array.isArray(variants)) {
            variants = variants.map((variant, index) => {
                const variantFiles = req.files.filter(f => f.fieldname === `images_${index}`);
                const imagePaths = variantFiles.map(f => `/uploads/products/${f.filename}`);

                return {
                    ...variant,
                    images: imagePaths.length > 0 ? imagePaths : (variant.images || [])
                };
            });
        }

        // Determine main image (first image of first variant, or placeholder)
        let mainImage = 'images/placeholder.jpg';
        if (variants && variants.length > 0 && variants[0].images && variants[0].images.length > 0) {
            mainImage = variants[0].images[0];
        }

        const product = await Product.create({
            name,
            code,
            mainCategory,
            subCategory,
            price,
            discountPrice,
            description,
            brand,
            featured: featured === 'true' || featured === true,
            specifications: specifications || [],
            variants: variants || [],
            mainImage
        });

        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla oluşturuldu',
            data: product
        });

    } catch (error) {
        console.error('Ürün oluşturma hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', protect, upload.any(), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });

        let { name, mainCategory, subCategory, price, discountPrice, description, code, brand, featured, packageQuantity, specifications, variants } = req.body;

        // Parse JSON fields
        if (typeof variants === 'string') variants = JSON.parse(variants);
        if (typeof specifications === 'string') specifications = JSON.parse(specifications);

        // Process Images similar to POST
        if (variants && Array.isArray(variants)) {
            variants = variants.map((variant, index) => {
                // Check for new files uploaded for this variant
                const variantFiles = req.files.filter(f => f.fieldname === `images_${index}`);
                const newImagePaths = variantFiles.map(f => `/uploads/products/${f.filename}`);

                // Combine with existing images if they were preserved in the sent object
                // Frontend should send existing images in the 'images' array of the variant object
                const existingImages = variant.existingImages || variant.images || [];

                return {
                    ...variant,
                    images: [...existingImages, ...newImagePaths]
                };
            });
        }

        // Update fields
        product.name = name || product.name;
        product.code = code || product.code;
        product.mainCategory = mainCategory || product.mainCategory;
        product.subCategory = subCategory || product.subCategory;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.description = description !== undefined ? description : product.description;
        product.brand = brand || product.brand;
        product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
        product.packageQuantity = packageQuantity !== undefined ? parseInt(packageQuantity) : product.packageQuantity;
        product.specifications = specifications || product.specifications;
        product.variants = variants || product.variants;

        // Update Main Image if changed
        if (product.variants.length > 0 && product.variants[0].images.length > 0) {
            product.mainImage = product.variants[0].images[0];
        }

        await product.save();

        res.json({
            success: true,
            message: 'Ürün başarıyla güncellendi',
            data: product
        });

    } catch (error) {
        console.error('Ürün güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Ürün başarıyla silindi',
            data: {}
        });
    } catch (error) {
        console.error('Ürün silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

module.exports = router;
