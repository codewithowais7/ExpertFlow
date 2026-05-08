const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// @desc    Get all experts with search, filter, pagination
// @route   GET /api/experts
exports.getExperts = async (req, res, next) => {
  try {
    const { search, specialty, minRate, maxRate, page = 1, limit = 6 } = req.query;
    const filter = {};

    // Text search on name, title, specialties
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { specialties: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by specialty
    if (specialty) {
      filter.specialties = { $regex: specialty, $options: 'i' };
    }

    // Filter by price range
    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .sort({ rating: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: experts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expert with computed available slots for next 7 days
// @route   GET /api/experts/:id
exports.getExpert = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Compute available slots for the next 7 days
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const availableSlots = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = dayNames[date.getDay()];
      const dateStr = date.toISOString().split('T')[0]; // "2026-05-15"

      // Find availability for this day of the week
      const dayAvailability = expert.availability.find(a => a.day === dayName);
      if (!dayAvailability || dayAvailability.timeSlots.length === 0) continue;

      // Get existing bookings for this expert on this date
      const existingBookings = await Booking.find({
        expertId: expert._id,
        date: dateStr,
        status: 'confirmed'
      }).select('timeSlot');

      const bookedSlots = existingBookings.map(b => b.timeSlot);
      const freeSlots = dayAvailability.timeSlots.filter(s => !bookedSlots.includes(s));

      if (freeSlots.length > 0) {
        availableSlots.push({
          date: dateStr,
          dayName,
          slots: freeSlots
        });
      }
    }

    res.json({
      success: true,
      data: {
        expert,
        availableSlots
      }
    });
  } catch (error) {
    next(error);
  }
};
