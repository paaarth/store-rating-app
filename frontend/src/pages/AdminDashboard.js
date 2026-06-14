import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <div className="page-title">Dashboard</div>
            <div className="page-subtitle">Overview of platform activity</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">&#128101;</div>
            <div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">&#127978;</div>
            <div>
              <div className="stat-value">{stats.totalStores}</div>
              <div className="stat-label">Total Stores</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">&#11088;</div>
            <div>
              <div className="stat-value">{stats.totalRatings}</div>
              <div className="stat-label">Total Ratings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
