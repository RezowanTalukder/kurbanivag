const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'নাম আবশ্যক'] },
  email: {
    type: String,
    required: [true, 'ইমেইল আবশ্যক'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'সঠিক ইমেইল দিন']
  },
  phone: { type: String, required: [true, 'ফোন নম্বর আবশ্যক'] },
  password: { type: String, required: [true, 'পাসওয়ার্ড আবশ্যক'], minlength: 6, select: false },
  address: {
    street: { type: String, required: true },
    thana: { type: String, required: true },
    district: { type: String, required: true },
    division: { type: String, required: true },
    landmark: { type: String }
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
