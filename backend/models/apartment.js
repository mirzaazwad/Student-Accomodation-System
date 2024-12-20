const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    rent: { type: Number, required: true },
    amenities: {type: [String], enum: ['WiFi', 'Pool', 'Gym', 'Parking', 'Elevator'] },
    images:[String],
    status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Apartment', apartmentSchema);
  