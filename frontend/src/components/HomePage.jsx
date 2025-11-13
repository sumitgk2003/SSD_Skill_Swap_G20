
import React from 'react';
import { Link } from 'react-router-dom';

const buttonStyle = {
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
};

const HomePage = () => {
  const heroStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '5rem 2rem',
  };
  const heroTitleStyle = { fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.2, maxWidth: '600px', color: '#333' };
  const heroSubtitleStyle = { fontSize: '1.2rem', color: '#666', marginBottom: '2rem', maxWidth: '500px' };
  const featuredSectionStyle = { padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#fff' };
  const featuredTitleStyle = { fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333' };
  const skillsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' };
  const skillCardStyle = { backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'left'};
  
  return (
    <>
      <section style={heroStyle}>
        <h1 style={heroTitleStyle}>Share a Skill, Gain a Skill</h1>
        <p style={heroSubtitleStyle}>
          The best place to find skilled individuals to learn from, and a platform to share your own expertise with the world.
        </p>
        <Link to="/signup" style={{...buttonStyle, backgroundColor: '#6a5acd', color: 'white', fontSize: '1.1rem', padding: '0.8rem 2rem'}}>
          Get Started
        </Link>
      </section>
      
      <section style={featuredSectionStyle}>
          <h2 style={featuredTitleStyle}>Featured Skills</h2>
          <div style={skillsGridStyle}>
              <div style={skillCardStyle}><h3>Web Development</h3><p>Learn to build modern websites.</p></div>
              <div style={skillCardStyle}><h3>Graphic Design</h3><p>Create stunning visuals.</p></div>
              <div style={skillCardStyle}><h3>Public Speaking</h3><p>Master the art of persuasion.</p></div>
              <div style={skillCardStyle}><h3>Creative Writing</h3><p>Tell compelling stories.</p></div>
          </div>
      </section>
    </>
  );
};

export default HomePage;
