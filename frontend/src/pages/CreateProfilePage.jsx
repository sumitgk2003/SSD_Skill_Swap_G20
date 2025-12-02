import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSkills, setInterests, setBio, setAvailability, setTimezone, setPreferredFormats } from '../store/authSlice';
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
  const userAvailability = useSelector((state) => state.auth.availability);
  const userTimezone = useSelector((state) => state.auth.timezone);
  const preferredFormats = useSelector((state) => state.auth.preferredFormats);
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
  // Availability and preferences
  const [localTimezone, setLocalTimezone] = useState('');
  const [preferredFormatsState, setPreferredFormatsState] = useState({ online: true, 'in person': true, chat: true });
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [slotDay, setSlotDay] = useState(1);
  const [slotStart, setSlotStart] = useState('18:00');
  const [slotEnd, setSlotEnd] = useState('19:00');

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
    // initialize availability from redux when available
    if (Array.isArray(userAvailability) && userAvailability.length > 0) {
      setAvailabilitySlots(userAvailability);
    }
    // load timezone and preferred formats from user slice if available
    setLocalTimezone(userTimezone || '');
    setPreferredFormatsState({
      online: preferredFormats.includes('online'),
      'in person': preferredFormats.includes('in person'),
      chat: preferredFormats.includes('chat'),
    });
    // Note: better approach is to pull timezone/preferredFormats from redux auth slice when available
  }, [userSkills, userInterests, userBio, userAvailability]);

  // List of common IANA timezones for dropdown
  const timezoneOptions = [
    'UTC', 'Etc/UTC', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Moscow',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver',
    'America/Sao_Paulo', 'America/Argentina/Buenos_Aires',
    'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Dubai', 'Asia/Jakarta',
    'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
  ];

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
          timezone: localTimezone || undefined,
          preferredFormats: Object.keys(preferredFormatsState).filter(k => preferredFormatsState[k]),
          availability: availabilitySlots,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setSkills(currentTeachingSkills));
        dispatch(setInterests(currentLearningSkills));
        dispatch(setBio(bio));
        // persist availability to redux so other pages (Profile/Edit) can show them
        dispatch(setAvailability(availabilitySlots));
        // also persist timezone and preferredFormats into redux
        dispatch(setTimezone(localTimezone || ''));
        dispatch(setPreferredFormats(Object.keys(preferredFormatsState).filter(k => preferredFormatsState[k])));
      }
    } catch (error) {
      console.error("Error during profile update:", error);
    }
    
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const addAvailabilitySlot = () => {
    if (!slotStart || !slotEnd) return alert('Please provide start and end times');
    const slot = { dayOfWeek: Number(slotDay), start: slotStart, end: slotEnd };
    setAvailabilitySlots(prev => [...prev, slot]);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailabilitySlots(prev => prev.filter((_, i) => i !== index));
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

        {/* AVAILABILITY & PREFERENCES */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Availability & Preferences</h2>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Timezone</label>
            <select value={localTimezone} onChange={(e) => setLocalTimezone(e.target.value)} style={styles.input}>
              <option value="">{'Select your timezone'}</option>
              {timezoneOptions.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Preferred formats</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['online','in person','chat'].map(fmt => (
                <label key={fmt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" checked={preferredFormatsState[fmt]} onChange={() => setPreferredFormatsState(prev => ({ ...prev, [fmt]: !prev[fmt] }))} />
                  <span style={{ color: 'var(--text-primary)' }}>{fmt}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Availability slots</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <select value={slotDay} onChange={(e) => setSlotDay(e.target.value)} style={styles.input}>
                {Array.from({ length: 7 }).map((_, i) => <option key={i} value={i}>{dayNames[i]}</option>)}
              </select>
              <input type="time" value={slotStart} onChange={(e) => setSlotStart(e.target.value)} style={{ ...styles.input, width: 140 }} />
              <input type="time" value={slotEnd} onChange={(e) => setSlotEnd(e.target.value)} style={{ ...styles.input, width: 140 }} />
              <button onClick={addAvailabilitySlot} style={styles.button}>Add slot</button>
            </div>

            <div style={styles.skillTagContainer}>
              {availabilitySlots.map((s, idx) => (
                <div key={idx} style={styles.skillTag}>
                  {dayNames[s.dayOfWeek]} {s.start}–{s.end}
                  <button onClick={() => removeAvailabilitySlot(idx)} style={styles.removeBtn}>×</button>
                </div>
              ))}
            </div>
          </div>
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
