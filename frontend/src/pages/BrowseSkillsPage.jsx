import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const pillColors = [
    { bg: '#FDE68A', text: '#92400E' }, // Yellow
    { bg: '#A7F3D0', text: '#065F46' }, // Green
    { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
    { bg: '#FBCFE8', text: '#9D266B' }, // Pink
];

// User Card Component
const UserCard = ({ user, interest, onConnect, connectionStatus }) => {
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

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div>
                <span style={pillStyle}>{interest}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.name}</h3>
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
  const [loading, setLoading] = useState(false);

  const [activeInterest, setActiveInterest] = useState('All');
  const interestsForFilter = useMemo(() => ['All', ...userInterests], [userInterests]);
  
  useEffect(() => {
    if (activeInterest && activeInterest !== 'All') {
      fetchMatches(activeInterest);
    } else {
      setMatches([]);
    }
  }, [activeInterest]);

  const fetchMatches = async (interest) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/users/getMatches',
        { interest },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMatches(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

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
                learnSkill: activeInterest, // Skill you want to learn
                teachSkill: userToConnect.skills_they_want[0], // Skill they want to learn from you
            },
            { withCredentials: true }
        );
        setRequestedUsers(prev => new Set(prev).add(userToConnect.user_id));
    } catch (error) {
        console.error("Error sending connection request:", error);
        alert(error.response?.data?.message || 'Failed to send request.');
    }
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
      marginBottom: '2rem',
  };

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

        {loading ? <p>Finding matches...</p> : (
            <div style={usersGridStyle}>
              {matches.map(user => (
                <UserCard 
                    key={user.user_id} 
                    user={user}
                    interest={activeInterest}
                    onConnect={handleConnect}
                    connectionStatus={getConnectionStatus(user.user_id)}
                />
              ))}
            </div>
        )}
        {activeInterest !== 'All' && !loading && matches.length === 0 && <p>No reciprocal matches found for "{activeInterest}". Try another skill!</p>}
        {activeInterest === 'All' && <p>Select an interest you want to learn to find potential matches.</p>}
      </div>
    </div>
  );
};

export default BrowseSkillsPage;