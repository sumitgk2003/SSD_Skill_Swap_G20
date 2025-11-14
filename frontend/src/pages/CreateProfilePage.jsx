import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSkills, setInterests } from '../store/authSlice';

const CreateProfilePage = () => {
  const dispatch = useDispatch();
  const userSkills = useSelector((state) => state.auth.skills);
  const userInterests = useSelector((state) => state.auth.interests);

  const [bio, setBio] = useState('');
  const [teachingSkillInput, setTeachingSkillInput] = useState('');
  const [learningSkillInput, setLearningSkillInput] = useState('');
  const [currentTeachingSkills, setCurrentTeachingSkills] = useState([]);
  const [currentLearningSkills, setCurrentLearningSkills] = useState([]);
  const [showSaveMessage, setShowSaveMessage] = useState(false); // New state for save message

  useEffect(() => {
    setCurrentTeachingSkills(userSkills);
    setCurrentLearningSkills(userInterests);
    console.log('CreateProfilePage: Initial userSkills from Redux:', userSkills);
    console.log('CreateProfilePage: Initial userInterests from Redux:', userInterests);
  }, [userSkills, userInterests]);

  const addSkill = (type) => {
    if (type === 'teach' && teachingSkillInput && !currentTeachingSkills.includes(teachingSkillInput)) {
      const newSkills = [...currentTeachingSkills, teachingSkillInput];
      setCurrentTeachingSkills(newSkills);
      setTeachingSkillInput('');
      console.log('CreateProfilePage: Added teaching skill. New local state:', newSkills);
    } else if (type === 'learn' && learningSkillInput && !currentLearningSkills.includes(learningSkillInput)) {
      const newInterests = [...currentLearningSkills, learningSkillInput];
      setCurrentLearningSkills(newInterests);
      setLearningSkillInput('');
      console.log('CreateProfilePage: Added learning skill. New local state:', newInterests);
    }
  };
  
  const removeSkill = (skillToRemove, type) => {
      if (type === 'teach') {
          const newSkills = currentTeachingSkills.filter(skill => skill !== skillToRemove);
          setCurrentTeachingSkills(newSkills);
          console.log('CreateProfilePage: Removed teaching skill. New local state:', newSkills);
      } else {
          const newInterests = currentLearningSkills.filter(skill => skill !== skillToRemove);
          setCurrentLearningSkills(newInterests);
          console.log('CreateProfilePage: Removed learning skill. New local state:', newInterests);
      }
  };

  const handleSaveProfile = () => {
    console.log('CreateProfilePage: Saving profile...');
    console.log('CreateProfilePage: Dispatching setSkills with:', currentTeachingSkills);
    dispatch(setSkills(currentTeachingSkills));
    console.log('CreateProfilePage: Dispatching setInterests with:', currentLearningSkills);
    dispatch(setInterests(currentLearningSkills));
    // In a real application, you would also send this data to a backend API
    
    setShowSaveMessage(true); // Show the message
    setTimeout(() => {
      setShowSaveMessage(false); // Hide the message after 3 seconds
    }, 3000);
  };

  const pageStyle = { padding: '3rem', maxWidth: '800px', margin: '2rem auto' };
  const formContainerStyle = { backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' };
  const sectionTitleStyle = { fontSize: '1.5rem', color: '#333', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' };
  const inputGroupStyle = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const inputStyle = { flexGrow: 1, padding: '0.8rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' };
  const buttonStyle = { padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#6a5acd', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
  const skillTagContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '40px' };
  const skillTagStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f0eaff', color: '#6a5acd', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 500 };
  const removeBtnStyle = { cursor: 'pointer', border: 'none', backgroundColor: 'transparent', color: '#6a5acd', fontWeight: 'bold', fontSize: '1rem' };
  const saveMessageStyle = {
    textAlign: 'center',
    color: '#4CAF50', // Green color for success
    fontSize: '1.1rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Set Up Your Profile</h1>
        
        {/* Bio Section */}
        <div>
          <h2 style={sectionTitleStyle}>Your Bio</h2>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="Tell everyone a little about yourself..." 
            style={{...inputStyle, width: '100%', minHeight: '100px', boxSizing: 'border-box', marginBottom: '2rem' }} 
          />
        </div>

        {/* Skills You Teach Section */}
        <div>
          <h2 style={sectionTitleStyle}>Skills You Can Teach</h2>
          <div style={inputGroupStyle}>
            <input type="text" value={teachingSkillInput} onChange={(e) => setTeachingSkillInput(e.target.value)} placeholder="e.g., Python Programming" style={inputStyle} />
            <button onClick={() => addSkill('teach')} style={buttonStyle}>Add</button>
          </div>
          <div style={skillTagContainerStyle}>
            {currentTeachingSkills.map(skill => (
              <div key={skill} style={skillTagStyle}>
                {skill}
                <button onClick={() => removeSkill(skill, 'teach')} style={removeBtnStyle}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills You Want to Learn Section */}
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={sectionTitleStyle}>Skills You Want To Learn</h2>
          <div style={inputGroupStyle}>
            <input type="text" value={learningSkillInput} onChange={(e) => setLearningSkillInput(e.target.value)} placeholder="e.g., Play Guitar" style={inputStyle} />
            <button onClick={() => addSkill('learn')} style={buttonStyle}>Add</button>
          </div>
          <div style={skillTagContainerStyle}>
            {currentLearningSkills.map(skill => (
              <div key={skill} style={skillTagStyle}>
                {skill}
                <button onClick={() => removeSkill(skill, 'learn')} style={removeBtnStyle}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '3rem'}}>
            {showSaveMessage && <p style={saveMessageStyle}>Profile Saved!</p>}
            <button onClick={handleSaveProfile} style={{...buttonStyle, padding: '0.8rem 3rem', fontSize: '1.1rem'}}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
