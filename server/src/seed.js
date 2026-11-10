require('dotenv').config();
const mongoose = require('mongoose');
const { Transaction, User } = require('./models');
const { SEED_TRANSACTIONS } = require('./dataset');

const seed = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sentinelpay';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB Atlas...');

    await Transaction.deleteMany();
    await User.deleteMany();

    await Transaction.insertMany(SEED_TRANSACTIONS);
    console.log(`[Seed] Seeded ${SEED_TRANSACTIONS.length} realistic Kaggle-benchmark transactions.`);

    const user = await User.create({
      name: 'Niteesh Balajee',
      email: 'niteesh@sentinelpay.com',
      password: 'admin123',
      role: 'analyst',
    });
    console.log(`[Seed] Created Analyst account: ${user.email} (Password: admin123)`);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err.message);
    process.exit(1);
  }
};

seed();

