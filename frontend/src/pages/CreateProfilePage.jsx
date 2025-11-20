import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSkills, setInterests, setBio } from '../store/authSlice';
import axios from 'axios';

const styles = {
  page: {
    padding: '2rem',
    backgroundColor: 'var(--background-secondary)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 100px)',
  },
  card: {
    width: '100%',
    maxWidth: '800px',
    margin: '2rem auto',
    backgroundColor: 'var(--background-primary)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--border-color)',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  title: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: 'var(--text-primary)',
    marginBottom: '1rem',
    fontWeight: 'bold',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.5rem',
  },
  inputGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  input: {
    flexGrow: 1,
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'var(--background-secondary)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    boxSizing: 'border-box',
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'var(--background-secondary)',
    color: 'var(--text-primary)',
    outline: 'none',
    resize: 'vertical',
  },
  button: {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  skillTagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    minHeight: '40px',
    padding: '0.5rem 0',
  },
  skillTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--accent-primary-light)',
    color: 'var(--accent-primary)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: 500,
  },
  removeBtn: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--accent-primary)',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '0',
    lineHeight: 1,
  },
  saveButtonContainer: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  saveButton: {
    padding: '0.8rem 3rem',
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  saveMessage: {
    textAlign: 'center',
    color: 'green',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
};

const CreateProfilePage = () => {
  const dispatch = useDispatch();
  const userSkills = useSelector((state) => state.auth.skills);
  const userInterests = useSelector((state) => state.auth.interests);
  const userBio = useSelector((state) => state.auth.bio);
  const [bio, setLocalBio] = useState('');
  const [teachingSkillInput, setTeachingSkillInput] = useState('');
  const [learningSkillInput, setLearningSkillInput] = useState('');
  const [currentTeachingSkills, setCurrentTeachingSkills] = useState([]);
  const [currentLearningSkills, setCurrentLearningSkills] = useState([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    setLocalBio(userBio || '');
    setCurrentTeachingSkills(userSkills || []);
    setCurrentLearningSkills(userInterests || []);
  }, [userSkills, userInterests, userBio]);

  const addSkill = (type) => {
    if (type === 'teach' && teachingSkillInput && !currentTeachingSkills.includes(teachingSkillInput.toLowerCase())) {
      const newSkills = [...currentTeachingSkills, teachingSkillInput.toLowerCase()];
      setCurrentTeachingSkills(newSkills);
      setTeachingSkillInput('');
    } else if (type === 'learn' && learningSkillInput && !currentLearningSkills.includes(learningSkillInput.toLowerCase())) {
      const newInterests = [...currentLearningSkills, learningSkillInput.toLowerCase()];
      setCurrentLearningSkills(newInterests);
      setLearningSkillInput('');
    }
  };
  
  const removeSkill = (skillToRemove, type) => {
      if (type === 'teach') {
          const newSkills = currentTeachingSkills.filter(skill => skill !== skillToRemove);
          setCurrentTeachingSkills(newSkills);
      } else {
          const newInterests = currentLearningSkills.filter(skill => skill !== skillToRemove);
          setCurrentLearningSkills(newInterests);
      }
  };

  const handleSaveProfile = async() => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/updateProfile`,
        {
          interests: currentLearningSkills,
          skills: currentTeachingSkills,
          bio: bio,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log("Profile update successful:", res);
        dispatch(setSkills(currentTeachingSkills));
        dispatch(setInterests(currentLearningSkills));
        dispatch(setBio(bio));
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
    
    setShowSaveMessage(true);
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Set Up Your Profile</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Bio</h2>
          <textarea 
            value={bio} 
            onChange={(e) => setLocalBio(e.target.value)} 
            placeholder={userBio || `Tell everyone a little about yourself...`} 
            style={styles.textarea} 
          />
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills You Can Teach</h2>
          <div style={styles.inputGroup}>
            <input type="text" value={teachingSkillInput} onChange={(e) => setTeachingSkillInput(e.target.value)} placeholder="e.g., Python Programming" style={styles.input} />
            <button onClick={() => addSkill('teach')} style={styles.button}>Add</button>
          </div>
          <div style={styles.skillTagContainer}>
            {currentTeachingSkills.map(skill => (
              <div key={skill} style={styles.skillTag}>
                {skill}
                <button onClick={() => removeSkill(skill, 'teach')} style={styles.removeBtn}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills You Want To Learn</h2>
          <div style={styles.inputGroup}>
            <input type="text" value={learningSkillInput} onChange={(e) => setLearningSkillInput(e.target.value)} placeholder="e.g., Play Guitar" style={styles.input} />
            <button onClick={() => addSkill('learn')} style={styles.button}>Add</button>
          </div>
          <div style={styles.skillTagContainer}>
            {currentLearningSkills.map(skill => (
              <div key={skill} style={styles.skillTag}>
                {skill}
                <button onClick={() => removeSkill(skill, 'learn')} style={styles.removeBtn}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.saveButtonContainer}>
            {showSaveMessage && <p style={styles.saveMessage}>Profile Saved!</p>}
            <button onClick={handleSaveProfile} style={styles.saveButton}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
