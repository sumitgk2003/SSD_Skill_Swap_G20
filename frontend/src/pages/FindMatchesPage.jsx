import React, { useState, useRef, useEffect } from 'react';

// Mock data now includes messages and profile pictures
const mockMatchesData = [
  { 
    id: 1, 
    name: 'Alice', 
    teaches: 'Creative Writing', 
    learns: 'React', 
    pic: 'https://placehold.co/100x100/6a5acd/FFF?text=A',
    messages: [
      { id: 1, sender: 'Alice', text: 'Hey! I see you want to learn React. I can help!' },
      { id: 2, sender: 'You', text: 'That would be great! I can teach you creative writing in exchange.' },
    ]
  },
  { 
    id: 2, 
    name: 'Bob', 
    teaches: 'Public Speaking', 
    learns: 'Node.js',
    pic: 'https://placehold.co/100x100/5a4bad/FFF?text=B',
    messages: [
      { id: 1, sender: 'Bob', text: 'Hi, interested in learning Node.js?' },
    ]
  },
  { 
    id: 3, 
    name: 'Charlie', 
    teaches: 'Graphic Design', 
    learns: 'Pottery',
    pic: 'https://placehold.co/100x100/4a3ba9/FFF?text=C',
    messages: []
  },
  { 
    id: 4, 
    name: 'Diana', 
    teaches: 'Yoga Instruction', 
    learns: 'Python',
    pic: 'https://placehold.co/100x100/3a2ba5/FFF?text=D',
    messages: [
      { id: 1, sender: 'Diana', text: 'Namaste. Let me know if youd like to start with Python.' },
    ]
  },
  { 
    id: 5, 
    name: 'Eve', 
    teaches: 'Bread Making', 
    learns: 'React',
    pic: 'https://placehold.co/100x100/2a1ba1/FFF?text=E',
    messages: []
  },
];

// --- ChatWindow Component ---
const ChatWindow = ({ user, onSendMessage, onOpenScheduler, confirmation }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(user.id, newMessage);
      setNewMessage('');
    }
  };

  if (!user) {
    return (
      <div style={styles.chatPlaceholder}>
        <span style={{ fontSize: 64, color: '#ccc' }}>✉️</span>
        <h2 style={{ color: '#777', fontWeight: 500 }}>Select a match to start messaging</h2>
      </div>
    );
  }

  return (
    <div style={styles.chatWindow}>
      {/* Chat Header */}
      <header style={styles.chatHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={user.pic} alt={user.name} style={styles.chatHeaderPic} />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#333', margin: 0 }}>{user.name}</h2>
            <div style={{ fontSize: 13, color: '#666' }}>{user.teaches} • wants {user.learns}</div>
          </div>
        </div>

        {/* Right side control: schedule button */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onOpenScheduler}
            title="Schedule Meet"
            style={styles.scheduleTextButton}
          >
            Schedule Meet
          </button>
        </div>
      </header>

      {/* optional small confirmation (toast-like, below header) */}
      {confirmation && (
        <div style={styles.inlineConfirm}>
          {confirmation}
        </div>
      )}

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {user.messages.length === 0 && (
          <div style={styles.noMessages}>
            This is the beginning of your conversation with {user.name}.
          </div>
        )}
        {user.messages.map(msg => (
          <div key={msg.id} style={msg.sender === 'You' ? styles.messageSent : styles.messageReceived}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form style={styles.messageInputForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.messageInput}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" style={styles.sendButton}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>➡️</span>
        </button>
      </form>
    </div>
  );
};

// --- FindMatchesPage Component ---
const FindMatchesPage = () => {
  const [matches, setMatches] = useState(mockMatchesData);
  const [selectedUser, setSelectedUser] = useState(null);

  // scheduler modal state
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [meetType, setMeetType] = useState('online');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState('');

  const firstFieldRef = useRef(null);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // inject Inter font once
  useEffect(() => {
    const id = 'inter-font-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (schedulerOpen && firstFieldRef.current) firstFieldRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') setSchedulerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [schedulerOpen]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (userId, text) => {
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: text,
    };

    const updatedMatches = matches.map(user => {
      if (user.id === userId) {
        return { ...user, messages: [...user.messages, newMessage] };
      }
      return user;
    });

    setMatches(updatedMatches);

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
    }
  };

  // scheduler helpers
  const openScheduler = () => {
    setErrors({});
    // prefill with next available defaults
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    setDate(now.toISOString().slice(0,10));
    setTime(now.toTimeString().slice(0,5));
    setMeetType('online');
    setNote(selectedUser ? `Meeting with ${selectedUser.name}` : '');
    setSchedulerOpen(true);
  };
  const closeScheduler = () => setSchedulerOpen(false);

  const validate = () => {
    const e = {};
    if (!date) e.date = 'Please pick a date.';
    if (!time) e.time = 'Please pick a time.';
    if (!duration || duration <= 0) e.duration = 'Duration must be a positive number.';
    const dt = new Date(`${date}T${time}:00`);
    if (isNaN(dt.getTime())) e.date = 'Invalid date/time.';
    if (dt.getTime() < Date.now() - 1000) e.time = 'Meeting time must be in the future.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // reliably open native pickers
  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    setTimeout(() => {
      try { if (typeof el.showPicker === 'function') el.showPicker(); else el.click(); }
      catch { try { el.click(); } catch { el.focus(); } }
    }, 0);
  };
  const openTimePicker = () => {
    const el = timeInputRef.current;
    if (!el) return;
    setTimeout(() => {
      try { if (typeof el.showPicker === 'function') el.showPicker(); else el.click(); }
      catch { try { el.click(); } catch { el.focus(); } }
    }, 0);
  };

  // create meeting action (stub - you can call backend here)
  const createMeeting = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      type: meetType,
      date,
      time,
      duration,
      note,
      with: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : null,
    };
    console.log('Create meeting payload:', payload);
    setConfirmation(`Meeting scheduled ${meetType} ${date} ${time} for ${duration} minutes${selectedUser ? ' with ' + selectedUser.name : ''}.`);
    setTimeout(() => setConfirmation(''), 5000);
    setSchedulerOpen(false);
  };

  const selectedChatUser = matches.find(u => u.id === selectedUser?.id) || null;

  return (
    <div style={styles.page}>
      {/* Left Column: Match List */}
      <div style={styles.matchListContainer}>
        <h1 style={styles.header}>Your Skill Matches</h1>
        <div style={styles.matchList}>
          {matches.map(match => (
            <div 
              key={match.id} 
              style={selectedUser?.id === match.id ? styles.matchCardSelected : styles.matchCard}
              onClick={() => handleSelectUser(match)}
            >
              <img src={match.pic} alt={match.name} style={styles.matchPic} />
              <div style={styles.matchInfo}>
                <h2 style={styles.name}>{match.name}</h2>
                <p style={styles.skillLine}>
                  <strong>Teaches:</strong> <span style={{ color: '#6a5acd' }}>{match.teaches}</span>
                </p>
                <p style={styles.skillLine}>
                  <strong>Learns:</strong> {match.learns}
                </p>
              </div>
              <button 
                style={styles.messageButton} 
                onClick={(ev) => { ev.stopPropagation(); handleSelectUser(match); }}
                aria-label={`Message ${match.name}`}
              >
                <span>✉️</span>
                <span style={{ marginLeft: 6 }}>Message</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div style={styles.chatContainer}>
        <ChatWindow 
          user={selectedChatUser} 
          onSendMessage={handleSendMessage}
          onOpenScheduler={openScheduler}
          confirmation={confirmation}
        />
      </div>

      {/* Scheduler Modal */}
      {schedulerOpen && (
        <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && closeScheduler()}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={createMeeting}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Schedule meeting</h3>
                <button type="button" onClick={closeScheduler} style={styles.closeBtnModal} aria-label="Close form">✕</button>
              </div>

              <div style={{ marginTop: 8 }}>
                <div style={styles.label}>Meeting type</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={styles.radioLabel}>
                    <input ref={firstFieldRef} type="radio" name="type" value="online" checked={meetType === 'online'} onChange={() => setMeetType('online')} />
                    <span style={{ marginLeft: 6 }}>Online</span>
                  </label>
                  <label style={styles.radioLabel}>
                    <input type="radio" name="type" value="inperson" checked={meetType === 'inperson'} onChange={() => setMeetType('inperson')} />
                    <span style={{ marginLeft: 6 }}>In person</span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 180px', minWidth: 140 }}>
                  <div style={styles.label}>Date</div>
                  <div style={{ ...styles.clickableField, position: 'relative' }} onClick={openDatePicker}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: '#222' }}>{date}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Tap to change</div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.7 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#dcd7ff" strokeWidth="1.2" fill="none"></rect>
                    </svg>
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>
                  {errors.date && <div style={styles.errorStyle}>{errors.date}</div>}
                </div>

                <div style={{ flex: '1 1 140px', minWidth: 120 }}>
                  <div style={styles.label}>Time</div>
                  <div style={{ ...styles.clickableField, position: 'relative' }} onClick={openTimePicker}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: '#222' }}>{time}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>Tap to change</div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.7 }}>
                      <circle cx="12" cy="12" r="9" stroke="#dcd7ff" strokeWidth="1.2" fill="none"></circle>
                      <path d="M12 7v6l4 2" stroke="#6a5acd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <input
                      ref={timeInputRef}
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </div>
                  {errors.time && <div style={styles.errorStyle}>{errors.time}</div>}
                </div>

                <div style={{ flex: '1 1 140px', minWidth: 120 }}>
                  <div style={styles.label}>Duration</div>

                  <div style={{ ...styles.clickableField, position: 'relative' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                        style={styles.durationInput}
                        min="1"
                      />
                      <div style={{ fontSize: 13, color: '#888' }}>Tap to change</div>
                    </div>

                    <div style={{ fontSize: 15, color: '#222', marginRight: 6 }}>min</div>
                  </div>

                  {errors.duration && <div style={styles.errorStyle}>{errors.duration}</div>}
                </div>

              </div>

              <div style={{ marginTop: 12 }}>
                <div style={styles.label}>Title / Note (optional)</div>
                <input style={styles.inputBase} type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Coffee & code review" />
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeScheduler} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.createBtn}>Create meeting</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const styles = {
  page: {
    display: 'flex',
    height: 'calc(100vh - 60px)', // adjust if your header is different
    fontFamily: '"Inter", system-ui, Arial, -apple-system, "Segoe UI", Roboto',
    backgroundColor: '#f7f7f7',
  },
  matchListContainer: {
    width: 400,
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#333',
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
  },
  matchList: {
    overflowY: 'auto',
    flexGrow: 1,
  },
  matchCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  matchCardSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    backgroundColor: '#f0eefc',
    borderRight: '4px solid #6a5acd',
  },
  matchPic: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  matchInfo: {
    flexGrow: 1,
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 0.25rem 0',
  },
  skillLine: {
    fontSize: '0.9rem',
    color: '#555',
    margin: 0,
    lineHeight: 1.4,
  },
  messageButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.8rem',
    border: 'none',
    borderRadius: 8,
    backgroundColor: '#6a5acd',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  chatContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f7f7f7',
  },
  chatPlaceholder: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.9rem 1rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
  },
  chatHeaderPic: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  // replaced circular calendar with text button in top-right:
  scheduleTextButton: {
    padding: '0.45rem 0.9rem',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#eae6ff',
    color: '#2e1e9f',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(106,90,205,0.08)',
    fontSize: 14,
  },
  inlineConfirm: {
    padding: '0.5rem 1rem',
    background: '#eaf9ef',
    color: '#107a3a',
    fontWeight: 700,
    margin: '0.5rem 1rem',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  // make messages area larger and add bottom padding
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    paddingBottom: '5.5rem', // increased bottom padding so last messages are visible above input
    backgroundColor: '#f7f7f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#6a5acd',
    color: 'white',
    padding: '0.9rem 1.1rem', // slightly larger
    borderRadius: '20px 20px 4px 20px',
    maxWidth: '72%',
    lineHeight: 1.45,
    fontSize: 15,
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    color: '#333',
    padding: '0.9rem 1.1rem', // slightly larger
    borderRadius: '20px 20px 20px 4px',
    maxWidth: '72%',
    lineHeight: 1.45,
    border: '1px solid #eee',
    fontSize: 15,
  },
  noMessages: {
    textAlign: 'center',
    color: '#888',
    marginTop: '2rem',
    fontSize: '0.95rem',
  },
  messageInputForm: {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid #eee',
    backgroundColor: '#fff',
  },
  messageInput: {
    flexGrow: 1,
    border: '1px solid #ddd',
    borderRadius: 20,
    padding: '0.9rem 1.2rem',
    fontSize: '1.05rem', // slightly larger input
    outline: 'none',
  },
  sendButton: {
    marginLeft: '1rem',
    border: 'none',
    backgroundColor: '#6a5acd',
    color: 'white',
    width: 48,
    height: 48,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },

  /* modal styles */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(16,16,20,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: '1rem',
    boxSizing: 'border-box',
  },
  modalCard: {
    width: '100%',
    maxWidth: 640,
    background: '#fff',
    borderRadius: 12,
    padding: '1.4rem 1.4rem',
    boxShadow: '0 14px 50px rgba(2,6,23,0.18)',
    boxSizing: 'border-box',
  },
  closeBtnModal: {
    background: '#f6f6fb',
    border: '1px solid rgba(34,34,34,0.06)',
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#444',
    fontSize: 16,
    lineHeight: 1,
  },
  label: { fontSize: 15, color: '#333', fontWeight: 700, marginBottom: 8 },
  inputBase: {
    padding: '0.75rem 0.85rem',
    borderRadius: 10,
    border: '1px solid #e6e0ff',
    fontSize: 15,
    width: '100%',
    boxSizing: 'border-box',
    background: 'white',
  },
  clickableField: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0.6rem 0.75rem',
    borderRadius: 10,
    border: '1px solid #e9e6fb',
    background: '#fbfbff',
    cursor: 'pointer',
  },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 },
  errorStyle: { color: '#d23', marginTop: 6, fontSize: 13 },
  cancelBtn: { padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e6e6ea', background: '#fff', cursor: 'pointer', fontSize: 15 },
  createBtn: { padding: '0.7rem 1.05rem', borderRadius: 8, border: 'none', background: '#6a5acd', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 },
 durationInput: {
  fontSize: 15,
  color: '#222',
  fontWeight: 600,
  border: 'none',
  background: 'transparent',
  padding: 0,
  margin: 0,
  width: '100%',
  outline: 'none',
  appearance: 'textfield',
},

};

export default FindMatchesPage;
