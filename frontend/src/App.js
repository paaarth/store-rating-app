import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import AdminUserDetails from './pages/AdminUserDetails';
import UserStores from './pages/UserStores';
import OwnerDashboard from './pages/OwnerDashboard';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" />;
  return <Navigate to="/stores" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<HomeRedirect />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminUserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminStores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/stores"
              element={
                <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                  <UserStores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
