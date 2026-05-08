const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  userName:   { type: String, required: true },
  userEmail:  { type: String, required: true },
  date:       { type: String, required: true },      // ISO 8601 date "2026-05-15"
  timeSlot:   { type: String, required: true },      // "09:00"
  topic:      { type: String },
  status:     { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' }
}, { timestamps: true });

// 🔒 RACE CONDITION SAFETY NET — prevents double bookings at the DB level
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
