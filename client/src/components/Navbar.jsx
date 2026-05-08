import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">⚡</span>
        ExpertFlow
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
          Experts
        </NavLink>
        <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''}>
          My Bookings
        </NavLink>
      </div>
    </nav>
  );
}
