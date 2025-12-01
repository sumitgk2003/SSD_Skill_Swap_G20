import React, { useEffect, useState } from 'react';
import client from '../api/client';

const SkeletonSkill = () => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: 'inset 0 0 0 1px #f1f5f9', border: '1px solid rgba(15,23,36,0.04)' }}>
    <div style={{ height: 14, width: '50%', background: '#e6eef8', borderRadius: 8, marginBottom: 10 }} />
    <div style={{ height: 12, width: '40%', background: '#e6eef8', borderRadius: 8 }} />
  </div>
);

const SkillCard = ({ skill }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 12px 36px rgba(2,6,23,0.08)', border: '1px solid rgba(15,23,36,0.04)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700, color: '#0f1724' }}>{skill.name}</div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>{skill.category}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#eef2ff', color: '#3730a3', padding: '8px 12px', borderRadius: 999, fontWeight: 700 }}>{skill.matches ?? 0}</span>
      </div>
    </div>
    {skill.description && <div style={{ marginTop: 10, color: '#475569' }}>{skill.description}</div>}
  </div>
);

const AdminSkillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.get('/admin/skills');
        const data = res?.data?.data || [];
        const normalized = Array.isArray(data)
          ? data.map((s, idx) => ({
              id: s._id || s.skill || `SK${String(idx + 1).padStart(3, '0')}`,
              name: s.skill,
              category: s.category || 'General',
              matches: s.matchesCount || 0,
              description: s.description || '',
            }))
          : [];
        setSkills(normalized);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return true;
    const name = (skill.name || '').toLowerCase();
    const category = (skill.category || '').toLowerCase();
    const description = (skill.description || '').toLowerCase();

    return name.includes(q) || category.includes(q) || description.includes(q);
  });

  return (
    <div style={{ padding: 36, minHeight: '100vh', background: '#f4f7fb', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
  <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 18px' }}>
        <header style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0f1724' }}>Skills</h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>All platform skills and total matches</p>
        </header>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              placeholder="Search skills by name, category or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px 14px 12px 44px', width: '100%', borderRadius: 14, border: '1px solid #e6eef8', boxShadow: 'inset 0 1px 2px rgba(16,24,40,0.04)' }}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 6, top: 6, padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e6eef8' }}>Clear</button>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <SkeletonSkill />
            <SkeletonSkill />
            <SkeletonSkill />
          </div>
        ) : error ? (
          <div style={{ color: 'red' }}>Error: {error}</div>
        ) : filteredSkills.length === 0 ? (
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}>
            <p style={{ margin: 0, color: '#6b7280' }}>No skills found. Try changing the search filter.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gap: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 14px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 13 }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Total Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkills.map((skill) => (
                    <tr key={skill.id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 10px 30px rgba(2,6,23,0.04)', border: '1px solid rgba(15,23,36,0.04)' }}>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 700, color: '#0f1724' }}>{skill.name}</div>
                        {skill.description && <div style={{ marginTop: 6, color: '#6b7280', fontSize: 13 }}>{skill.description}</div>}
                      </td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{skill.category}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        <span style={{ background: '#eef2ff', color: '#3730a3', padding: '8px 12px', borderRadius: 999, fontWeight: 700 }}>{skill.matches ?? 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards (hidden by default; can toggle with CSS/media queries) */}
            <div style={{ display: 'none', marginTop: 12 }}>
              {filteredSkills.map((s) => (
                <div key={s.id} style={{ marginBottom: 12 }}>
                  <SkillCard skill={s} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSkillsPage;