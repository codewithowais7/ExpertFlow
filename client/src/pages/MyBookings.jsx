import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import BookingCard from '../components/BookingCard';

export default function MyBookings() {
  const [email, setEmail] = useState(() => localStorage.getItem('expertflow_email') || '');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchBookings = async (lookupEmail) => {
    const target = lookupEmail || email;
    if (!target.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get('/bookings', { params: { email: target.trim().toLowerCase() } });
      setBookings(data.data);
      localStorage.setItem('expertflow_email', target.trim().toLowerCase());
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchBookings(email);
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      setBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      );
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View and manage your booked sessions</p>
      </div>

      <form onSubmit={handleSubmit} className="email-lookup">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to find bookings..."
          className="form-group"
          style={{
            padding: '0.8rem 1rem',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font)',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn btn-primary">
          {loading ? 'Searching...' : 'Look Up'}
        </button>
      </form>

      {loading ? (
        <div className="loading-container"><div className="spinner" /><p>Loading bookings...</p></div>
      ) : !searched ? null : bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings found</h3>
          <p>No sessions booked with this email yet</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}
