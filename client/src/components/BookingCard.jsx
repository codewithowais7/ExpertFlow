export default function BookingCard({ booking, onCancel }) {
  const expert = booking.expertId;

  return (
    <div className="booking-card">
      {expert?.avatar && (
        <img src={expert.avatar} alt={expert?.name} className="expert-avatar" />
      )}
      <div className="booking-card-info">
        <h3>{expert?.name || 'Expert'}</h3>
        <p className="booking-detail">📅 {booking.date} at {booking.timeSlot}</p>
        {booking.topic && <p className="booking-detail">📝 {booking.topic}</p>}
        <p className="booking-detail">💰 ${expert?.hourlyRate || '—'}/hr</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <span className={`booking-status ${booking.status}`}>
          {booking.status}
        </span>
        {booking.status === 'confirmed' && onCancel && (
          <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}
            onClick={() => onCancel(booking._id)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
