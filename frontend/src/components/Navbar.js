import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-brand-icon">★</div>
        StoreRate
      </Link>
      <div className="navbar-links">
        {user && user.role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>Users</Link>
            <Link to="/admin/stores" className={`nav-link ${isActive('/admin/stores') ? 'active' : ''}`}>Stores</Link>
          </>
        )}
        {user && user.role === 'NORMAL_USER' && (
          <Link to="/stores" className={`nav-link ${isActive('/stores') ? 'active' : ''}`}>Stores</Link>
        )}
        {user && user.role === 'STORE_OWNER' && (
          <Link to="/owner/dashboard" className={`nav-link ${isActive('/owner/dashboard') ? 'active' : ''}`}>Dashboard</Link>
        )}
        {user && (
          <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>Settings</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
