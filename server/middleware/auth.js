const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from token (exclude password)
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Yetkisiz erişim - Admin bulunamadı'
                });
            }

            if (!req.admin.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Hesabınız devre dışı bırakılmış'
                });
            }

            next();
        } catch (error) {
            console.error('Token doğrulama hatası:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Yetkisiz erişim - Geçersiz token'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Yetkisiz erişim - Token bulunamadı'
        });
    }
};

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = { protect, generateToken };
