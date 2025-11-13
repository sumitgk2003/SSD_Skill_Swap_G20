// src/pages/MeetsListPage.jsx
import React, { useEffect, useMemo, useState } from "react";

const DUMMY_MEETS = [
  {
    id: "m1",
    title: "React Hooks Deep-dive",
    host: "Alice",
    type: "online",
    date: "2025-11-18",
    time: "18:00",
    tz: "Asia/Kolkata",
    joinUrl: "https://zoom.us/j/111111111",
    notes: "Bring questions about useEffect and useMemo",
  },
  {
    id: "m2",
    title: "Weekend Bread Baking",
    host: "Eve",
    type: "inperson",
    date: "2025-11-14",
    time: "10:30",
    location: "Community Kitchen, Hall B",
    tz: "Asia/Kolkata",
    joinUrl: null,
    notes: "Bring an apron",
  },
  {
    id: "m3",
    title: "Chess Strategy: Endgames",
    host: "Frank",
    type: "online",
    date: "2025-11-20",
    time: "20:00",
    tz: "Asia/Kolkata",
    joinUrl: "https://zoom.us/j/333333333",
    notes: "Beginner-friendly",
  },
  {
    id: "m4",
    title: "Creative Writing Workshop",
    host: "Alice",
    type: "inperson",
    date: "2025-11-16",
    time: "16:00",
    location: "Room 204, Arts Building",
    tz: "Asia/Kolkata",
    joinUrl: null,
    notes: "Please bring a notepad",
  },
  {
    id: "m5",
    title: "Intro to Node.js",
    host: "Bob",
    type: "online",
    date: "2025-11-15",
    time: "19:00",
    tz: "Asia/Kolkata",
    joinUrl: "https://zoom.us/j/555555555",
    notes: "Beginner friendly — installs beforehand",
  },
];

export default function MeetsListPage() {
  const [filter, setFilter] = useState("all"); // all | online | inperson
  const [search, setSearch] = useState("");

  // load Inter font once
  useEffect(() => {
    const id = "inter-font-link";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // prepare meets: parse datetime and sort earliest-first
  const meets = useMemo(() => {
    return DUMMY_MEETS.map((m) => {
      const ts = new Date(`${m.date}T${m.time}:00`).getTime();
      return { ...m, ts };
    }).sort((a, b) => a.ts - b.ts);
  }, []);

  const visible = useMemo(() => {
    return meets.filter((m) => {
      if (filter === "online" && m.type !== "online") return false;
      if (filter === "inperson" && m.type !== "inperson") return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !(
            m.title.toLowerCase().includes(q) ||
            (m.host && m.host.toLowerCase().includes(q)) ||
            (m.notes && m.notes.toLowerCase().includes(q))
          )
        )
          return false;
      }
      return true;
    });
  }, [meets, filter, search]);

  // ---------- styles (full-width content with padding; stacked cards; larger typography) ----------
  const pageStyle = {
    width: "100%",
    padding: "2.5rem 3rem", // outer padding so content doesn't touch edges
    fontFamily: "'Inter', system-ui, Arial, -apple-system, 'Segoe UI', Roboto",
    background: "#faf7fe",
    minHeight: "100vh",
    boxSizing: "border-box",
  };

  // hero stays centered but uses full-width minus padding
  const heroStyle = {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto 1.25rem auto",
    padding: "1.2rem 1rem",
    background: "white",
    borderRadius: 12,
    boxShadow: "0 8px 26px rgba(22,23,24,0.04)",
    boxSizing: "border-box",
  };

  const titleStyle = { fontSize: "1.9rem", fontWeight: 800, margin: 0, color: "#222" }; // larger
  const subtitleStyle = { marginTop: 8, color: "#666", fontSize: "1.05rem" };

  const controlsBar = { marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };

  const filterBtn = (active) => ({
    padding: "0.55rem 0.9rem",
    borderRadius: 10,
    border: active ? "none" : "1px solid rgba(34,34,34,0.08)",
    background: active ? "#6a5acd" : "transparent",
    color: active ? "#fff" : "#333",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.98rem",
  });

  const searchStyle = {
    marginLeft: "auto",
    padding: "0.6rem 0.9rem",
    borderRadius: 10,
    border: "1px solid #e6e0ff",
    minWidth: 260,
    fontSize: 15,
  };

  // stacked list: single column, each card full width of the content area (maxWidth)
  const listWrap = {
    maxWidth: 1200,
    margin: "1rem auto 2.5rem auto",
    width: "100%",
    boxSizing: "border-box",
  };

  const listGrid = {
    display: "grid",
    gridTemplateColumns: "1fr", // single column -> stacked cards
    gap: "1rem",
  };

  const card = {
    background: "#fff",
    borderRadius: 12,
    padding: "1.25rem 1.25rem",
    boxShadow: "0 8px 30px rgba(2,6,23,0.04)",
    border: "1px solid #f0eefb",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 };
  const titleCard = { fontSize: 18, fontWeight: 800, margin: 0, color: "#222", lineHeight: 1.12 }; // larger
  const hostStyle = { fontSize: 15, color: "#666", marginTop: 6 };

  const metaRow = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
  const pill = { padding: "0.4rem 0.7rem", borderRadius: 9, fontSize: 14, fontWeight: 700 };

  const onlinePill = { ...pill, background: "#f0eaff", color: "#6a5acd" };
  const inpersonPill = { ...pill, background: "#eefbf0", color: "#138a3b" };

  const whenStyle = { fontSize: 15, color: "#333", fontWeight: 700 };

  const notesStyle = { color: "#444", fontSize: 15, marginTop: 6 };

  const joinBtn = {
    marginTop: "0.6rem",
    padding: "0.75rem 1rem",
    borderRadius: 10,
    border: "none",
    background: "#6a5acd",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    alignSelf: "flex-start",
    fontSize: 15,
  };

  const disabledBtn = {
    ...joinBtn,
    background: "transparent",
    border: "1px solid rgba(34,34,34,0.08)",
    color: "#666",
    cursor: "default",
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <h1 style={titleStyle}>Available Meets</h1>
        <p style={subtitleStyle}>Browse upcoming skill-swap meets. Use filters or search to find a meet that fits your schedule.</p>

        <div style={controlsBar}>
          <button style={filterBtn(filter === "all")} onClick={() => setFilter("all")}>
            All
          </button>
          <button style={filterBtn(filter === "online")} onClick={() => setFilter("online")}>
            Online
          </button>
          <button style={filterBtn(filter === "inperson")} onClick={() => setFilter("inperson")}>
            In person
          </button>

          <input
            placeholder="Search title, host, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
            aria-label="Search meets"
          />
        </div>
      </div>

      <div style={listWrap}>
        <div style={listGrid}>
          {visible.length === 0 ? (
            <div style={{ padding: "2rem", background: "white", borderRadius: 12, textAlign: "center", color: "#666", fontSize: 16 }}>
              No meets found.
            </div>
          ) : (
            visible.map((m) => {
              const when = new Date(`${m.date}T${m.time}:00`).toLocaleString();
              return (
                <article key={m.id} style={card} aria-labelledby={`meet-${m.id}`}>
                  <div style={cardHeader}>
                    <div style={{ minWidth: 0 }}>
                      <h3 id={`meet-${m.id}`} style={titleCard}>
                        {m.title}
                      </h3>
                      <div style={hostStyle}>
                        Host: <strong style={{ color: "#222" }}>{m.host}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                      <div style={metaRow}>
                        <div style={m.type === "online" ? onlinePill : inpersonPill}>{m.type === "online" ? "Online" : "In person"}</div>
                      </div>
                      <div style={{ fontSize: 14, color: "#666" }}>{m.tz}</div>
                    </div>
                  </div>

                  <div style={whenStyle}>{when}</div>

                  {m.location && <div style={notesStyle}>Location: {m.location}</div>}
                  {m.notes && <div style={notesStyle}>{m.notes}</div>}

                  {m.joinUrl ? (
                    <a href={m.joinUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                      <button style={joinBtn}>Join / View</button>
                    </a>
                  ) : (
                    <button style={disabledBtn} disabled>
                      In-person — No link
                    </button>
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
