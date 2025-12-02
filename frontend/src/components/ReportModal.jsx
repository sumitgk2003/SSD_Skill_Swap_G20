import React from 'react';

const ReportModal = ({ open, target, reason, setReason, onClose, onSubmit, submitting }) => {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ width: '480px', maxWidth: '94%', background: 'var(--background-primary)', padding: '1.25rem', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        <h3 style={{ margin: 0 }}>Report {target?.name}</h3>
        <p style={{ marginTop: 6, color: 'var(--text-secondary)' }}>Provide a short reason for reporting this user. Admin will review.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the issue..."
          style={{ width: '100%', minHeight: 120, marginTop: 8, padding: 8, borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--background-secondary)', color: 'var(--text-primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
          <button onClick={onClose} style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Cancel</button>
          <button onClick={onSubmit} disabled={submitting} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--accent-primary)', color: '#fff', border: 'none' }}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
