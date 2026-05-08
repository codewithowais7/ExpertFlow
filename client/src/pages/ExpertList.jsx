import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import ExpertCard from '../components/ExpertCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const SPECIALTIES = ['All', 'AI', 'React', 'Node.js', 'AWS', 'Cybersecurity', 'Mobile', 'Python'];

export default function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 6 };
      if (search) params.search = search;
      if (specialty && specialty !== 'All') params.specialty = specialty;
      const { data } = await api.get('/experts', { params });
      setExperts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch experts:', err);
    } finally {
      setLoading(false);
    }
  }, [search, specialty, page]);

  useEffect(() => {
    const timer = setTimeout(fetchExperts, 300);
    return () => clearTimeout(timer);
  }, [fetchExperts]);

  useEffect(() => { setPage(1); }, [search, specialty]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Find Your Expert</h1>
        <p className="page-subtitle">Book 1-on-1 sessions with world-class professionals</p>
      </div>

      <div className="search-filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or skill..." />
        <select
          className="filter-select"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? '🏷️ All Specialties' : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading experts...</p>
        </div>
      ) : experts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h3>No experts found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="experts-grid">
            {experts.map((expert) => (
              <ExpertCard key={expert._id} expert={expert} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
