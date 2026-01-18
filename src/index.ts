import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import auctionRoutes from './routes/auctions';
import bidRoutes from './routes/bids';
import userRoutes from './routes/users';

import runDemo from './scripts/runDemo';

const MONGO_URI = 'mongodb+srv://trufanovruslan33_db_user:2oJba0zGpqN5FcYo@cluster0.udmtua5.mongodb.net/auction?retryWrites=true&w=majority';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Завершаем процесс, если не удалось подключиться
  }

  const app = express();
  app.use(express.json());

  app.use('/api/auctions', auctionRoutes);
  app.use('/api/bids', bidRoutes);
  app.use('/api/users', userRoutes);

  try {
    await runDemo();
    console.log('🚀 Demo script completed');
  } catch (err) {
    console.error('❌ Demo script error:', err);
  }

  app.use(express.static(path.join(__dirname, '../public')));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🌐 Server running on http://localhost:${PORT}`)
  );
}

// Ловим необработанные ошибки
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

start();
