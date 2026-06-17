const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Kategori getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, subCategories } = req.body;

        let parsedSubCategories = [];
        if (subCategories) {
            try {
                parsedSubCategories = typeof subCategories === 'string' ? JSON.parse(subCategories) : subCategories;
            } catch (e) {
                // If simple comma separated string or single value
                parsedSubCategories = [subCategories];
            }
        }

        const categoryFields = {
            name,
            subCategories: parsedSubCategories
        };

        if (req.file) {
            categoryFields.image = `/uploads/products/${req.file.filename}`; // Reusing products folder or create categories folder
        }

        const category = await Category.create(categoryFields);

        res.status(201).json({
            success: true,
            message: 'Kategori oluşturuldu',
            data: category
        });
    } catch (error) {
        console.error('Kategori oluşturma hatası:', error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Bu kategori zaten var' });
        }
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
        }

        const { name, subCategories } = req.body;

        if (name) category.name = name;

        if (subCategories !== undefined) {
            try {
                category.subCategories = typeof subCategories === 'string' ? JSON.parse(subCategories) : subCategories;
            } catch (e) {
                category.subCategories = [subCategories];
            }
        }

        if (req.file) {
            category.image = `/uploads/products/${req.file.filename}`;
        }

        await category.save();

        res.json({
            success: true,
            message: 'Kategori güncellendi',
            data: category
        });

    } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Kategori silindi',
            data: {}
        });
    } catch (error) {
        console.error('Kategori silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

module.exports = router;
