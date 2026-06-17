const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ürün adı gereklidir'],
        trim: true,
        maxlength: [200, 'Ürün adı 200 karakterden uzun olamaz']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    code: {
        type: String,
        trim: true,
        index: true
    },
    mainCategory: {
        type: String,
        required: [true, 'Ana kategori gereklidir'],
        trim: true,
        index: true
    },
    subCategory: {
        type: String,
        required: [true, 'Alt kategori gereklidir'],
        trim: true,
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Fiyat gereklidir'],
        min: [0, 'Fiyat negatif olamaz']
    },
    discountPrice: {
        type: Number,
        min: [0, 'İndirimli fiyat negatif olamaz']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [5000, 'Açıklama çok uzun']
    },
    // Fallback/Thumbnail image for catalogs
    mainImage: {
        type: String,
        default: 'images/placeholder.jpg'
    },
    // Advanced Variants System
    variants: [{
        color: {
            name: { type: String, required: true },
            hex: { type: String, default: '#000000' } // Hex code for UI rendering
        },
        // Images specific to this color variant
        images: [{ type: String }],
        // Size and Stock for this specific color
        sizes: [{
            size: { type: String, required: true }, // S, M, L, XL etc.
            stock: { type: Number, default: 0, min: 0 },
            price: { type: Number }, // Price for this specific size
            discountPrice: { type: Number } // Discount price for this specific size
        }]
    }],
    brand: {
        type: String,
        default: 'Çe&Fi',
        trim: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    packageQuantity: {
        type: Number,
        default: 1,
        min: 1
    },
    specifications: [{
        key: String,
        value: String
    }]
}, {
    timestamps: true
});

// Auto-generate slug from name before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'tr'
        });
        // Append random string to ensure uniqueness if needed, or rely on unique index error
    }
    next();
});

// Indexes for performance
productSchema.index({ mainCategory: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'variants.color.name': 1 });

module.exports = mongoose.model('Product', productSchema);
