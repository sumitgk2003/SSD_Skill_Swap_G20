import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

const mockUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'A',
    skillsToTeach: ['Machine Learning', 'Creative Writing'],
    skillsToLearn: ['React'],
    bio: 'Data Scientist solving problems at scale, making predictions, and finding patterns. I use Python, SQL, and algorithms.'
  },
  {
    id: 2,
    name: 'Bob Williams',
    avatar: 'B',
    skillsToTeach: ['Python 3'],
    skillsToLearn: ['Public Speaking', 'Node.js'],
    bio: 'Learn the basics of Python 3.12, one of the most powerful, versatile, and in-demand programming languages today.'
  },
  {
    id: 3,
    name: 'Charlie Brown',
    avatar: 'C',
    skillsToTeach: ['Security+', 'Graphic Design'],
    skillsToLearn: ['Pottery'],
    bio: 'Master IT security basics and prep for the CompTIA Security+ exam with hands-on learning on threats and cryptography.'
  },
  {
    id: 4,
    name: 'Diana Prince',
    avatar: 'D',
    skillsToTeach: ['Code Foundations', 'Python'],
    skillsToLearn: ['Yoga Instruction'],
    bio: 'Start your programming journey with an introduction to the world of code and basic concepts. Perfect for beginners.'
  },
    {
    id: 5,
    name: 'Ethan Hunt',
    avatar: 'E',
    skillsToTeach: ['Advanced CSS', 'React'],
    skillsToLearn: ['Bread Making'],
    bio: 'I can teach you how to create complex and responsive layouts using modern CSS techniques like Flexbox and Grid.'
  },
  {
    id: 6,
    name: 'Fiona Glenanne',
    avatar: 'F',
    skillsToTeach: ['UX Research', 'Spanish'],
    skillsToLearn: ['Salsa Dancing'],
    bio: 'Expert in user-centered design methodologies, from interviews and surveys to usability testing and persona creation.'
  },
];

const pillColors = [
    { bg: '#FDE68A', text: '#92400E' }, // Yellow
    { bg: '#A7F3D0', text: '#065F46' }, // Green
    { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
    { bg: '#FBCFE8', text: '#9D266B' }, // Pink
];

// User Card Component
const UserCard = ({ user, onConnect, connectionStatus }) => {
    const pillColor = pillColors[user.id % pillColors.length];

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
                <span style={pillStyle}>{user.skillsToTeach[0]}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', flexGrow: 1 }}>{user.bio}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span>Wants to learn: {user.skillsToLearn[0]}</span>
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

  const [activeInterest, setActiveInterest] = useState('All');
  const interestsForFilter = useMemo(() => ['All', ...userInterests], [userInterests]);

  const filteredUsers = useMemo(() => {
    if (activeInterest === 'All') return mockUsers;

    const lowercasedInterest = activeInterest.toLowerCase();
    return mockUsers.filter(user => 
        user.skillsToTeach.some(skill => skill.toLowerCase().includes(lowercasedInterest))
    );
  }, [activeInterest]);

  const handleConnect = (userToConnect) => {
    setRequestedUsers(prev => new Set(prev).add(userToConnect.id));
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

        <div style={usersGridStyle}>
          {filteredUsers.map(user => (
            <UserCard 
                key={user.id} 
                user={user} 
                onConnect={handleConnect}
                connectionStatus={getConnectionStatus(user.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseSkillsPage;