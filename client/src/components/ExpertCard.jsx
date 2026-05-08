import { useNavigate } from 'react-router-dom';

export default function ExpertCard({ expert }) {
  const navigate = useNavigate();

  return (
    <div className="expert-card" onClick={() => navigate(`/experts/${expert._id}`)}>
      <div className="expert-card-content">
        <div className="expert-card-header">
          <img src={expert.avatar} alt={expert.name} className="expert-avatar" />
          <div className="expert-info">
            <h3>{expert.name}</h3>
            <p className="expert-title">{expert.title}</p>
          </div>
        </div>
        <div className="expert-specialties">
          {expert.specialties?.slice(0, 3).map((s) => (
            <span key={s} className="specialty-tag">{s}</span>
          ))}
          {expert.specialties?.length > 3 && (
            <span className="specialty-tag" style={{
              background: 'var(--primary-light)',
              color: 'var(--primary)'
            }}>+{expert.specialties.length - 3}</span>
          )}
        </div>
        <div className="expert-card-footer">
          <div className="expert-rating">
            ★ {expert.rating}
            <span className="review-count">({expert.reviewCount} reviews)</span>
          </div>
          <div className="expert-rate">
            ${expert.hourlyRate}<span>/hr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
