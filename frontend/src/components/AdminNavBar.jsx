import React from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const AdminNavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const admin = (() => {
    try { return JSON.parse(localStorage.getItem('admin')); } catch { return null; }
  })();

  const handleLogout = async () => {
    try {
      await client.post('/admin/logout');
    } catch (err) {
      // ignore errors
    }
    localStorage.removeItem('admin');
    localStorage.removeItem('adminAccessToken');
    if (onLogout) onLogout();
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#0f172a', color: 'white' }}>
      <div style={{ fontWeight: '700' }}>SkillSwap Admin</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {admin && <div style={{ opacity: 0.9 }}>{admin.email || admin.name}</div>}
        {admin ? (
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
        ) : (
          <button onClick={() => navigate('/admin')} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Admin Login</button>
        )}
      </div>
    </div>
  );
};

export default AdminNavBar;
