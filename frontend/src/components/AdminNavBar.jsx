import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import client from '../api/client';

const AdminNavBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const admin = (() => {
    try { return JSON.parse(localStorage.getItem('admin')); } catch { return null; }
  })();

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, minWidth: 160 }}>
        <div style={{ fontWeight: '700' }}>SkillSwap Admin</div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {/* Mobile: show hamburger */}
        {isMobile ? (
          <div>
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle admin menu"
              style={{ background: 'transparent', border: '1px solid rgba(226,232,240,0.12)', color: '#e0e7ff', padding: 8, borderRadius: 8 }}
            >
              {/* hamburger icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileOpen && (
              <div style={{ position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', border: '1px solid #111827', padding: 8, borderRadius: 8, boxShadow: '0 10px 25px rgba(2,6,23,0.6)' }}>
                {[{ to: '/admin/dashboard', label: 'Dashboard' }, { to: '/admin/users', label: 'Users' }, { to: '/admin/skills', label: 'Skills' }, { to: '/admin/disputes', label: 'Disputes' }, { to: '/admin/policy', label: 'Policy' }].map((item) => (
                  <div key={item.to} style={{ margin: 6 }}>
                    <NavLink to={item.to} onClick={() => setMobileOpen(false)} style={({ isActive }) => ({ color: isActive ? '#0f172a' : '#e0e7ff', background: isActive ? '#e0e7ff' : 'transparent', padding: '8px 10px', borderRadius: 6, display: 'inline-block', textDecoration: 'none' })}>{item.label}</NavLink>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {[{ to: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12h18M3 6h18M3 18h18' }, { to: '/admin/users', label: 'Users', icon: 'M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z' }, { to: '/admin/skills', label: 'Skills', icon: 'M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 3.5 1-6L3 8.5 9 8 12 2z' }, { to: '/admin/disputes', label: 'Disputes', icon: 'M12 9v4' }, { to: '/admin/policy', label: 'Policy', icon: 'M4 6h16M4 10h16M4 14h16' }].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 8,
                  color: isActive ? '#0f172a' : '#e0e7ff',
                  background: isActive ? '#e0e7ff' : 'transparent',
                  textDecoration: 'none',
                  fontWeight: 600,
                  boxShadow: isActive ? '0 6px 20px rgba(14,165,233,0.12)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                })}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={item.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
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
