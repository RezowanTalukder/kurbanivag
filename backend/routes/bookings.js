const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Cow = require('../models/Cow');
const pricing = require('../config/pricing.json');
const { protect } = require('../middleware/auth');

// POST /api/bookings  — create booking (auth required)
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { cowId, vagCount, meatChoice, niyyatNames } = req.body;

    if (!cowId || !vagCount || !meatChoice) {
      return res.status(400).json({ success: false, message: 'সব তথ্য দিন' });
    }

    // Atomic slot check + reserve — prevents double booking
    const cow = await Cow.findOneAndUpdate(
      {
        _id: cowId,
        status: 'open',
        $expr: { $lte: [{ $add: ['$filledSlots', vagCount] }, '$totalSlots'] }
      },
      { $inc: { filledSlots: vagCount } },
      { new: true, session }
    );

    if (!cow) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'দুঃখিত, পর্যাপ্ত ভাগ নেই। অন্য গরু বেছে নিন।' });
    }

    // Close cow if full
    if (cow.filledSlots >= cow.totalSlots) {
      await Cow.findByIdAndUpdate(cowId, { status: 'full' }, { session });
    }

    // Snapshot pricing
    const tier = pricing.tiers.find(t => t.id === cow.tierId);
    const totalPerVag = tier.cow_price_per_vag + tier.katakati + tier.packaging + tier.freezer_transport + tier.last_mile_delivery;
    const priceSnapshot = {
      cowPricePerVag: tier.cow_price_per_vag,
      katakati: tier.katakati,
      packaging: tier.packaging,
      freezerTransport: tier.freezer_transport,
      lastMileDelivery: tier.last_mile_delivery,
      totalPerVag,
      totalAmount: totalPerVag * vagCount
    };

    const user = req.user;
    const booking = await Booking.create([{
      user: user._id,
      cow: cow._id,
      vagCount,
      priceSnapshot,
      meatChoice,
      niyyatNames: niyyatNames || [user.name],
      deliveryAddress: { ...user.address, name: user.name, phone: user.phone }
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: booking[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
});

// GET /api/bookings/my — user's own bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('cow')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id — single booking detail
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('cow').populate('user', 'name email phone address');
    if (!booking) return res.status(404).json({ success: false, message: 'বুকিং পাওয়া যায়নি' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'অ্যাক্সেস নেই' });
    }
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
