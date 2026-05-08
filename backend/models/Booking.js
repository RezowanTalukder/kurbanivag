const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true },   // e.g. KV-BK-2847
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cow: { type: mongoose.Schema.Types.ObjectId, ref: 'Cow', required: true },

  vagCount: { type: Number, required: true, min: 1, max: 7 },

  // Snapshot pricing at time of booking (so price changes don't affect paid orders)
  priceSnapshot: {
    cowPricePerVag: Number,
    katakati: Number,
    packaging: Number,
    freezerTransport: Number,
    lastMileDelivery: Number,
    totalPerVag: Number,
    totalAmount: Number
  },

  meatChoice: {
    type: String,
    enum: ['self', 'donate_third'],
    required: true
  },

  // Names for Niyyat recitation
  niyyatNames: [{ type: String }],

  // Delivery address snapshot
  deliveryAddress: {
    name: String,
    phone: String,
    street: String,
    thana: String,
    district: String,
    division: String,
    landmark: String
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentRef: { type: String },         // SSLCommerz tran_id
  paymentGatewayRef: { type: String },  // SSLCommerz val_id

  createdAt: { type: Date, default: Date.now }
});

// Generate booking ref before save
bookingSchema.pre('save', async function (next) {
  if (!this.bookingRef) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingRef = `KV-BK-${String(count + 1001).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
