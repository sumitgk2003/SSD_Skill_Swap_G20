import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const isAdminLoggedIn = () => {
  try { return !!localStorage.getItem('admin'); } catch { return false; }
};

const AdminProtectedRoute = () => {
  const location = useLocation();
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default AdminProtectedRoute;
