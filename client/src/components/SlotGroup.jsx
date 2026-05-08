export default function SlotGroup({ dayData, selectedSlot, onSelectSlot }) {
  return (
    <div className="slot-group">
      <div className="slot-group-header">
        <span className="day-badge">{dayData.dayName}</span>
        <span>{dayData.date}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {dayData.slots.length} slot{dayData.slots.length !== 1 ? 's' : ''} available
        </span>
      </div>
      <div className="slots-grid">
        {dayData.slots.map((time) => {
          const isSelected = selectedSlot?.date === dayData.date && selectedSlot?.time === time;
          return (
            <button
              key={time}
              className={`slot-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectSlot({ date: dayData.date, dayName: dayData.dayName, time })}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}
