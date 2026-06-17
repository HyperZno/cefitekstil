const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İsim gereklidir'],
        trim: true,
        maxlength: [100, 'İsim 100 karakterden uzun olamaz']
    },
    company: {
        type: String,
        trim: true,
        maxlength: [200, 'Firma adı 200 karakterden uzun olamaz']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir email adresi giriniz']
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Mesaj gereklidir'],
        trim: true,
        maxlength: [2000, 'Mesaj 2000 karakterden uzun olamaz']
    },
    subject: {
        type: String,
        required: [true, 'Konu gereklidir'],
        trim: true,
        maxlength: [200, 'Konu 200 karakterden uzun olamaz']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'archived'],
        default: 'new'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for admin panel queries
contactFormSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactForm', contactFormSchema);
