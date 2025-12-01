import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import totalUsersIcon from '../assets/total_users.png';
import totalSkillsIcon from '../assets/total_skills.png';
import totalMatchesIcon from '../assets/total_matches.jpg';
import disputesIcon from '../assets/disputes.png';
import policyIcon from '../assets/policy.png';

const Icon = ({ children }) => (
  <div style={{ width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff' }}>
    {children}
  </div>
);

const Stat = ({ title, value, to, icon }) => {
  const [hover, setHover] = useState(false);
  const base = {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: hover ? '0 12px 30px rgba(2,6,23,0.08)' : '0 6px 18px rgba(2,6,23,0.04)',
    transform: hover ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 160ms ease, box-shadow 160ms ease',
    textDecoration: 'none',
    color: 'inherit',
  };

  const inner = (
    <div style={base} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} role={to ? 'link' : 'region'} tabIndex={0}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Icon>{icon}</Icon>
        <div>
          <div style={{ color: '#374151', fontSize: 13 }}>{title}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0d6efd' }}>{value}</div>
        </div>
      </div>
      <div style={{ opacity: 0.08 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18l6-6-6-6" stroke="#000" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );

  if (to) return <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link>;
  return inner;
};

const AdminPage = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalSkills, setTotalSkills] = useState(null);
  const [totalMatches, setTotalMatches] = useState(null);
  const [disputesCount, setDisputesCount] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, skillsRes] = await Promise.all([
          client.get('/admin/users'),
          client.get('/admin/skills'),
        ]);

        const users = usersRes?.data?.data || [];
        const skills = skillsRes?.data?.data || [];

        setTotalUsers(Array.isArray(users) ? users.length : 0);
        setTotalSkills(Array.isArray(skills) ? skills.length : 0);

        const matchesSum = Array.isArray(skills) ? skills.reduce((acc, s) => acc + (s.matchesCount || 0), 0) : 0;
        setTotalMatches(matchesSum);

        if (Array.isArray(skills) && skills.length) {
          const sorted = [...skills].sort((a, b) => (b.matchesCount || 0) - (a.matchesCount || 0));
          setTopSkills(sorted.slice(0, 5));
        }

        if (Array.isArray(users) && users.length) {
          setRecentUsers(users.slice(0, 6).map((u) => ({ id: u._id || u.id || u.email, name: u.name || u.email, email: u.email })));
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
        setTotalUsers(0);
        setTotalSkills(0);
        setTotalMatches(0);
      }
    };

    fetchAll();
    const onResize = () => setIsWide(window.innerWidth >= 1600);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7fb', padding: 36, fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 18px' }}>
        <header style={{ marginBottom: 14 }}>
          <h1 style={{ margin: 0, fontSize: 24, color: '#0f1724' }}>Admin Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Overview and quick links</p>
        </header>

        <section
          style={isWide ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', padding: '0 24px', boxSizing: 'border-box', marginBottom: 20 } : { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}
        >
          <div style={{ maxWidth: isWide ? 1600 : '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <Stat title="Total Users" value={totalUsers ?? 0} to="/admin/users" icon={<img src={totalUsersIcon} alt="users" style={{ width: 34, height: 34, objectFit: 'cover' }} />} />
          <Stat title="Total Skills" value={totalSkills ?? 0} to="/admin/skills" icon={<img src={totalSkillsIcon} alt="skills" style={{ width: 34, height: 34, objectFit: 'cover' }} />} />
          <Stat title="Total Matches" value={totalMatches ?? 0} to="/admin/skills" icon={<img src={totalMatchesIcon} alt="matches" style={{ width: 34, height: 34, objectFit: 'cover', borderRadius: 6 }} />} />
          <Stat title="Disputes" value={disputesCount ?? '—'} to="/admin/disputes" icon={<img src={disputesIcon} alt="disputes" style={{ width: 34, height: 34, objectFit: 'cover' }} />} />
          <Stat title="Policy" value={''} to="/admin/policy" icon={<img src={policyIcon} alt="policy" style={{ width: 34, height: 34, objectFit: 'cover' }} />} />
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 10px 30px rgba(2,6,23,0.07)' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#0f1724' }}>Top Skills</h3>
            <ul style={{ marginTop: 10, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
              {topSkills.length === 0 ? <li style={{ color: '#6b7280' }}>No skills yet</li> : topSkills.map((s) => (
                <li key={s.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderRadius: 8, background: '#fbfdff' }}>
                  <div style={{ color: '#0f1724' }}>{s.skill}</div>
                  <div style={{ background: '#eef2ff', color: '#3730a3', padding: '6px 10px', borderRadius: 999 }}>{s.matchesCount ?? 0}</div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 10px 30px rgba(2,6,23,0.07)' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#0f1724' }}>Recent Users</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 10, display: 'grid', gap: 8 }}>
              {recentUsers.length === 0 ? <li style={{ color: '#6b7280' }}>No recent users</li> : recentUsers.map((u) => (
                <li key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0d6efd' }}>{(u.name || '?').charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f1724' }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{u.email}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Link to="/" style={{ padding: '16px 26px', borderRadius: 14, background: '#0d6efd', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 17, boxShadow: '0 10px 30px rgba(13,110,253,0.18)' }}>Go to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
