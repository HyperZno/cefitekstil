const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Kategori adı gereklidir'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    image: {
        type: String,
        default: 'images/placeholder-category.jpg' // You might want to update this default
    },
    subCategories: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Auto-generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
