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
    alignItems: 'flex-start',
  },
  inputWrapper: {
    position: 'relative',
    flexGrow: 1,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'var(--background-secondary)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  // Updated Dropdown Styles for visibility
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--background-primary)', // Uses theme color
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    marginTop: '5px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  suggestionItem: {
    padding: '0.8rem 1rem',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    transition: 'background-color 0.2s',
    display: 'block',
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
    height: '46px',
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
  
  // Input states
  const [teachingSkillInput, setTeachingSkillInput] = useState('');
  const [learningSkillInput, setLearningSkillInput] = useState('');
  
  // Active lists (User's selected skills)
  const [currentTeachingSkills, setCurrentTeachingSkills] = useState([]);
  const [currentLearningSkills, setCurrentLearningSkills] = useState([]);
  
  // Data for suggestions
  const [allSkills, setAllSkills] = useState([]); 
  const [teachSuggestions, setTeachSuggestions] = useState([]);
  const [learnSuggestions, setLearnSuggestions] = useState([]);
  
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  // 1. Fetch all skills on load
  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/users/getAllSkills', {
          withCredentials: true 
        });

        console.log("Raw Skills Response:", res.data);

        // PARSING LOGIC based on your Backend Code:
        // Backend returns: new ApiResponse(200, flattenedUniqueArray, "...")
        // Axios puts that inside res.data. 
        // So the array is at res.data.data
        let fetchedSkills = [];
        
        if (res.data && Array.isArray(res.data.data)) {
            fetchedSkills = res.data.data;
        } else if (Array.isArray(res.data)) {
            // Fallback if ApiResponse is not used/configured differently
            fetchedSkills = res.data;
        }

        // Sanitize: Ensure all items are strings
        const cleanSkills = fetchedSkills
            .filter(item => typeof item === 'string')
            .map(item => item.trim());

        setAllSkills(cleanSkills);
        console.log("Skills loaded:", cleanSkills.length);

      } catch (error) {
        console.error("Error fetching skills list:", error);
      }
    };
    fetchAllSkills();
  }, []);

  // Initialize local state from Redux
  useEffect(() => {
    setLocalBio(userBio || '');
    setCurrentTeachingSkills(userSkills || []);
    setCurrentLearningSkills(userInterests || []);
  }, [userSkills, userInterests, userBio]);

  // 2. Filtering Logic
  const getSuggestions = (inputValue) => {
    if (!inputValue || inputValue.trim() === '') return [];
    
    const lowerInput = inputValue.toLowerCase();
    
    // Filter the master list
    return allSkills.filter(skill => 
      skill.toLowerCase().startsWith(lowerInput)
    ).slice(0, 10); // Limit to top 10 matches to avoid huge lists
  };

  // 3. Handlers
  const handleTeachInputChange = (e) => {
    const val = e.target.value;
    setTeachingSkillInput(val);
    setTeachSuggestions(getSuggestions(val));
  };

  const handleLearnInputChange = (e) => {
    const val = e.target.value;
    setLearningSkillInput(val);
    setLearnSuggestions(getSuggestions(val));
  };

  const selectSuggestion = (skill, type) => {
    if (type === 'teach') {
      setTeachingSkillInput(skill);
      setTeachSuggestions([]); // Hide dropdown
    } else {
      setLearningSkillInput(skill);
      setLearnSuggestions([]); // Hide dropdown
    }
  };

  const addSkill = (type) => {
    if (type === 'teach') {
        if (teachingSkillInput && !currentTeachingSkills.includes(teachingSkillInput.toLowerCase())) {
            const newSkills = [...currentTeachingSkills, teachingSkillInput.toLowerCase()];
            setCurrentTeachingSkills(newSkills);
            setTeachingSkillInput('');
            setTeachSuggestions([]);
        }
    } else if (type === 'learn') {
        if (learningSkillInput && !currentLearningSkills.includes(learningSkillInput.toLowerCase())) {
            const newInterests = [...currentLearningSkills, learningSkillInput.toLowerCase()];
            setCurrentLearningSkills(newInterests);
            setLearningSkillInput('');
            setLearnSuggestions([]);
        }
    }
  };
   
  const removeSkill = (skillToRemove, type) => {
      if (type === 'teach') {
          setCurrentTeachingSkills(currentTeachingSkills.filter(skill => skill !== skillToRemove));
      } else {
          setCurrentLearningSkills(currentLearningSkills.filter(skill => skill !== skillToRemove));
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
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setSkills(currentTeachingSkills));
        dispatch(setInterests(currentLearningSkills));
        dispatch(setBio(bio));
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
    
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
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

        {/* TEACHING SKILLS SECTION */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills You Can Teach</h2>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <input 
                type="text" 
                value={teachingSkillInput} 
                onChange={handleTeachInputChange} 
                placeholder="e.g., Python Programming" 
                style={styles.input} 
                autoComplete="off"
              />
              {teachSuggestions.length > 0 && (
                <ul style={styles.suggestionsList}>
                  {teachSuggestions.map((skill, index) => (
                    <li 
                      key={index} 
                      style={styles.suggestionItem}
                      onMouseDown={() => selectSuggestion(skill, 'teach')} // onMouseDown fires before onBlur
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-primary-light)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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

        {/* LEARNING SKILLS SECTION */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills You Want To Learn</h2>
          <div style={styles.inputGroup}>
             <div style={styles.inputWrapper}>
                <input 
                  type="text" 
                  value={learningSkillInput} 
                  onChange={handleLearnInputChange} 
                  placeholder="e.g., Play Guitar" 
                  style={styles.input} 
                  autoComplete="off"
                />
                {learnSuggestions.length > 0 && (
                  <ul style={styles.suggestionsList}>
                    {learnSuggestions.map((skill, index) => (
                      <li 
                        key={index} 
                        style={styles.suggestionItem}
                        onMouseDown={() => selectSuggestion(skill, 'learn')}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-primary-light)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
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
