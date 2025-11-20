import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const pillColors = [
    { bg: '#FDE68A', text: '#92400E' }, // Yellow
    { bg: '#A7F3D0', text: '#065F46' }, // Green
    { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
    { bg: '#FBCFE8', text: '#9D266B' }, // Pink
];

// --- RequestCard Component ---
const RequestCard = ({ request, onAccept, onDecline }) => {
    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        flexWrap: 'wrap',
    };
    
    const avatarStyle = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-primary-light)',
        color: 'var(--accent-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        flexShrink: 0,
    };

    const infoStyle = { flexGrow: 1 };
    const nameStyle = { margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' };
    const skillStyle = { margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' };

    const buttonGroupStyle = { display: 'flex', gap: '0.75rem', marginLeft: 'auto' };
    const acceptButtonStyle = {
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#28a745',
        color: 'white',
    };
    const declineButtonStyle = {
        padding: '0.6rem 1.2rem',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#dc3545',
        color: 'white',
    };

    return (
        <div style={cardStyle}>
            <div style={avatarStyle}>{request.sender.name.charAt(0)}</div>
            <div style={infoStyle}>
                <h4 style={nameStyle}>{request.sender.name}</h4>
                <p style={skillStyle}>
                    Wants to learn <strong>{request.teaching_requirement}</strong> from you, and will teach you <strong>{request.learning_opportunity}</strong>.
                </p>
            </div>
            <div style={buttonGroupStyle}>
                <button style={acceptButtonStyle} onClick={() => onAccept(request._id)} aria-label={`Accept connection from ${request.sender.name}`}>Accept</button>
                <button style={declineButtonStyle} onClick={() => onDecline(request._id)} aria-label={`Decline connection from ${request.sender.name}`}>Decline</button>
            </div>
        </div>
    );
};


// --- MatchCard Component ---
const MatchCard = ({ match, type, onMatchClick }) => {
    const [hovered, setHovered] = useState(false);
    const pillColor = pillColors[match.partner.name.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        textAlign: 'left',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(0,0,0,0.15)' : 'var(--card-shadow)',
    };

    const avatarStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem',
    };

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const titleStyle = { margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold' };
    const emailStyle = { margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' };
    const skillStyle = { margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' };
    const statusStyle = { margin: '0.5rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 'bold' };

    return (
        <div 
            style={cardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onMatchClick(match._id)}
        >
            <div style={headerStyle}>
                <div style={avatarStyle}>{match.partner.name.charAt(0)}</div>
                <div>
                    <h3 style={titleStyle}>{match.partner.name}</h3>
                    <p style={emailStyle}>{match.partner.email}</p>
                </div>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
                <span style={pillStyle}>{type === 'teaching' ? '📚 Teaching' : '🎓 Learning'}</span>
            </div>

            <div>
                {type === 'teaching' ? (
                    <p style={skillStyle}>
                        <strong>Teaching:</strong> {match.skill_i_teach || 'N/A'}
                    </p>
                ) : (
                    <p style={skillStyle}>
                        <strong>Learning:</strong> {match.skill_i_learn || 'N/A'}
                    </p>
                )}
                <p style={statusStyle}>
                    Status: {match.status ? match.status.charAt(0).toUpperCase() + match.status.slice(1) : 'Active'}
                </p>
            </div>
        </div>
    );
};

// --- SkillCard Component ---
const SkillCard = ({ skill, type, onSkillClick }) => {
    const [hovered, setHovered] = useState(false);
    const pillColor = pillColors[skill.id.charCodeAt(1) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        textAlign: 'left',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(0,0,0,0.15)' : 'var(--card-shadow)',
    };
    
    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const titleStyle = { margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' };
    const statusStyle = { margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' };
    
    const progressContainerStyle = {
        width: '100%',
        height: '8px',
        backgroundColor: 'var(--border-color)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '0.5rem',
    };
    
    const progressBarStyle = {
        width: `${skill.progress || 0}%`,
        height: '100%',
        backgroundColor: 'var(--accent-primary)',
        borderRadius: '4px',
        transition: 'width 0.5s ease-in-out',
    };

    return (
        <div 
            style={cardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onSkillClick(skill.id)}
        >
            <div>
                <span style={pillStyle}>{skill.category}</span>
            </div>
            <h3 style={titleStyle}>{skill.title}</h3>

            {type === 'learning' ? (
                <div>
                    <p style={statusStyle}>{skill.nextSession ? `Next: ${skill.nextSession}` : skill.status}</p>
                    {skill.progress !== undefined && (
                        <div>
                            <div style={progressContainerStyle}>
                                <div style={progressBarStyle}></div>
                            </div>
                            <p style={{...statusStyle, textAlign: 'right', marginTop: '0.25rem'}}>{skill.progress}% Complete</p>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto'}}>
                    <p style={statusStyle}><strong style={{color: 'var(--text-primary)'}}>{skill.requests}</strong> new requests</p>
                    <p style={statusStyle}><strong style={{color: 'var(--text-primary)'}}>{skill.upcoming}</strong> upcoming</p>
                </div>
            )}
        </div>
    );
};


const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [learningMatches, setLearningMatches] = useState([]);
  const [teachingMatches, setTeachingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all connections/matches
        const connectionsRes = await axios.get(
          'http://localhost:8000/api/v1/users/getConnections',
          { withCredentials: true }
        );

        if (connectionsRes.data.success) {
          const allMatches = connectionsRes.data.data || [];
          
          // Separate matches into learning and teaching
          // Learning matches: where I want to LEARN (skill_i_learn)
          const learning = allMatches.filter(match => match.skill_i_learn);
          
          // Teaching matches: where I TEACH (skill_i_teach)
          const teaching = allMatches.filter(match => match.skill_i_teach);
          
          setLearningMatches(learning);
          setTeachingMatches(teaching);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
        setLearningMatches([]);
        setTeachingMatches([]);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8000/api/v1/users/viewRequests',
          { withCredentials: true }
        );
        if (res.data.success) {
          setIncomingRequests(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching connection requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
      fetchRequests();
    }
  }, [user]);

  const respondToRequest = async (requestId, status) => {
    try {
      await axios.post(
        'http://localhost:8000/api/v1/users/respondRequest',
        { requestId, status },
        { withCredentials: true }
      );
      setIncomingRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error(`Error responding to request (${status}):`, error);
      alert(`Failed to ${status} request.`);
    }
  };
  
  const handleAccept = (requestId) => {
    respondToRequest(requestId, 'accepted');
  };
  
  const handleDecline = (requestId) => {
    respondToRequest(requestId, 'rejected');
  };

  const handleSkillClick = (matchId) => {
    navigate(`/match/${matchId}`);
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
  };

  const headerStyle = {
      fontSize: 'clamp(2.2rem, 5vw, 3rem)',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
  };
  
  const subHeaderStyle = {
      fontSize: '1.2rem',
      color: 'var(--text-secondary)',
      marginBottom: '3rem',
  }

  const sectionHeaderStyle = {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border-color)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '4rem',
  };

  return (
    <div style={pageStyle}>
      <div style={contentWrapperStyle}>
        <h1 style={headerStyle}>Welcome back, {user?.name || 'User'}!</h1>
        <p style={subHeaderStyle}>Here's a snapshot of your learning and teaching journey.</p>
        
        {loading ? (
            <p>Loading requests...</p>
        ) : incomingRequests.length > 0 && (
          <section>
            <h2 style={sectionHeaderStyle}>Connection Requests</h2>
            <div style={{...gridStyle, gridTemplateColumns: '1fr', gap: '1rem'}}>
              {incomingRequests.map(req => (
                <RequestCard 
                  key={req._id} 
                  request={req} 
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 style={sectionHeaderStyle}>Skills You're Learning</h2>
          <div style={gridStyle}>
            {learningMatches.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                No matches yet for skills you're learning. Check back soon!
              </p>
            ) : (
              learningMatches.map(match => (
                <MatchCard key={match._id} match={match} type="learning" onMatchClick={handleSkillClick} />
              ))
            )}
          </div>
        </section>

        <section>
          <h2 style={sectionHeaderStyle}>Skills You're Teaching</h2>
          <div style={gridStyle}>
            {teachingMatches.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                No matches yet for skills you're teaching. Check back soon!
              </p>
            ) : (
              teachingMatches.map(match => (
                <MatchCard key={match._id} match={match} type="teaching" onMatchClick={handleSkillClick} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;