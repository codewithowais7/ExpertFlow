const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  title:        { type: String, required: true },
  bio:          { type: String },
  avatar:       { type: String },
  specialties:  [{ type: String }],
  hourlyRate:   { type: Number, required: true },
  rating:       { type: Number, default: 4.5 },
  reviewCount:  { type: Number, default: 0 },
  availability: [{
    day:        { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    timeSlots:  [{ type: String }]
  }]
}, { timestamps: true });

// Text index for search
expertSchema.index({ name: 'text', specialties: 'text', title: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
