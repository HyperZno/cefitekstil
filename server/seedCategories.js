const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const categoriesToSeed = [
    {
        name: 'Çocuk & Bebek',
        image: 'images/cocuk-bebek.jpg',
        subCategories: ['Takım', 'Tulum', 'Zıbın', 'Elbise', 'Pijama']
    },
    {
        name: 'İç Giyim',
        image: 'images/ic-giyim.jpg',
        subCategories: ['Atlet', 'Boxer', 'Külot', 'Sütyen', 'Takım', 'Çorap']
    },
    {
        name: 'Çeyiz',
        image: 'images/ceyiz.jpg',
        subCategories: ['Bornoz', 'Nevresim', 'Havlu', 'Piko Takımı', 'Seccade', 'Bohça']
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        // Check if categories already exist to avoid duplicates or overwriting if user added some
        const count = await Category.countDocuments();

        // Clear existing categories to ensure clean state
        await Category.deleteMany({});
        console.log('Cleared existing categories.');

        for (const cat of categoriesToSeed) {
            const newCat = new Category(cat);
            await newCat.save();
            console.log(`Seeded: ${cat.name}`);
        }

        console.log('Successfully seeded default categories!');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedCategories();
