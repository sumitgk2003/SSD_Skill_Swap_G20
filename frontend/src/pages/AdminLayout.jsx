import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavBar from '../components/AdminNavBar';

const AdminLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavBar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
