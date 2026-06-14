import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, [filters, sortBy, sortDir]);

  const fetchStores = async () => {
    try {
      const params = { ...filters, sortBy, sortDir };
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
      setOwners(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = { ...formData };
      if (payload.ownerId === '') {
        delete payload.ownerId;
      } else {
        payload.ownerId = parseInt(payload.ownerId);
      }
      await api.post('/admin/stores', payload);
      setSuccess('Store added successfully');
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <div className="page-title">Stores</div>
            <div className="page-subtitle">Manage all stores on the platform</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Store</button>
        </div>

        <div className="card">
          <div className="filter-bar">
            <input
              className="form-input"
              placeholder="Filter by name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <input
              className="form-input"
              placeholder="Filter by email"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
            <input
              className="form-input"
              placeholder="Filter by address"
              name="address"
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name</th>
                  <th onClick={() => handleSort('email')}>Email</th>
                  <th onClick={() => handleSort('address')}>Address</th>
                  <th onClick={() => handleSort('rating')}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.rating ? s.rating.toFixed(1) : '0.0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Add New Store</div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleAddStore}>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input className="form-input" name="name" value={formData.name} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" name="address" value={formData.address} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Owner (Store Owner role)</label>
                <select className="form-select" name="ownerId" value={formData.ownerId} onChange={handleFormChange}>
                  <option value="">No Owner</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Store</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
