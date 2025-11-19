import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const styles = {
  page: {
    padding: '2rem',
    backgroundColor: 'var(--background-secondary)',
    minHeight: 'calc(100vh - 100px)',
  },
  card: {
    maxWidth: '900px',
    margin: '2rem auto',
    backgroundColor: 'var(--background-primary)',
    borderRadius: '16px',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--border-color)',
    padding: '2rem 3rem',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  topSection: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '2rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '2rem',
    marginBottom: '2rem',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-primary-light)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '4rem',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
    flexShrink: 0,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  name: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'var(--text-primary)',
  },
  bio: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
    margin: '0 0 1rem 0',
    maxWidth: '600px',
  },
  skillsSection: {
    marginTop: '2rem',
  },
  skillsTitle: {
    fontSize: '1.5rem',
    color: 'var(--text-primary)',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  skillTagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  skillTag: {
    display: 'inline-block',
    backgroundColor: 'var(--accent-primary-light)',
    color: 'var(--accent-primary)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: 500,
  },
  noSkillsText: {
    color: 'var(--text-secondary)',
    fontStyle: 'italic',
  },
  button: {
    padding: '0.6rem 1.2rem',
    border: '1px solid var(--accent-primary)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: 'var(--accent-primary)',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s, color 0.2s',
  },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const userBio = useSelector((state) => state.auth.bio);
  const userSkills = useSelector((state) => state.auth.skills);
  const userInterests = useSelector((state) => state.auth.interests);
  const user = useSelector((state) => state.auth.user);
  
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topSection}>
          <div style={styles.avatar}>{(user?.name || "U").charAt(0)}</div>
          <div style={styles.info}>
            <h1 style={styles.name}>{user?.name || "User Name"}</h1>
            <p style={styles.bio}>{userBio || `No bio yet. Click 'Edit Profile' to add one!`}</p>
            <button style={styles.button} onClick={() => navigate('/create-profile')}>Edit Profile</button>
          </div>
        </div>

        <div style={styles.skillsSection}>
          <h2 style={styles.skillsTitle}>Skills You Can Teach</h2>
          <div style={styles.skillTagsContainer}>
              {userSkills && userSkills.length > 0 ? (
                  userSkills.map((skill, index) => (
                      <span key={index} style={styles.skillTag}>{skill}</span>
                  ))
              ) : (
                  <p style={styles.noSkillsText}>No skills added yet. Go to "Edit Profile" to add some!</p>
              )}
          </div>
        </div>

        <div style={styles.skillsSection}>
          <h2 style={styles.skillsTitle}>Skills You Want To Learn</h2>
          <div style={styles.skillTagsContainer}>
              {userInterests && userInterests.length > 0 ? (
                  userInterests.map((interest, index) => (
                      <span key={index} style={styles.skillTag}>{interest}</span>
                  ))
              ) : (
                  <p style={styles.noSkillsText}>No interests added yet. Go to "Edit Profile" to add some!</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
