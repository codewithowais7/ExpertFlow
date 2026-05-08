import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function BookingForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const expert = state?.expert;
  const slot = state?.slot;

  const [form, setForm] = useState({
    userName: '',
    userEmail: '',
    topic: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!expert || !slot) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h3>No slot selected</h3>
          <p>Please select an expert and time slot first</p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Browse Experts</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.userName.trim()) errs.userName = 'Name is required';
    if (!form.userEmail.trim()) errs.userEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) errs.userEmail = 'Invalid email format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/bookings', {
        expertId: expert._id,
        userName: form.userName.trim(),
        userEmail: form.userEmail.trim().toLowerCase(),
        date: slot.date,
        timeSlot: slot.time,
        topic: form.topic.trim()
      });

      toast.success('Session booked successfully! 🎉');
      // Save email for My Bookings lookup
      localStorage.setItem('expertflow_email', form.userEmail.trim().toLowerCase());
      navigate('/my-bookings');
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('This slot was just booked by someone else! 😱');
        navigate(`/experts/${expert._id}`);
      } else {
        toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="page">
      <Link to={`/experts/${expert._id}`} className="back-link">← Back to {expert.name}</Link>

      <div className="booking-form-container">
        <div className="page-header">
          <h1 className="page-title">Confirm Booking</h1>
          <p className="page-subtitle">Fill in your details to book the session</p>
        </div>

        <div className="booking-summary">
          <img src={expert.avatar} alt={expert.name} className="expert-avatar" />
          <div className="booking-summary-info">
            <h3>{expert.name}</h3>
            <div className="booking-summary-slot">
              <span>📅 {slot.date}</span>
              <span>🕐 {slot.time}</span>
              <span>💰 ${expert.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Full Name *</label>
            <input
              id="userName"
              type="text"
              value={form.userName}
              onChange={handleChange('userName')}
              placeholder="John Doe"
            />
            {errors.userName && <p className="error-msg">{errors.userName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">Email Address *</label>
            <input
              id="userEmail"
              type="email"
              value={form.userEmail}
              onChange={handleChange('userEmail')}
              placeholder="john@example.com"
            />
            {errors.userEmail && <p className="error-msg">{errors.userEmail}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="topic">Topic / Notes (optional)</label>
            <textarea
              id="topic"
              value={form.topic}
              onChange={handleChange('topic')}
              placeholder="What would you like to discuss?"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Booking...' : `Confirm Booking — $${expert.hourlyRate}`}
          </button>
        </form>
      </div>
    </div>
  );
}
