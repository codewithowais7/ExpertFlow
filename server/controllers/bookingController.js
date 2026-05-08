const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// @desc    Create a new booking (race-condition safe via unique compound index)
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    const { expertId, userName, userEmail, date, timeSlot, topic } = req.body;

    // Validate required fields
    if (!expertId || !userName || !userEmail || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide expertId, userName, userEmail, date, and timeSlot'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Verify expert exists
    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Attempt insert — the unique compound index handles concurrency
    const booking = await Booking.create({
      expertId,
      userName,
      userEmail,
      date,
      timeSlot,
      topic
    });

    // Populate expert info for the response
    await booking.populate('expertId', 'name title avatar');

    // Emit Socket.io event to all users viewing this expert
    const io = req.app.get('io');
    if (io) {
      io.to(expertId).emit('slot_booked', { expertId, date, timeSlot });
    }

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    // Catch duplicate key error → 409 Conflict (race condition caught!)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This slot has already been booked. Please choose another.'
      });
    }
    next(error);
  }
};

// @desc    Get bookings by user email
// @route   GET /api/bookings?email=user@example.com
exports.getBookings = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email query parameter'
      });
    }

    const bookings = await Booking.find({ userEmail: email })
      .populate('expertId', 'name title avatar hourlyRate')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Emit Socket.io event to broadcast slot becoming available again
    const io = req.app.get('io');
    if (io) {
      io.to(booking.expertId.toString()).emit('slot_freed', {
        expertId: booking.expertId.toString(),
        date: booking.date,
        timeSlot: booking.timeSlot
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
