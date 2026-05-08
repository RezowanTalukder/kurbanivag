require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cows', require('./routes/cows'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — KurbaniVag API চালু আছে' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি হয়েছে' });
});

// Connect DB & start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB সংযুক্ত');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🕌 KurbaniVag সার্ভার চালু: http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB সংযোগ ব্যর্থ:', err.message);
    process.exit(1);
  });
