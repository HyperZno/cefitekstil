const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');
const axios = require('axios');

// ReCAPTCHA Verification Helper
const verifyRecaptcha = async (token) => {
    if (!token) return false;

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
        );
        return response.data.success;
    } catch (error) {
        console.error('ReCAPTCHA validation error:', error);
        return false;
    }
};

// @route   POST /api/comments
// @desc    Submit a new comment
// @access  Public
router.post('/', [
    body('name').trim().notEmpty().withMessage('İsim gereklidir'),
    body('text').trim().notEmpty().withMessage('Yorum metni gereklidir'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arasında olmalıdır'),
    body('recaptchaToken').notEmpty().withMessage('ReCAPTCHA doğrulaması gereklidir')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, text, rating, recaptchaToken } = req.body;

        // Verify ReCAPTCHA
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ success: false, message: 'ReCAPTCHA doğrulaması başarısız. Lütfen tekrar deneyin.' });
        }

        const comment = await Comment.create({
            name,
            text,
            rating,
            status: 'pending' // Default to pending
        });

        res.status(201).json({
            success: true,
            message: 'Yorumunuz alındı ve onay sürecine girdi.',
            data: comment
        });
    } catch (error) {
        console.error('Yorum gönderme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası', error: error.message });
    }
});

// @route   GET /api/comments
// @desc    Get all APPROVED comments (for public view)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(10);
        res.json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        console.error('Yorumları getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// @route   GET /api/comments/all
// @desc    Get ALL comments (pending & approved)
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        console.error('Admin yorumları getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// @route   PATCH /api/comments/:id/status
// @desc    Update comment status (approve/reject)
// @access  Private (Admin)
router.patch('/:id/status', protect, [
    body('status').isIn(['pending', 'approved']).withMessage('Geçersiz durum')
], async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });

        comment.status = req.body.status;
        await comment.save();

        res.json({ success: true, message: 'Yorum durumu güncellendi', data: comment });
    } catch (error) {
        console.error('Yorum durumu güncelleme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Yorum bulunamadı' });

        await comment.deleteOne();
        res.json({ success: true, message: 'Yorum silindi' });
    } catch (error) {
        console.error('Yorum silme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

module.exports = router;
