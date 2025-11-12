import React from 'react';

const mockMatches = [
  { id: 1, name: 'Alice', teaches: 'Creative Writing', learns: 'React' },
  { id: 2, name: 'Bob', teaches: 'Public Speaking', learns: 'Node.js' },
  { id: 3, name: 'Charlie', teaches: 'Graphic Design', learns: 'Pottery' },
  { id: 4, name: 'Diana', teaches: 'Yoga Instruction', learns: 'Python' },
  { id: 5, name: 'Eve', teaches: 'Bread Making', learns: 'React' },
  { id: 6, name: 'Frank', teaches: 'Chess Strategy', learns: 'Pottery' },
];

const FindMatchesPage = () => {
  const pageStyle = { padding: '2rem 4rem' };
  const headerStyle = { fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '2rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' };
  const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column' };
  const nameStyle = { fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0' };
  const skillLineStyle = { marginBottom: '1rem', lineHeight: '1.4' };
  const buttonStyle = { marginTop: 'auto', width: '100%', padding: '0.8rem', border: 'none', borderRadius: '8px', backgroundColor: '#6a5acd', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Your Skill Matches</h1>
      <div style={gridStyle}>
        {mockMatches.map(match => (
          <div key={match.id} style={cardStyle}>
            <h2 style={nameStyle}>{match.name}</h2>
            <p style={skillLineStyle}>
              <strong>They can teach you:</strong> <span style={{ color: '#6a5acd', fontWeight: '500' }}>{match.teaches}</span>
            </p>
            <p style={skillLineStyle}>
              <strong>They want to learn:</strong> <span style={{ color: '#555' }}>{match.learns}</span>
            </p>
            <button style={buttonStyle}>Connect</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindMatchesPage;
