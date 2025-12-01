import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const pillColors = [
    { bg: '#FDE68A', text: '#92400E' }, // Yellow
    { bg: '#A7F3D0', text: '#065F46' }, // Green
    { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
    { bg: '#FBCFE8', text: '#9D266B' }, // Pink
];

// --- COACH CARD COMPONENT (NEW) ---
const CoachCard = ({ coach, onBook }) => {
    const navigate = useNavigate();
    const pillColor = pillColors[coach.id.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #F59E0B', // Gold border for Premium
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
    };
    
    const [hovered, setHovered] = useState(false);
    const dynamicCardStyle = {
        ...cardStyle,
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(245, 158, 11, 0.15)' : 'var(--card-shadow)', // Golden glow on hover
    }

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const bookButtonStyle = {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        backgroundColor: '#F59E0B', // Gold background
        color: 'white',
        border: 'none',
        transition: 'all 0.2s ease-in-out',
    };

    const premiumBadgeStyle = {
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: '#FDE68A',
        color: '#92400E',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const rateStyle = {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginTop: 'auto',
    };

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/coach/${coach.id}`)}
        >
            <div style={premiumBadgeStyle}>Premium Coach</div>
            
            <div>
                <span style={pillStyle}>{coach.expertise}</span>
            </div>
            
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{coach.name}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#F59E0B', fontSize: '1rem' }}>★</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{coach.rating.toFixed(1)}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({coach.reviewCount} reviews)</span>
            </div>

            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {coach.bio}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={rateStyle}>${coach.rate}/hr</span>
            </div>

            <button 
                style={bookButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onBook(coach);
                }}
            >
                Book Session
            </button>
        </div>
    );
};


// --- EXISTING USER CARD COMPONENT ---
const UserCard = ({ user, onConnect, connectionStatus }) => {
    const navigate = useNavigate();
    const interest = user.matchedInterest;
    const pillColor = pillColors[user.user_id.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        cursor: 'pointer',
    };
    
    const [hovered, setHovered] = useState(false);
    const dynamicCardStyle = {
        ...cardStyle,
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(0,0,0,0.2)' : 'var(--card-shadow)',
    }

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const connectButtonStyle = {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        backgroundColor: connectionStatus === 'requested' ? 'var(--background-secondary)' : 'var(--accent-primary)',
        color: connectionStatus === 'requested' ? 'var(--text-secondary)' : 'white',
        border: connectionStatus === 'requested' ? '1px solid var(--border-color)' : 'none',
        transition: 'all 0.2s ease-in-out',
    };

    const handleCardClick = () => {
        navigate(`/user/${user.user_id}`);
    };

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            <div>
                <span style={pillStyle}>{interest}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.name}</h3>
            
            {user.avgRating != null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#ffc107', fontSize: '1rem' }}>★</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.avgRating.toFixed(1)}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({user.reviewCount} reviews)</span>
                </div>
            ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                    No ratings yet
                </div>
            )}

            <p style={{ margin: 0, color: 'var(--text-secondary)', flexGrow: 1 }}>This user can teach you {interest} and is interested in learning one of your skills.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span>Wants to learn: {user.skills_they_want.join(', ')}</span>
            </div>
            <button 
                style={connectButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onConnect(user);
                }}
                disabled={connectionStatus === 'requested'}
            >
                {connectionStatus === 'requested' ? 'Requested' : 'Connect'}
            </button>
        </div>
    );
};


const BrowseSkillsPage = () => {
  const { interests: userInterests } = useSelector((state) => state.auth);
  const [requestedUsers, setRequestedUsers] = useState(new Set());
  const [matches, setMatches] = useState([]);
  const [coaches, setCoaches] = useState([]); // State for coaches
  const [viewMode, setViewMode] = useState('peers'); // 'peers' or 'coaches'
  const [loading, setLoading] = useState(false);
  const [activeInterest, setActiveInterest] = useState('All');
  const interestsForFilter = useMemo(() => ['All', ...userInterests], [userInterests]);
  
  // Mock Data generator for coaches (Replace with API call in production)
  useEffect(() => {
    const generateCoaches = () => {
        const skillsToGenerate = activeInterest === 'All' ? userInterests : [activeInterest];
        if(!skillsToGenerate.length) return [];

        const mockNames = ['Sarah Jenkins', 'Mike Chen', 'Elena Rodriguez', 'David Kim', 'Anita Roy', 'James Wilson'];
        
        return mockNames.map((name, index) => {
            const skill = skillsToGenerate[index % skillsToGenerate.length];
            return {
                id: `coach-${index}`,
                name: name,
                expertise: skill || 'General Mentorship',
                rating: 4.5 + (Math.random() * 0.5),
                reviewCount: Math.floor(Math.random() * 100) + 20,
                rate: Math.floor(Math.random() * 50) + 30, // Rate between $30 and $80
                bio: `Certified professional in ${skill || 'mentorship'} with over ${Math.floor(Math.random() * 10) + 3} years of experience helping students achieve their goals.`
            };
        });
    };

    setCoaches(generateCoaches());
  }, [activeInterest, userInterests]);


  const fetchMatchesForInterest = async (interest) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/users/getMatches',
        { interest },
        { withCredentials: true }
      );
      if (res.data.success) {
        const matchesWithInterest = res.data.data.map(match => ({ ...match, matchedInterest: interest }));
        setMatches(matchesWithInterest);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error(`Error fetching matches for ${interest}:`, error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMatches = async () => {
    if (!userInterests || userInterests.length === 0) {
      setMatches([]);
      return;
    }
    setLoading(true);
    try {
      const allMatchesPromises = userInterests.map(interest =>
        axios.post(
          'http://localhost:8000/api/v1/users/getMatches',
          { interest },
          { withCredentials: true }
        ).then(res => {
          if (res.data.success) {
            return res.data.data.map(match => ({ ...match, matchedInterest: interest }));
          }
          return [];
        })
      );

      const results = await Promise.all(allMatchesPromises);
      const flattenedMatches = results.flat();

      const uniqueMatches = new Map();
      flattenedMatches.forEach(match => {
        if (!uniqueMatches.has(match.user_id)) {
          uniqueMatches.set(match.user_id, match);
        }
      });

      setMatches(Array.from(uniqueMatches.values()));
    } catch (error) {
      console.error("Error fetching all matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeInterest === 'All') {
      fetchAllMatches();
    } else if (activeInterest) {
      fetchMatchesForInterest(activeInterest);
    }
  }, [activeInterest, userInterests]);


  const handleConnect = async (userToConnect) => {
    if (!userToConnect.skills_they_want || userToConnect.skills_they_want.length === 0) {
      console.error("Cannot connect: No matching skills they want.");
      return;
    }

    try {
        await axios.post(
            'http://localhost:8000/api/v1/users/sendRequest',
            {
                recipientId: userToConnect.user_id,
                learnSkill: userToConnect.matchedInterest,
                teachSkill: userToConnect.skills_they_want[0],
            },
            { withCredentials: true }
        );
        setRequestedUsers(prev => new Set(prev).add(userToConnect.user_id));
    } catch (error) {
        console.error("Error sending connection request:", error);
        alert(error.response?.data?.message || 'Failed to send request.');
    }
  };
  
  const handleBookCoach = (coach) => {
      // Placeholder for booking logic
      alert(`Booking functionality for ${coach.name} ($${coach.rate}/hr) coming soon!`);
  };

  const getConnectionStatus = (userId) => {
    return requestedUsers.has(userId) ? 'requested' : 'none';
  };

  const pageStyle = {
    padding: '4rem 2rem',
    backgroundColor: 'var(--background-primary)',
    color: 'var(--text-primary)',
    minHeight: 'calc(100vh - 60px)',
  };

  const contentWrapperStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  };

  const mainHeadlineStyle = {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 'bold',
      marginBottom: '1rem',
  };

  const toggleContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      backgroundColor: 'var(--background-secondary)',
      padding: '0.25rem',
      borderRadius: '9999px',
      width: 'fit-content',
      margin: '0 auto 2rem auto',
      border: '1px solid var(--border-color)',
  };

  const toggleButtonStyle = (isActive) => ({
      padding: '0.5rem 1.5rem',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
      color: isActive ? 'var(--background-primary)' : 'var(--text-secondary)',
      transition: 'all 0.2s ease',
  });

  const interestFilterContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '3rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--border-color)',
  };

  const interestFilterButtonStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    border: '1px solid transparent',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--background-secondary)',
    color: isActive ? 'white' : 'var(--text-primary)',
    transition: 'all 0.2s ease',
    borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
  });

  const usersGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  };

  return (
    <div style={pageStyle}>
      <div style={contentWrapperStyle}>
        <h1 style={mainHeadlineStyle}>Find Your Skill Swap Partner</h1>
        
        {/* View Mode Toggle */}
        <div style={toggleContainerStyle}>
            <button 
                style={toggleButtonStyle(viewMode === 'peers')}
                onClick={() => setViewMode('peers')}
            >
                Find Peers (Barter)
            </button>
            <button 
                style={toggleButtonStyle(viewMode === 'coaches')}
                onClick={() => setViewMode('coaches')}
            >
                Find Coaches (Premium)
            </button>
        </div>

        <div style={interestFilterContainerStyle}>
            {userInterests.length > 0 ? (
                interestsForFilter.map(interest => (
                    <button
                        key={interest}
                        style={interestFilterButtonStyle(activeInterest === interest)}
                        onClick={() => setActiveInterest(interest)}
                    >
                        {interest}
                    </button>
                ))
            ) : (
                <p style={{color: 'var(--text-secondary)'}}>Add some interests to your profile to see tailored matches!</p>
            )}
        </div>

        {/* PEER VIEW */}
        {viewMode === 'peers' && (
            loading ? <p>Finding matches...</p> : (
                <>
                    <div style={usersGridStyle}>
                    {matches.map(user => (
                        <UserCard 
                            key={user.user_id} 
                            user={user}
                            onConnect={handleConnect}
                            connectionStatus={getConnectionStatus(user.user_id)}
                        />
                    ))}
                    </div>
                    {!loading && matches.length === 0 && (
                    <p>
                        {activeInterest === 'All'
                        ? 'No potential matches found across all your interests.'
                        : `No reciprocal matches found for "${activeInterest}". Try another skill!`}
                    </p>
                    )}
                </>
            )
        )}

        {/* COACH VIEW */}
        {viewMode === 'coaches' && (
            <div style={usersGridStyle}>
                {coaches.length > 0 ? (
                    coaches.map(coach => (
                        <CoachCard 
                            key={coach.id}
                            coach={coach}
                            onBook={handleBookCoach}
                        />
                    ))
                ) : (
                    <p style={{ gridColumn: '1/-1' }}>No coaches found for this skill.</p>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default BrowseSkillsPage;