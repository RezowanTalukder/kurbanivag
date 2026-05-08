const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const SSLCZ_URL = process.env.SSLCZ_IS_LIVE === 'true'
  ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

// POST /api/payments/initiate — start payment session
router.post('/initiate', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate('cow').populate('user', 'name email phone address');

    if (!booking) return res.status(404).json({ success: false, message: 'বুকিং পাওয়া যায়নি' });
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'অ্যাক্সেস নেই' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'এই বুকিং ইতোমধ্যে পেমেন্ট করা হয়েছে' });
    }

    const tran_id = `KV-PAY-${Date.now()}`;
    await Booking.findByIdAndUpdate(bookingId, { paymentRef: tran_id });

    const data = {
      store_id: process.env.SSLCZ_STORE_ID,
      store_passwd: process.env.SSLCZ_STORE_PASS,
      total_amount: booking.priceSnapshot.totalAmount,
      currency: 'BDT',
      tran_id,
      success_url: `${process.env.BACKEND_URL}/api/payments/success`,
      fail_url: `${process.env.BACKEND_URL}/api/payments/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
      product_name: `KurbaniVag - ${booking.vagCount} ভাগ কোরবানি`,
      product_category: 'Qurbani',
      product_profile: 'general',
      cus_name: booking.user.name,
      cus_email: booking.user.email,
      cus_phone: booking.user.phone,
      cus_add1: booking.deliveryAddress.street,
      cus_city: booking.deliveryAddress.district,
      cus_country: 'Bangladesh',
      ship_name: booking.user.name,
      ship_add1: booking.deliveryAddress.street,
      ship_city: booking.deliveryAddress.district,
      ship_country: 'Bangladesh',
      value_a: bookingId   // pass bookingId through to success handler
    };

    const response = await axios.post(SSLCZ_URL, new URLSearchParams(data));
    if (response.data.status === 'SUCCESS') {
      res.json({ success: true, url: response.data.GatewayPageURL });
    } else {
      res.status(500).json({ success: false, message: 'পেমেন্ট গেটওয়ে সংযোগ ব্যর্থ' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/success — SSLCommerz redirects here after payment
router.post('/success', async (req, res) => {
  try {
    const { val_id, tran_id, value_a: bookingId, status } = req.body;
    if (status !== 'VALID' && status !== 'VALIDATED') {
      return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
    }

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: 'paid',
      paymentGatewayRef: val_id
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=success&booking=${bookingId}`);
  } catch {
    res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
  }
});

// POST /api/payments/fail
router.post('/fail', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
});

// POST /api/payments/cancel
router.post('/cancel', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/checkout`);
});

module.exports = router;
