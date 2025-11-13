import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector

const ProfilePage = () => {
  const navigate = useNavigate();
  const userSkills = useSelector((state) => state.auth.skills); // Get skills from Redux
  const userInterests = useSelector((state) => state.auth.interests); // Get interests from Redux

  const pageStyle = {
    padding: '3rem',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    marginTop: '3rem',
  };

  const topSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '2rem',
    marginBottom: '2rem',
  };

  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '4rem',
    color: '#aaa',
  };

  const nameStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  };
  
  const bioStyle = {
      color: '#555',
      marginTop: '0.5rem',
  };

  const skillsSectionStyle = {
      marginTop: '2rem',
  };

  const skillsTitleStyle = {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1rem',
  };

  const skillTagStyle = {
      display: 'inline-block',
      backgroundColor: '#f0eaff',
      color: '#6a5acd',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      margin: '0 0.5rem 0.5rem 0',
      fontWeight: 500,
  };
  
  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    border: '1px solid #6a5acd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#6a5acd',
  };

  return (
    <div style={pageStyle}>
      <div style={topSectionStyle}>
        <div style={avatarStyle}>U</div>
        <div>
          <h1 style={nameStyle}>User Name</h1>
          <p style={bioStyle}>Passionate developer and mentor, eager to share knowledge about React and modern web technologies.</p>
          <button style={buttonStyle} onClick={() => navigate('/create-profile')}>Edit Profile</button>
        </div>
      </div>

      <div style={skillsSectionStyle}>
        <h2 style={skillsTitleStyle}>Skills You Can Teach</h2>
        <div>
            {userSkills.length > 0 ? (
                userSkills.map((skill, index) => (
                    <span key={index} style={skillTagStyle}>{skill}</span>
                ))
            ) : (
                <p>No skills added yet. Go to "Edit Profile" to add some!</p>
            )}
        </div>
      </div>

      <div style={skillsSectionStyle}>
        <h2 style={skillsTitleStyle}>Skills You Want To Learn</h2>
        <div>
            {userInterests.length > 0 ? (
                userInterests.map((interest, index) => (
                    <span key={index} style={skillTagStyle}>{interest}</span>
                ))
            ) : (
                <p>No interests added yet. Go to "Edit Profile" to add some!</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
