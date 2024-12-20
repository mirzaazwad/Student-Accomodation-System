const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']},
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'landlord'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
