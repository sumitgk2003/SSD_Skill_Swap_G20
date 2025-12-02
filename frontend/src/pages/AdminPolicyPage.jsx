import React, { useEffect, useState } from 'react';
import axios from 'axios';

const isAdmin = () => {
  try { return !!localStorage.getItem('admin'); } catch { return false; }
};

const AdminPolicyPage = () => {
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/v1/admin/policy');
        if (res.data && res.data.success) {
          setContent(res.data.data?.content || '');
        }
      } catch (err) {
        console.error('Failed to fetch policy', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const save = async () => {
    if (!isAdmin()) return alert('Admin credentials required to save');
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:8000/api/v1/admin/policy', { content }, { withCredentials: true });
      if (res.data && res.data.success) {
        setContent(res.data.data.content || '');
        setEditing(false);
        alert('Policy updated');
      }
    } catch (err) {
      console.error('Failed to update policy', err);
      alert(err.response?.data?.message || 'Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 36, minHeight: '100vh', background: '#f4f7fb', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 18px' }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 26, color: '#0f1724' }}>Policy</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Site Terms of Service and Privacy Policy</p>
        </header>

        <article style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(2,6,23,0.06)', color: '#111827' }}>
          {loading ? (
            <div style={{ color: '#6b7280' }}>Loading...</div>
          ) : (
            <div>
              {!editing ? (
                <div>
                  <div style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: content || '<p style="color:#6b7280">No policy set.</p>' }} />
                  {isAdmin() && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setEditing(true)} style={{ padding: '8px 12px', borderRadius: 8, background: '#0f1724', color: '#fff', border: 'none' }}>Edit</button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={18} style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 8, border: '1px solid #e6eef8', fontFamily: 'inherit' }} />
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button onClick={save} disabled={saving} style={{ padding: '8px 12px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none' }}>{saving ? 'Saving...' : 'Save'}</button>
                    <button onClick={() => setEditing(false)} disabled={saving} style={{ padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default AdminPolicyPage;