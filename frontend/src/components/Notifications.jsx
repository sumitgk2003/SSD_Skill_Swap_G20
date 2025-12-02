import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useSelector } from 'react-redux';
import notificationIcon from '../assets/notification.png';

const styles = {
  container: { position: 'relative', marginRight: 12 },
  button: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '6px',
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    background: 'var(--accent-primary)',
    color: 'white',
    borderRadius: '999px',
    minWidth: 18,
    height: 18,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    padding: '0 5px'
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: 320,
    maxHeight: 380,
    overflow: 'auto',
    background: 'var(--background-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    zIndex: 50,
    padding: 8,
  },
  sectionTitle: { fontSize: 12, color: 'var(--text-secondary)', margin: '8px 6px' },
  item: { padding: '8px 10px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' },
  itemTitle: { fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 },
  itemMeta: { fontSize: 12, color: 'var(--text-secondary)' }
};

const Notifications = () => {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const pollingRef = useRef(null);

  const lastSeenKey = 'notifications.lastSeen';

  const fetchNotifications = async () => {
    if (!user) return setNotifications([]);
    setLoading(true);
    try {
      const res = await client.get('/notifications');
      const list = res.data?.data || [];
      // map to UI shape
      const mapped = list.map(n => ({
        id: n._id,
        type: n.type,
        title: n.title,
        body: n.body,
        time: n.createdAt,
        link: n.data?.link || (n.data?.meetId ? `/schedule` : '/'),
        read: n.read || false,
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // poll every 30s
    pollingRef.current = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const lastSeen = () => {
    const v = localStorage.getItem(lastSeenKey);
    return v ? new Date(v) : new Date(0);
  };

  const unreadCount = notifications.filter(n => new Date(n.time) > lastSeen()).length;

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      // mark as seen (server-side)
      localStorage.setItem(lastSeenKey, new Date().toISOString());
      client.post('/notifications/mark-all-read').catch(() => {});
    }
  };

  const handleGoto = (link) => {
    setOpen(false);
    if (link) navigate(link);
  };

  return (
    <div style={styles.container}>
      <button aria-label="Notifications" onClick={handleToggle} style={styles.button}>
        <img src={notificationIcon} alt="Notifications" style={{ width: 20, height: 20, display: 'block' }} />
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>

      {open && (
        <div style={styles.dropdown} role="dialog" aria-label="Notifications">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px' }}>
            <strong style={{ fontSize: 14 }}>Notifications</strong>
            <button onClick={() => { localStorage.setItem(lastSeenKey, new Date().toISOString()); setOpen(false); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>Mark all read</button>
          </div>

          {!loading && notifications.length === 0 && (
            <div style={{ padding: 12, color: 'var(--text-secondary)' }}>You're all caught up.</div>
          )}

          {notifications.map(n => (
            <div key={n.id} style={{ ...styles.item, margin: '6px 4px' }} onClick={() => handleGoto(n.link)}>
              <div style={{ flex: 1 }}>
                <div style={styles.itemTitle}>{n.title}</div>
                <div style={styles.itemMeta}>{n.body}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{new Date(n.time).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
