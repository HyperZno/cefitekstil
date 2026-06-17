const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect, generateToken } = require('../middleware/auth');

const axios = require('axios');

// ReCAPTCHA Verification Helper (duplicated for simplicity or move to utils)
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

// @route   POST /api/auth/register
// @desc    Register first admin (should be disabled after first use)
// @access  Public (but check if admin exists)
router.post('/register', [
    body('username').trim().isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalıdır'),
    body('email').isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır')
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

        // Check if any admin exists
        const adminExists = await Admin.findOne();
        if (adminExists) {
            return res.status(403).json({
                success: false,
                message: 'Admin kaydı zaten mevcut. Bu endpoint devre dışı.'
            });
        }

        const { username, email, password } = req.body;

        // Create admin
        const admin = await Admin.create({
            username,
            email,
            password,
            role: 'super-admin'
        });

        // Generate token
        const token = generateToken(admin._id);

        res.status(201).json({
            success: true,
            message: 'Admin başarıyla oluşturuldu',
            data: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                token
            }
        });
    } catch (error) {
        console.error('Admin kayıt hatası:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Bu kullanıcı adı veya email zaten kullanılıyor'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login admin
// @access  Public
router.post('/login', [
    body('username').trim().notEmpty().withMessage('Kullanıcı adı gereklidir'),
    body('password').notEmpty().withMessage('Şifre gereklidir'),
    body('recaptchaToken').notEmpty().withMessage('ReCAPTCHA doğrulaması gereklidir')
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

        const { username, password, recaptchaToken } = req.body;

        // Verify ReCAPTCHA
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ success: false, message: 'ReCAPTCHA doğrulaması başarısız.' });
        }

        // Find admin and include password for comparison
        const admin = await Admin.findOne({ username }).select('+password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz kullanıcı adı veya şifre'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz kullanıcı adı veya şifre'
            });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                token
            }
        });
    } catch (error) {
        console.error('Login hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.admin._id,
                username: req.admin.username,
                email: req.admin.email,
                role: req.admin.role
            }
        });
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
});

module.exports = router;
