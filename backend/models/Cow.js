const mongoose = require('mongoose');

const cowSchema = new mongoose.Schema({
  tierId: { type: String, required: true },   // matches pricing.json tier id
  tierSlug: { type: String, required: true },
  cowNumber: { type: String, unique: true },  // e.g. KV-001
  name: { type: String },                     // optional custom name
  photoUrl: { type: String, default: null },  // uploaded after purchase
  vetClearanceUrl: { type: String, default: null },
  status: {
    type: String,
    enum: ['open', 'full', 'purchased', 'health_cleared', 'sacrificed', 'in_transit', 'delivered'],
    default: 'open'
  },
  filledSlots: { type: Number, default: 0 },
  totalSlots: { type: Number, default: 7 },
  purchasedAt: { type: Date },
  sacrificedAt: { type: Date },
  transitStartedAt: { type: Date },
  deliveredAt: { type: Date },
  etimkhanaReceiptUrl: { type: String, default: null },
  poorSharePhotoUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cow', cowSchema);
