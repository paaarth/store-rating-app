import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLE_LABELS = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // panel is currently open: null / profile / password / appearance
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panel) => {
    setOpenPanel(openPanel === panel ? null : panel);
  };

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user.name,
    address: user.address,
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (profileData.name.length < 20 || profileData.name.length > 60) {
      setProfileError('Name must be between 20 and 60 characters');
      return;
    }
    if (profileData.address.length > 400) {
      setProfileError('Address must not exceed 400 characters');
      return;
    }

    try {
      const res = await api.put(`/auth/profile/${user.id}`, profileData);
      updateUser(res.data);
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setPasswordError('Password must be 8-16 characters with one uppercase letter and one special character');
      return;
    }

    try {
      await api.put(`/auth/password/${user.id}`, passwordData);
      setPasswordSuccess('Password updated successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <div className="page-title">Settings</div>
            <div className="page-subtitle">Manage your account, preferences, and security</div>
          </div>
        </div>

        {/* Profile summary card */}
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

        {/* Feature list */}
        <div className="card">
          <div className="settings-section-title">Account</div>
          <div className="settings-list">

            {/* Edit Profile */}
            <div className="settings-item" onClick={() => togglePanel('profile')}>
              <div className="settings-icon">&#128100;</div>
              <div className="settings-text">
                <div className="settings-item-title">Edit Profile</div>
                <div className="settings-item-subtitle">Update your name and address</div>
              </div>
              <div className="settings-arrow">{openPanel === 'profile' ? '\u2303' : '\u203A'}</div>
            </div>

            {openPanel === 'profile' && (
              <div style={{ padding: '4px 4px 20px 58px' }}>
                {profileError && <div className="alert alert-error">{profileError}</div>}
                {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input
                      className="form-input"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {/* Change Password */}
            <div className="settings-item" onClick={() => togglePanel('password')}>
              <div className="settings-icon">&#128274;</div>
              <div className="settings-text">
                <div className="settings-item-title">Change Password</div>
                <div className="settings-item-subtitle">Update your account password</div>
              </div>
              <div className="settings-arrow">{openPanel === 'password' ? '\u2303' : '\u203A'}</div>
            </div>

            {openPanel === 'password' && (
              <div style={{ padding: '4px 4px 20px 58px' }}>
                {passwordError && <div className="alert alert-error">{passwordError}</div>}
                {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="settings-section-title">Preferences</div>
          <div className="settings-list">
            <div className="settings-item" onClick={() => togglePanel('appearance')} style={{ cursor: 'default' }}>
              <div className="settings-icon">{theme === 'light' ? '\u2600\uFE0F' : '\u{1F319}'}</div>
              <div className="settings-text">
                <div className="settings-item-title">Theme</div>
                <div className="settings-item-subtitle">Switch between light and dark mode</div>
              </div>
              <div className="theme-toggle" onClick={(e) => e.stopPropagation()}>
                <div
                  className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                  onClick={toggleTheme}
                >
                  <div className="toggle-knob">{theme === 'dark' ? '\u{1F319}' : '\u2600\uFE0F'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session */}
        <div className="card">
          <div className="settings-section-title">Session</div>
          <div className="settings-list">
            <div className="settings-item" onClick={handleLogout}>
              <div className="settings-icon" style={{ background: 'rgba(255,92,92,0.12)', color: 'var(--danger-color)' }}>
                &#128682;
              </div>
              <div className="settings-text">
                <div className="settings-item-title" style={{ color: 'var(--danger-color)' }}>Logout</div>
                <div className="settings-item-subtitle">Sign out of your account on this device</div>
              </div>
              <div className="settings-arrow">&#8250;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
