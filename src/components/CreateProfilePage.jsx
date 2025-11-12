import React, { useState } from 'react';

const CreateProfilePage = () => {
  const [bio, setBio] = useState('');
  const [teachingSkill, setTeachingSkill] = useState('');
  const [learningSkill, setLearningSkill] = useState('');
  const [teachingSkills, setTeachingSkills] = useState(['React', 'Node.js']);
  const [learningSkills, setLearningSkills] = useState(['Pottery']);

  const addSkill = (type) => {
    if (type === 'teach' && teachingSkill && !teachingSkills.includes(teachingSkill)) {
      setTeachingSkills([...teachingSkills, teachingSkill]);
      setTeachingSkill('');
    } else if (type === 'learn' && learningSkill && !learningSkills.includes(learningSkill)) {
      setLearningSkills([...learningSkills, learningSkill]);
      setLearningSkill('');
    }
  };
  
  const removeSkill = (skillToRemove, type) => {
      if (type === 'teach') {
          setTeachingSkills(teachingSkills.filter(skill => skill !== skillToRemove));
      } else {
          setLearningSkills(learningSkills.filter(skill => skill !== skillToRemove));
      }
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
            <input type="text" value={teachingSkill} onChange={(e) => setTeachingSkill(e.target.value)} placeholder="e.g., Python Programming" style={inputStyle} />
            <button onClick={() => addSkill('teach')} style={buttonStyle}>Add</button>
          </div>
          <div style={skillTagContainerStyle}>
            {teachingSkills.map(skill => (
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
            <input type="text" value={learningSkill} onChange={(e) => setLearningSkill(e.target.value)} placeholder="e.g., Play Guitar" style={inputStyle} />
            <button onClick={() => addSkill('learn')} style={buttonStyle}>Add</button>
          </div>
          <div style={skillTagContainerStyle}>
            {learningSkills.map(skill => (
              <div key={skill} style={skillTagStyle}>
                {skill}
                <button onClick={() => removeSkill(skill, 'learn')} style={removeBtnStyle}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '3rem'}}>
            <button style={{...buttonStyle, padding: '0.8rem 3rem', fontSize: '1.1rem'}}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
