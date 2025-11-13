import React, { useState, useRef, useEffect } from "react";

const mockMatches = [
  { id: 1, name: "Alice", teaches: "Creative Writing", learns: "React" },
  { id: 2, name: "Bob", teaches: "Public Speaking", learns: "Node.js" },
  { id: 3, name: "Charlie", teaches: "Graphic Design", learns: "Pottery" },
  { id: 4, name: "Diana", teaches: "Yoga Instruction", learns: "Python" },
  { id: 5, name: "Eve", teaches: "Bread Making", learns: "React" },
  { id: 6, name: "Frank", teaches: "Chess Strategy", learns: "Pottery" },
];

export default function FindMatchesPage() {
  // modal + form state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [meetType, setMeetType] = useState("online");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState("");

  const firstFieldRef = useRef(null);
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // inject Inter font once
  useEffect(() => {
    const id = "inter-font-link";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (modalOpen && firstFieldRef.current) firstFieldRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  const openModalFor = (person) => {
    setSelectedPerson(person);
    setNote(`Meeting with ${person.name}`);
    setMeetType("online");
    setErrors({});
    setDate(new Date().toISOString().slice(0, 10));
    setTime("09:00");
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!date) e.date = "Please pick a date.";
    if (!time) e.time = "Please pick a time.";
    const dt = new Date(date + "T" + time + ":00");
    if (isNaN(dt.getTime())) e.date = "Invalid date/time.";
    if (dt.getTime() < Date.now() - 1000) e.time = "Meeting time must be in the future.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // create meeting (no list — just confirm + optionally you can hook backend here)
  const createMeeting = (dateStr, timeStr, typeStr, noteStr, person) => {
    const dt = new Date(dateStr + "T" + timeStr + ":00");
    const human = dt.toLocaleString();
    setConfirmation(`${person ? `Meeting with ${person.name}` : "Meeting"} scheduled (${typeStr}) for ${human}.`);
    setTimeout(() => setConfirmation(""), 6000);
    setModalOpen(false);

    // TODO: send to backend here if needed
    // fetch("/api/meetings/save", { method: "POST", body: JSON.stringify({ date: dateStr, time: timeStr, type: typeStr, note: noteStr, person }) })
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    createMeeting(date, time, meetType, note, selectedPerson);
    setNote("");
  };

  // reliable picker open (showPicker -> click -> focus)
  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    setTimeout(() => {
      try {
        if (typeof el.showPicker === "function") el.showPicker();
        else el.click();
      } catch {
        try { el.click(); } catch { el.focus(); }
      }
    }, 0);
  };
  const openTimePicker = () => {
    const el = timeInputRef.current;
    if (!el) return;
    setTimeout(() => {
      try {
        if (typeof el.showPicker === "function") el.showPicker();
        else el.click();
      } catch {
        try { el.click(); } catch { el.focus(); }
      }
    }, 0);
  };

  // ---- styles (kept from earlier) ----
  const pageStyle = {
    padding: "2rem 3rem",
    fontFamily: "'Inter', system-ui, Arial, -apple-system, 'Segoe UI', Roboto",
    background: "#faf7fe",
    minHeight: "100vh",
    boxSizing: "border-box",
  };
  const headerStyle = {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#222",
    marginBottom: "1.25rem",
    borderBottom: "2px solid #eee",
    paddingBottom: "0.75rem",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  };
  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.25rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  };
  const nameStyle = { fontSize: "1.28rem", fontWeight: 700, margin: "0 0 0.8rem 0" };
  const skillLineStyle = { marginBottom: "0.75rem", lineHeight: "1.4", color: "#444", fontSize: 15 };

  // increase button text size but keep layout stable
  const actionsRow = { display: "flex", gap: "0.6rem", marginTop: "auto" };
  const messageBtn = {
    flex: 1,
    padding: "0.7rem",
    borderRadius: 8,
    border: "1px solid #e6e6ea",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1.05rem",
  };
  const scheduleBtn = {
    flex: 1,
    padding: "0.7rem",
    borderRadius: 8,
    border: "none",
    background: "#6a5acd",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1.05rem",
  };

  const confirmStyle = { marginTop: "1rem", color: "#1f9d5a", fontWeight: 700, minHeight: 28, fontSize: 15 };

  const modalOverlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(16,16,20,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 60,
    padding: "1rem",
    boxSizing: "border-box",
  };
  const modalCard = {
    width: "100%",
    maxWidth: 640,
    background: "#fff",
    borderRadius: 12,
    padding: "1.5rem 1.5rem",
    boxShadow: "0 14px 50px rgba(2,6,23,0.18)",
    boxSizing: "border-box",
  };
  const closeBtnStyle = {
    background: "#f6f6fb",
    border: "1px solid rgba(34,34,34,0.06)",
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#444",
    fontSize: 18,
    lineHeight: 1,
  };

  const label = { fontSize: 15, color: "#333", fontWeight: 700, marginBottom: 8 };
  const inputBase = {
    padding: "0.75rem 0.85rem",
    borderRadius: 10,
    border: "1px solid #e6e0ff",
    fontSize: 15,
    width: "100%",
    boxSizing: "border-box",
    background: "white",
  };
  const clickableField = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0.6rem 0.75rem",
    borderRadius: 10,
    border: "1px solid #e9e6fb",
    background: "#fbfbff",
    cursor: "pointer",
  };
  const errorStyle = { color: "#d23", marginTop: 6, fontSize: 13 };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Your Skill Matches</h1>

      <div style={gridStyle}>
        {mockMatches.map((match) => (
          <div key={match.id} style={cardStyle}>
            <h2 style={nameStyle}>{match.name}</h2>
            <p style={skillLineStyle}>
              <strong>They can teach you:</strong>{" "}
              <span style={{ color: "#6a5acd", fontWeight: 600 }}> {match.teaches}</span>
            </p>
            <p style={skillLineStyle}>
              <strong>They want to learn:</strong> <span style={{ color: "#555" }}> {match.learns}</span>
            </p>

            <div style={actionsRow}>
              <button
                style={messageBtn}
                onClick={() => {
                  console.log("Message", match.name);
                }}
              >
                Message
              </button>

              <button style={scheduleBtn} onClick={() => openModalFor(match)}>
                Schedule Meet
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={confirmStyle} role="status" aria-live="polite">
        {confirmation}
      </div>

      {modalOpen && (
        <div style={modalOverlay} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Schedule meeting form">
          <div style={modalCard} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={onSubmit}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Schedule meeting</h3>
                <button type="button" onClick={() => setModalOpen(false)} style={closeBtnStyle} aria-label="Close form">
                  ✕
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                <div style={label}>Meeting type</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15 }}>
                    <input ref={firstFieldRef} type="radio" name="type" value="online" checked={meetType === "online"} onChange={() => setMeetType("online")} />
                    <span style={{ marginLeft: 6 }}>Online</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 15 }}>
                    <input type="radio" name="type" value="inperson" checked={meetType === "inperson"} onChange={() => setMeetType("inperson")} />
                    <span style={{ marginLeft: 6 }}>In person</span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 180px", minWidth: 140 }}>
                  <div style={label}>Date</div>

                  <div style={{ ...clickableField, position: "relative" }} onClick={openDatePicker}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: "#222" }}>{date}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>Tap to change</div>
                    </div>

                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.7 }}>
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#dcd7ff" strokeWidth="1.2" fill="none"></rect>
                    </svg>

                    <input
                      ref={dateInputRef}
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {errors.date && <div style={errorStyle}>{errors.date}</div>}
                </div>

                <div style={{ flex: "1 1 140px", minWidth: 120 }}>
                  <div style={label}>Time</div>

                  <div style={{ ...clickableField, position: "relative" }} onClick={openTimePicker}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, color: "#222" }}>{time}</div>
                      <div style={{ fontSize: 13, color: "#888" }}>Tap to change</div>
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
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {errors.time && <div style={errorStyle}>{errors.time}</div>}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={label}>Title / Note (optional)</div>
                <input style={inputBase} type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Coffee & code review" />
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #e6e6ea", background: "#fff", cursor: "pointer", fontSize: 15 }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "0.7rem 1.05rem", borderRadius: 8, border: "none", background: "#6a5acd", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15 }}>
                  Create meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
