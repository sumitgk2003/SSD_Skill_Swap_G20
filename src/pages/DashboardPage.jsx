import React from 'react';

const DashboardPage = () => {
  const pageStyle = {
    padding: '2rem 4rem',
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '1rem',
  };
  
  const sectionTitleStyle = {
      fontSize: '1.8rem',
      color: '#444',
      marginTop: '3rem',
      marginBottom: '1.5rem',
  };

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  };

  const skillCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  return (
    <div style={pageStyle}>
      <h1 style={headerStyle}>Welcome back, User!</h1>

      <section>
        <h2 style={sectionTitleStyle}>Skills You're Learning</h2>
        <div style={skillsGridStyle}>
          <div style={skillCardStyle}>
            <h3>Advanced CSS Grid</h3>
            <p>Next session: Tomorrow at 4:00 PM</p>
          </div>
          <div style={skillCardStyle}>
            <h3>Introduction to Beekeeping</h3>
            <p>Completed: 75%</p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={sectionTitleStyle}>Skills You're Teaching</h2>
        <div style={skillsGridStyle}>
          <div style={skillCardStyle}>
            <h3>Creative Writing</h3>
            <p>2 new student requests</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
