import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PolicyPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/v1/admin/policy');
        if (res.data && res.data.success) setContent(res.data.data?.content || '');
      } catch (err) {
        console.error('Failed to fetch policy', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

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
            <div dangerouslySetInnerHTML={{ __html: content || '<p style="color:#6b7280">No policy set.</p>' }} />
          )}
        </article>
      </div>
    </div>
  );
};

export default PolicyPage;
