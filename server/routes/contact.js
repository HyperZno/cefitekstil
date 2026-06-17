const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ContactForm = require('../models/ContactForm');
const { protect } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
    body('name').trim().notEmpty().withMessage('İsim gereklidir'),
    body('message').trim().notEmpty().withMessage('Mesaj gereklidir'),
    body('subject').trim().notEmpty().withMessage('Konu gereklidir'),
    body('email').optional().isEmail().withMessage('Geçerli bir email adresi giriniz')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, company, email, phone, message, subject } = req.body;

        const submission = await ContactForm.create({
            name,
            company,
            email,
            phone,
            message,
            subject
        });

        res.status(201).json({
            success: true,
            message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
            data: submission
        });
    } catch (error) {
        console.error('İletişim formu gönderme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   GET /api/contact
// @desc    Get all contact form submissions
// @access  Private (Admin only)
router.get('/', protect, async (req, res) => {
    try {
        const { status } = req.query;

        // Build query
        const query = {};
        if (status) {
            query.status = status;
        }

        const submissions = await ContactForm.find(query).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        console.error('İletişim formlarını getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   GET /api/contact/:id
// @desc    Get single contact form submission
// @access  Private (Admin only)
router.get('/:id', protect, async (req, res) => {
    try {
        const submission = await ContactForm.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Form bulunamadı'
            });
        }

        // Mark as read if it was new
        if (submission.status === 'new') {
            submission.status = 'read';
            await submission.save();
        }

        res.json({
            success: true,
            data: submission
        });
    } catch (error) {
        console.error('İletişim formu getirme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact form status
// @access  Private (Admin only)
router.patch('/:id/status', protect, [
    body('status').isIn(['new', 'read', 'archived']).withMessage('Geçerli bir durum seçiniz')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const submission = await ContactForm.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Form bulunamadı'
            });
        }

        submission.status = req.body.status;
        await submission.save();

        res.json({
            success: true,
            message: 'Durum başarıyla güncellendi',
            data: submission
        });
    } catch (error) {
        console.error('Durum güncelleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact form submission
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const submission = await ContactForm.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Form bulunamadı'
            });
        }

        await submission.deleteOne();

        res.json({
            success: true,
            message: 'Form başarıyla silindi',
            data: {}
        });
    } catch (error) {
        console.error('Form silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

module.exports = router;
