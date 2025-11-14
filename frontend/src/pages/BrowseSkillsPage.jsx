
import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector

const BrowseSkillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const userInterests = useSelector((state) => state.auth.interests); // Get interests from Redux

  // Use userInterests as the source for skills to browse
  const skillsToBrowse = userInterests;

  const filteredSkills = skillsToBrowse.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageStyle = {
    padding: '2rem 4rem',
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
  };

  const searchInputStyle = {
    width: '100%',
    maxWidth: '500px',
    padding: '0.8rem 1rem',
    fontSize: '1.1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
  };

  const skillCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '1.2rem',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Browse Your Interests</h1>
      <input
        type="text"
        placeholder="Search your interests..."
        style={searchInputStyle}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {skillsToBrowse.length === 0 ? (
        <p>You haven't added any interests yet. Go to your profile to add some!</p>
      ) : (
        <div style={skillsGridStyle}>
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div key={skill} style={skillCardStyle}>
                {skill}
              </div>
            ))
          ) : (
            <p>No interests found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowseSkillsPage;
