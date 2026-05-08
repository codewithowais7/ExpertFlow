import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import useSocket from '../hooks/useSocket';
import SlotGroup from '../components/SlotGroup';

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket(id);
  const [expert, setExpert] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const { data } = await api.get(`/experts/${id}`);
        setExpert(data.data.expert);
        setAvailableSlots(data.data.availableSlots);
      } catch (err) {
        console.error('Failed to fetch expert:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
  }, [id]);

  // Real-time: remove booked slot
  useEffect(() => {
    const handleSlotBooked = ({ date, timeSlot }) => {
      setAvailableSlots((prev) =>
        prev.map((dayGroup) =>
          dayGroup.date === date
            ? { ...dayGroup, slots: dayGroup.slots.filter((s) => s !== timeSlot) }
            : dayGroup
        ).filter((dayGroup) => dayGroup.slots.length > 0)
      );
      // Clear selection if the slot we selected was just booked
      if (selectedSlot?.date === date && selectedSlot?.time === timeSlot) {
        setSelectedSlot(null);
      }
    };

    // Real-time: add freed slot back
    const handleSlotFreed = ({ date, timeSlot }) => {
      setAvailableSlots((prev) => {
        const existing = prev.find((d) => d.date === date);
        if (existing) {
          return prev.map((d) =>
            d.date === date
              ? { ...d, slots: [...d.slots, timeSlot].sort() }
              : d
          );
        }
        return prev;
      });
    };

    socket.on('slot_booked', handleSlotBooked);
    socket.on('slot_freed', handleSlotFreed);
    return () => {
      socket.off('slot_booked', handleSlotBooked);
      socket.off('slot_freed', handleSlotFreed);
    };
  }, [socket, selectedSlot]);

  const handleBookSlot = () => {
    if (!selectedSlot) return;
    navigate('/book', {
      state: { expert, slot: selectedSlot }
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container"><div className="spinner" /><p>Loading expert...</p></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">😕</div>
          <h3>Expert not found</h3>
          <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Experts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to Experts</Link>

      <div className="expert-detail-header">
        <img src={expert.avatar} alt={expert.name} className="expert-detail-avatar" />
        <div className="expert-detail-info">
          <h1>{expert.name}</h1>
          <p className="expert-title">{expert.title}</p>
          <p className="expert-bio">{expert.bio}</p>
          <div className="expert-detail-meta">
            <div className="meta-item">
              <span className="meta-value" style={{ color: '#D4A017' }}>★ {expert.rating}</span>
              <span className="meta-label">({expert.reviewCount} reviews)</span>
            </div>
            <div className="meta-item">
              <span className="meta-value" style={{ color: 'var(--emerald)' }}>${expert.hourlyRate}</span>
              <span className="meta-label">/hr</span>
            </div>
          </div>
          <div className="expert-specialties" style={{ marginTop: '1rem' }}>
            {expert.specialties?.map((s) => (
              <span key={s} className="specialty-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="slots-section">
        <h2>📅 Available Slots (Next 7 Days)</h2>
        {availableSlots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No available slots</h3>
            <p>Check back later for new openings</p>
          </div>
        ) : (
          <>
            {availableSlots.map((dayData) => (
              <SlotGroup
                key={dayData.date}
                dayData={dayData}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            ))}
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: '1.2rem', padding: '1rem' }}
              disabled={!selectedSlot}
              onClick={handleBookSlot}
            >
              {selectedSlot
                ? `Book ${selectedSlot.time} on ${selectedSlot.date} →`
                : 'Select a time slot to continue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
