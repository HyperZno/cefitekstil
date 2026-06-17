const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'İsim gereklidir'],
        trim: true,
        maxlength: [50, 'İsim 50 karakterden uzun olamaz']
    },
    text: {
        type: String,
        required: [true, 'Yorum gereklidir'],
        trim: true,
        maxlength: [500, 'Yorum 500 karakterden uzun olamaz']
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
