import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';

const ROLE_LABELS = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

const AdminUserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="page-wrapper">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <Link to="/admin/users" className="text-muted" style={{ textDecoration: 'none' }}>&larr; Back to Users</Link>

        <div className="page-header" style={{ marginTop: '12px' }}>
          <div>
            <div className="page-title">User Details</div>
            <div className="page-subtitle">Full profile information</div>
          </div>
        </div>

        <div className="card">
          <div className="profile-header">
            <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
              <span className="badge" style={{ marginTop: '6px', display: 'inline-block' }}>
                {ROLE_LABELS[user.role] || user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="form-group">
            <div className="form-label">Address</div>
            <div>{user.address}</div>
          </div>

          {user.role === 'STORE_OWNER' && (
            <div className="form-group">
              <div className="form-label">Store Rating</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StarRating value={Math.round(user.rating || 0)} readonly small />
                <span>{user.rating ? user.rating.toFixed(1) : '0.0'} / 5</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
