import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function MeetsListPage() {
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all"); // all | online | inperson
  const [search, setSearch] = useState("");
  const [yourMeets, setYourMeets] = useState([]);
  const [loadingYour, setLoadingYour] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(null); // YYYY-MM-DD
  // Helper to produce local YYYY-MM-DD (avoids UTC shift caused by toISOString)
  const formatYMD = (input) => {
    const d = new Date(input);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
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
            date: formatYMD(m.dateAndTime),
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
      // If a date is selected in the calendar, only show that day's meetings
      if (selectedDate && m.date !== selectedDate) return false;
      if (filter === 'online' && m.type !== 'online') return false;
      if (filter === 'inperson' && m.type !== 'inperson') return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!(m.title.toLowerCase().includes(q) || (m.host && m.host.toLowerCase().includes(q)) || (m.notes && m.notes.toLowerCase().includes(q)))) return false;
      }
      return true;
    });
  }, [yourMeets, filter, search, selectedDate]);

  // Build calendar days for currentMonth (6 weeks view)
  const calendarDays = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDay = first.getDay(); // 0 (Sun) - 6
    const start = new Date(first);
    start.setDate(first.getDate() - startDay);

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
  const key = formatYMD(d);
      const meetings = yourMeets.filter(m => m.date === key).sort((a,b) => a.time > b.time ? 1 : -1);
      days.push({ date: d, key, meetings, inMonth: d.getMonth() === currentMonth.getMonth() });
    }
    return days;
  }, [currentMonth, yourMeets]);

  const todayKey = formatYMD(new Date());

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

      {/* Calendar month view */}
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto 1.25rem auto', background: 'var(--background-secondary)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-primary)' }} aria-label="Previous month">◀</button>
            <strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>{currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</strong>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-primary)' }} aria-label="Next month">▶</button>
          </div>
          <div>
            {selectedDate ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Showing: <strong style={{ color: 'var(--text-primary)' }}>{selectedDate}</strong></div>
                <button onClick={() => setSelectedDate(null)} aria-label="Clear selected date" style={{ border: 'none', background: 'var(--accent-primary)', color: '#fff', padding: '6px 8px', borderRadius: 8, cursor: 'pointer', boxShadow: 'var(--card-shadow)' }}>Clear date</button>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>Click a day to filter meetings</div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {calendarDays.map((day) => {
            const isSelected = selectedDate === day.key;
            const isToday = todayKey === day.key;
            return (
              <button
                key={day.key}
                onClick={() => {
                  if (!day.inMonth) setCurrentMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
                  setSelectedDate(day.key === selectedDate ? null : day.key);
                }}
                style={{
                  minHeight: 96,
                  textAlign: 'left',
                  padding: 10,
                  borderRadius: 10,
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: isSelected ? 'linear-gradient(180deg, rgba(106,90,205,0.06), rgba(106,90,205,0.02))' : (day.inMonth ? 'var(--background-primary)' : 'transparent'),
                  cursor: 'pointer',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 8px 24px rgba(106,90,205,0.12)' : 'none',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                aria-pressed={isSelected}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: day.inMonth ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 800 }}>
                    {day.date.getDate()}
                    {isToday && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--accent-primary)' }}>• today</span>}
                  </div>
                  {day.meetings.length > 0 && (
                    <div style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 999 }}>{day.meetings.length}</div>
                  )}
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-secondary)', maxHeight: 52, overflow: 'hidden' }}>
                  {day.meetings.slice(0,3).map(mt => (
                    <div key={mt.id} style={{ marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{mt.time} — {mt.title}</div>
                    </div>
                  ))}
                  {day.meetings.length > 3 && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>+{day.meetings.length - 3} more</div>}
                </div>
              </button>
            );
          })}
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
