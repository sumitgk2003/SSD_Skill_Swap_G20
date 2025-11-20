import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MeetsListPage() {
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all"); // all | online | inperson
  const [search, setSearch] = useState("");
  const [yourMeets, setYourMeets] = useState([]);
  const [loadingYour, setLoadingYour] = useState(false);
  // fetch user's meets on load and when user changes
  useEffect(() => {
    const fetchYourMeets = async () => {
      if (!user) return;
      setLoadingYour(true);
      try {
        const res = await axios.get('http://localhost:8000/api/v1/meets', { withCredentials: true });
        if (res.data && res.data.success) {
          const mapped = res.data.data.map((m) => ({
            id: m._id,
            title: m.title,
            host: String(m.organizer) === String(user._id) ? user.name : (m.organizerName || 'Host'),
            type: m.meetType === 'online' ? 'online' : 'inperson',
            date: new Date(m.dateAndTime).toISOString().slice(0,10),
            time: new Date(m.dateAndTime).toTimeString().slice(0,5),
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            joinUrl: m.zoomJoinUrl || m.googleEventHtmlLink || null,
            notes: m.title,
          }));
          setYourMeets(mapped.sort((a,b) => (a.date + 'T' + a.time) > (b.date + 'T' + b.time) ? 1 : -1));
        }
      } catch (err) {
        console.error('Error fetching your meets:', err);
      } finally {
        setLoadingYour(false);
      }
    };

    fetchYourMeets();
  }, [user]);

  const visible = useMemo(() => {
    return yourMeets.filter((m) => {
      if (filter === 'online' && m.type !== 'online') return false;
      if (filter === 'inperson' && m.type !== 'inperson') return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!(m.title.toLowerCase().includes(q) || (m.host && m.host.toLowerCase().includes(q)) || (m.notes && m.notes.toLowerCase().includes(q)))) return false;
      }
      return true;
    });
  }, [yourMeets, filter, search]);

  const handleJoin = (m) => {
    if (!m || !m.joinUrl) return;
    try {
      // Open Zoom join URL (or calendar link) in a new tab to allow the Zoom client to handle it
      window.open(m.joinUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      // Fallback: set location
      window.location.href = m.joinUrl;
    }
  };

  // styles (condensed)
  const pageStyle = { width: '100%', padding: '2.5rem 3rem', fontFamily: "'Inter', system-ui, Arial, -apple-system, 'Segoe UI', Roboto", background: '#faf7fe', minHeight: '100vh' };
  const heroStyle = { width: '100%', maxWidth: 1200, margin: '0 auto 1.25rem auto', padding: '1.2rem 1rem', background: 'white', borderRadius: 12 };
  const titleStyle = { fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#222' };
  const subtitleStyle = { marginTop: 8, color: '#666', fontSize: '1.05rem' };
  const controlsBar = { marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
  const filterBtn = (active) => ({ padding: '0.55rem 0.9rem', borderRadius: 10, border: active ? 'none' : '1px solid rgba(34,34,34,0.08)', background: active ? '#6a5acd' : 'transparent', color: active ? '#fff' : '#333', fontWeight: 700, cursor: 'pointer' });
  const searchStyle = { marginLeft: 'auto', padding: '0.6rem 0.9rem', borderRadius: 10, border: '1px solid #e6e0ff', minWidth: 260 };
  const listWrap = { maxWidth: 1200, margin: '1rem auto 2.5rem auto' };
  const listGrid = { display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' };
  const card = { background: '#fff', borderRadius: 12, padding: '1.25rem', border: '1px solid #f0eefb', display: 'flex', flexDirection: 'column', gap: 10 };
  const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 };
  const titleCard = { fontSize: 18, fontWeight: 800, margin: 0, color: '#222' };
  const hostStyle = { fontSize: 15, color: '#666', marginTop: 6 };
  const metaRow = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
  const pill = { padding: '0.4rem 0.7rem', borderRadius: 9, fontSize: 14, fontWeight: 700 };
  const onlinePill = { ...pill, background: '#f0eaff', color: '#6a5acd' };
  const inpersonPill = { ...pill, background: '#eefbf0', color: '#138a3b' };
  const whenStyle = { fontSize: 15, color: '#333', fontWeight: 700 };
  const notesStyle = { color: '#444', fontSize: 15, marginTop: 6 };
  const joinBtn = { marginTop: '0.6rem', padding: '0.75rem 1rem', borderRadius: 10, border: 'none', background: '#6a5acd', color: '#fff', fontWeight: 800, cursor: 'pointer' };
  const disabledBtn = { ...joinBtn, background: 'transparent', border: '1px solid rgba(34,34,34,0.08)', color: '#666', cursor: 'default' };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={titleStyle}>Your Meets</h1>
        </div>

        <p style={subtitleStyle}>Meets you organized or are attending.</p>

        <div style={controlsBar}>
          <button style={filterBtn(filter === 'all')} onClick={() => setFilter('all')}>All</button>
          <button style={filterBtn(filter === 'online')} onClick={() => setFilter('online')}>Online</button>
          <button style={filterBtn(filter === 'inperson')} onClick={() => setFilter('inperson')}>In person</button>

          <input placeholder='Search title, host, notes...' value={search} onChange={(e) => setSearch(e.target.value)} style={searchStyle} aria-label='Search meets' />
        </div>
      </div>

      <div style={listWrap}>
        <div style={listGrid}>
          {loadingYour ? (
            <div style={{ padding: '2rem', background: 'white', borderRadius: 12, textAlign: 'center', color: '#666' }}>Loading your meets...</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: '2rem', background: 'white', borderRadius: 12, textAlign: 'center', color: '#666' }}>You have no scheduled meets.</div>
          ) : (
            visible.map((m) => {
              const when = new Date(`${m.date}T${m.time}:00`).toLocaleString();
              return (
                <article key={m.id} style={card} aria-labelledby={`meet-${m.id}`}>
                  <div style={cardHeader}>
                    <div style={{ minWidth: 0 }}>
                      <h3 id={`meet-${m.id}`} style={titleCard}>{m.title}</h3>
                      <div style={hostStyle}>Host: <strong style={{ color: '#222' }}>{m.host}</strong></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <div style={metaRow}><div style={m.type === 'online' ? onlinePill : inpersonPill}>{m.type === 'online' ? 'Online' : 'In person'}</div></div>
                      <div style={{ fontSize: 14, color: '#666' }}>{m.tz}</div>
                    </div>
                  </div>

                  <div style={whenStyle}>{when}</div>
                  {m.location && <div style={notesStyle}>Location: {m.location}</div>}
                  {m.notes && <div style={notesStyle}>{m.notes}</div>}

                  {m.joinUrl && m.type === 'online' ? (
                    <button style={joinBtn} onClick={() => handleJoin(m)} aria-label={`Join ${m.title}`}>Join Meeting</button>
                  ) : m.joinUrl ? (
                    <a href={m.joinUrl} target='_blank' rel='noreferrer' style={{ textDecoration: 'none' }}><button style={joinBtn}>Open</button></a>
                  ) : (
                    <button style={disabledBtn} disabled>In-person — No link</button>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
