import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'NORMAL_USER',
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, sortDir]);

  const fetchUsers = async () => {
    try {
      const params = { ...filters, sortBy, sortDir };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.name.length < 20 || formData.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be 8-16 characters with one uppercase letter and one special character');
      return;
    }

    try {
      await api.post('/admin/users', formData);
      setSuccess('User added successfully');
      setFormData({ name: '', email: '', address: '', password: '', role: 'NORMAL_USER' });
      fetchUsers();
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <div className="page-title">Users</div>
            <div className="page-subtitle">Manage all registered users and admins</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
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
            <select className="form-select" name="role" value={filters.role} onChange={handleFilterChange}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name</th>
                  <th onClick={() => handleSort('email')}>Email</th>
                  <th onClick={() => handleSort('address')}>Address</th>
                  <th onClick={() => handleSort('role')}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><Link to={`/admin/users/${u.id}`}>{u.name}</Link></td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td><span className="badge">{u.role}</span></td>
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
            <div className="modal-title">Add New User</div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
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
                <label className="form-label">Password</label>
                <input type="password" className="form-input" name="password" value={formData.password} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleFormChange}>
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
