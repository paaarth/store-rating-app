import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ storeName: null, averageRating: 0, ratings: [] });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/owner/dashboard/${user.id}`);
      setData(res.data);
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
            <div className="page-title">Store Dashboard</div>
            <div className="page-subtitle">See how customers are rating your store</div>
          </div>
        </div>

        {!data.storeName ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🏬</div>
              <div className="empty-state-title">No store assigned</div>
              <div className="text-muted">Contact an administrator to link a store to your account.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">&#127978;</div>
                <div>
                  <div className="stat-value">{data.storeName}</div>
                  <div className="stat-label">Store Name</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">&#11088;</div>
                <div>
                  <div className="stat-value">{data.averageRating.toFixed(1)} / 5</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">&#128203;</div>
                <div>
                  <div className="stat-value">{data.ratings.length}</div>
                  <div className="stat-label">Total Ratings</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="page-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Customer Ratings</div>
              {data.ratings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-title">No ratings yet</div>
                  <div className="text-muted">Once customers rate your store, they'll show up here.</div>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.ratings.map((r, idx) => (
                        <tr key={idx}>
                          <td>{r.userName}</td>
                          <td>{r.userEmail}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <StarRating value={r.value} readonly small />
                              <span className="text-muted">{r.value}/5</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
