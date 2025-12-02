import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SkeletonRow = () => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: 'inset 0 0 0 1px #f1f5f9', border: '1px solid rgba(15,23,36,0.04)' }} />
);

const AdminDisputesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [allDisputes, setAllDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/v1/disputes', {
          withCredentials: true
        });
        if (res.data && res.data.success) {
          setAllDisputes(res.data.data || []);
        } else {
          setAllDisputes([]);
        }
      } catch (err) {
        console.error('Failed to fetch disputes', err);
        setAllDisputes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const filteredDisputes = (allDisputes || []).filter((dispute) => {
    const reporterStr =
      (dispute.reporter?.name || dispute.reporter?.email) ??
      (typeof dispute.reporter === 'string' ? dispute.reporter : '') ??
      '';

    const reportedStr =
      (dispute.reported?.name || dispute.reported?.email) ??
      (typeof dispute.reported === 'string' ? dispute.reported : '') ??
      '';

    const skillStr = dispute.skill?.toString() || '';
    const reasonStr = dispute.reason?.toString() || '';

    const q = searchTerm.trim().toLowerCase();

    const matchesSearchTerm =
      !q ||
      reporterStr.toLowerCase().includes(q) ||
      reportedStr.toLowerCase().includes(q) ||
      skillStr.toLowerCase().includes(q) ||
      reasonStr.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'All' || dispute.status === filterStatus;

    return matchesSearchTerm && matchesStatus;
  });

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/disputes/${id}/status`,
        { status },
        { withCredentials: true }
      );
      if (res.data && res.data.success) {
        setAllDisputes((prev) =>
          prev.map((d) => (d._id === id ? res.data.data : d))
        );
      }
    } catch (err) {
      console.error('Failed to update dispute status', err);
      alert(err.response?.data?.message || 'Failed to update dispute');
    }
  };

  const endMatch = async (matchId, disputeId) => {
    try {
      if (!matchId) return alert('No match id available for this dispute');
      if (!window.confirm('Are you sure you want to end this match? This will remove the connection between the users.')) return;

      await axios.delete(`http://localhost:8000/api/v1/admin/matches/${matchId}`, { withCredentials: true });

      // Optionally mark dispute as resolved after ending the match
      if (disputeId) {
        await axios.patch(`http://localhost:8000/api/v1/disputes/${disputeId}/status`, { status: 'Resolved' }, { withCredentials: true });
        // update local state
        setAllDisputes((prev) => prev.map((d) => (d._id === disputeId ? { ...d, status: 'Resolved' } : d)));
      }

      alert('Match ended successfully');
    } catch (err) {
      console.error('Failed to end match', err);
      alert(err.response?.data?.message || 'Failed to end match');
    }
  };

  return (
    <div style={{ padding: 36, minHeight: '100vh', background: '#f4f7fb', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 18px' }}>
        <header style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#0f1724' }}>Disputes</h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Manage user reported disputes and moderation actions</p>
        </header>

        <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', minWidth: 0, maxWidth: 520 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              placeholder="Search disputes by reporter, reported user, skill or reason"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '12px 14px 12px 44px', width: '100%', boxSizing: 'border-box', borderRadius: 14, border: '1px solid #e6eef8', boxShadow: 'inset 0 1px 2px rgba(16,24,40,0.04)' }}
            />
            {searchTerm ? (
              <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 6, top: 6, padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e6eef8' }}>Clear</button>
            ) : null}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8', background: '#fff', flex: '0 0 180px', minWidth: 140 }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 14 }}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : filteredDisputes.length === 0 ? (
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}>
            <p style={{ margin: 0, color: '#6b7280' }}>No disputes found. Try changing the search filter.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gap: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 14px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 13 }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Reporter</th>
                    <th style={{ padding: '12px 16px' }}>Reported</th>
                    <th style={{ padding: '12px 16px' }}>Match ID</th>
                    <th style={{ padding: '12px 16px' }}>Skill</th>
                    <th style={{ padding: '12px 16px' }}>Reason</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Created</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map((dispute) => (
                    <tr key={dispute._id} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 10px 30px rgba(2,6,23,0.04)', border: '1px solid rgba(15,23,36,0.04)' }}>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute._id}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.reporter?.name || dispute.reporter?.email || '—'}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.reported?.name || dispute.reported?.email || '—'}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.skill || '—'}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.reason}</td>
                        <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.matchId ? String(dispute.matchId) : '—'}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{dispute.status}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>{new Date(dispute.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                        {dispute.status === 'Pending Review' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => updateStatus(dispute._id, 'Resolved')} style={{ padding: '8px 10px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none' }}>Resolve</button>
                            <button onClick={() => updateStatus(dispute._id, 'Rejected')} style={{ padding: '8px 10px', borderRadius: 8, background: '#ef4444', color: '#fff', border: 'none' }}>Reject</button>
                              {dispute.matchId && (
                                <button onClick={() => endMatch(dispute.matchId, dispute._id)} style={{ padding: '8px 10px', borderRadius: 8, background: '#6b7280', color: '#fff', border: 'none' }}>End Match</button>
                              )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDisputesPage;
