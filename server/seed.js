const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const ContactForm = require('./models/ContactForm');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

const initialProducts = [
    {
        name: 'Bebek Örgü Takımı',
        category: 'cocuk',
        price: 249,
        description: '%100 Pamuklu Anti-alerjik kumaş, 3-6 ay uyumlu.',
        image: 'images/cocuk-bebek.jpg',
        inStock: true,
        featured: true
    },
    {
        name: 'Luxe Saten İç Giyim',
        category: 'ic-giyim',
        price: 189,
        description: 'Yüksek kalite yumuşak dokulu saten iç giyim.',
        image: 'images/ic-giyim.jpg',
        inStock: true,
        featured: false
    },
    {
        name: 'Nakışlı Çeyiz Seti',
        category: 'ceyiz',
        price: 1250,
        description: 'Geleneksel motifli, 6 parça lüks çeyiz seti.',
        image: 'images/ceyiz.jpg',
        inStock: true,
        featured: true
    },
    {
        name: 'Pamuklu Bebek Battaniyesi',
        category: 'cocuk',
        price: 150,
        description: 'Yumuşak dokulu, nefes alan pamuklu battaniye.',
        image: 'images/cocuk-bebek.jpg',
        inStock: true,
        featured: false
    },
    {
        name: 'Dantelli Gelin Seti',
        category: 'ceyiz',
        price: 2100,
        description: 'Özel tasarım Fransız dantelli koleksiyon.',
        image: 'images/ceyiz.jpg',
        inStock: true,
        featured: true
    }
];

const seedData = async () => {
    try {
        // Clear existing data (optional, be careful in production)
        await Product.deleteMany({});
        await Admin.deleteMany({});
        await ContactForm.deleteMany({});
        console.log('🗑️  Existing data cleared.');

        // Insert Products
        await Product.create(initialProducts);
        console.log('📦 Products seeded.');

        // Insert Admin
        // This will trigger the pre-save hook to hash the password
        await Admin.create({
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@cefitekstil.com',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            role: 'super-admin'
        });
        console.log('👤 Admin user seeded.');
        console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

        console.log('✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
