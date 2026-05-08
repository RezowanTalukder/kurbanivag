const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Cow = require('../models/Cow');
const Booking = require('../models/Booking');
const pricing = require('../config/pricing.json');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, `cow-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Helper: merge pricing data into cow document
const enrichCow = (cow) => {
  const tier = pricing.tiers.find(t => t.id === cow.tierId);
  if (!tier) return cow.toObject();
  const total = tier.cow_price_per_vag + tier.katakati + tier.packaging + tier.freezer_transport + tier.last_mile_delivery;
  return { ...cow.toObject(), tier, totalPerVag: total };
};

// GET /api/cows  — public, list all cows with live slot counts
router.get('/', async (req, res) => {
  try {
    const cows = await Cow.find().sort({ createdAt: 1 });
    const enriched = cows.map(enrichCow);
    res.json({ success: true, data: enriched, season: pricing.season });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cows/tiers — public, just pricing tiers from JSON (no DB)
router.get('/tiers', (req, res) => {
  res.json({ success: true, data: pricing.tiers, season: pricing.season });
});

// GET /api/cows/:id  — public, single cow with partner list
router.get('/:id', async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    if (!cow) return res.status(404).json({ success: false, message: 'গরু পাওয়া যায়নি' });

    const bookings = await Booking.find({ cow: cow._id, paymentStatus: 'paid' })
      .populate('user', 'name');

    const partners = [];
    bookings.forEach(b => {
      for (let i = 0; i < b.vagCount; i++) {
        partners.push({ name: b.user.name, vagIndex: partners.length + 1 });
      }
    });

    res.json({ success: true, data: enrichCow(cow), partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cows  — admin only, create a cow listing
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { tierId } = req.body;
    const tier = pricing.tiers.find(t => t.id === tierId);
    if (!tier) return res.status(400).json({ success: false, message: 'অবৈধ টিয়ার' });

    const count = await Cow.countDocuments();
    const cow = await Cow.create({
      tierId,
      tierSlug: tier.slug,
      cowNumber: `KV-${String(count + 1).padStart(3, '0')}`,
      totalSlots: tier.total_slots
    });
    res.status(201).json({ success: true, data: enrichCow(cow) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/cows/:id/photo — admin, upload cow photo after purchase
router.patch('/:id/photo', protect, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    const cow = await Cow.findByIdAndUpdate(
      req.params.id,
      { photoUrl: `/uploads/${req.file.filename}`, status: 'purchased', purchasedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: enrichCow(cow) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/cows/:id/status — admin, update cow status
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, etimkhanaReceiptUrl, poorSharePhotoUrl } = req.body;
    const update = { status };
    if (status === 'sacrificed') update.sacrificedAt = new Date();
    if (status === 'in_transit') update.transitStartedAt = new Date();
    if (status === 'delivered') update.deliveredAt = new Date();
    if (etimkhanaReceiptUrl) update.etimkhanaReceiptUrl = etimkhanaReceiptUrl;
    if (poorSharePhotoUrl) update.poorSharePhotoUrl = poorSharePhotoUrl;

    const cow = await Cow.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, data: enrichCow(cow) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
