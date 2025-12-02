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
        onClick={() => onMatchClick(match)}
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
  const [sessionSummary, setSessionSummary] = useState(null);
  const [upcomingMeets, setUpcomingMeets] = useState([]);
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

    const fetchSessionSummary = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/sessions/me/summary', { withCredentials: true });
        if (res.data && res.data.success) setSessionSummary(res.data.data);
      } catch (err) {
        console.error('Error fetching session summary:', err);
      }
    };

    const fetchUpcomingMeets = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/meets', { withCredentials: true });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const now = Date.now();
          // parse dates robustly and include any future meet
          const future = res.data.data
            .filter(meet => {
              if (!meet || !meet.dateAndTime) return false;
              const ts = Date.parse(meet.dateAndTime);
              return !isNaN(ts) && ts > now;
            })
            .sort((a, b) => Date.parse(a.dateAndTime) - Date.parse(b.dateAndTime));

          console.log('fetchUpcomingMeets: total', res.data.data.length, 'future', future.length);
          // log details to help debug missing skillBeingTaught
          future.forEach(m => {
            try {
              console.log('meet-debug', m._id, 'skillBeingTaught=', m.skillBeingTaught, 'match.skill1=', m.match && m.match.skill1, 'match.skill2=', m.match && m.match.skill2, 'match.user1=', m.match && (m.match.user1 && (m.match.user1._id || m.match.user1)), 'organizer=', m.organizer);
            } catch (e) {
              console.log('meet-debug error for', m._id, e);
            }
          });
          setUpcomingMeets(future);
        }
      } catch (err) {
        console.error('Error fetching upcoming meets:', err);
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

    console.log('DashboardPage useEffect fired; user present?', !!user, 'user:', user && (user._id || user.id || user.email));
    if (user) {
      fetchData();
      fetchRequests();
      fetchSessionSummary();
      console.log('Calling fetchUpcomingMeets()');
      fetchUpcomingMeets();
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

  const handleSkillClick = (match) => {
    // Prevent navigation to chat/meetings for pending or rejected connections
    const status = match?.status;
    if (status && (status === 'pending' || status === 'rejected')) {
      // No navigation; silently ignore or show a brief notice
      alert('This connection is not active yet. Accept the request to open the chat/meetings.');
      return;
    }
    navigate(`/match/${match._id}`);
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

        {sessionSummary && (
          <section style={{marginBottom: '2rem'}}>
            <h2 style={sectionHeaderStyle}>Your Progress</h2>
            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <div style={{background:'var(--background-secondary)', padding:'1rem', borderRadius:12, minWidth:180}}>
                <h3 style={{margin:0}}>Hours Taught</h3>
                <p style={{fontSize:'1.5rem', margin:0}}>{sessionSummary.hoursTaught || 0} hrs</p>
                <small>{sessionSummary.sessionsTaught || 0} sessions</small>
              </div>

              <div style={{background:'var(--background-secondary)', padding:'1rem', borderRadius:12, minWidth:180}}>
                <h3 style={{margin:0}}>Hours Learned</h3>
                <p style={{fontSize:'1.5rem', margin:0}}>{sessionSummary.hoursLearned || 0} hrs</p>
                <small>{sessionSummary.sessionsLearned || 0} sessions</small>
              </div>

              <div style={{background:'var(--background-secondary)', padding:'1rem', borderRadius:12, minWidth:180}}>
                <h3 style={{margin:0}}>Avg Rating</h3>
                <p style={{fontSize:'1.5rem', margin:0}}>{sessionSummary.avgRatingReceived !== null ? sessionSummary.avgRatingReceived : '—'}</p>
                <small>Rating received on taught sessions</small>
              </div>

              <div style={{background:'var(--background-secondary)', padding:'1rem', borderRadius:12, minWidth:180}}>
                <h3 style={{margin:0}}>Current Streak</h3>
                <p style={{fontSize:'1.5rem', margin:0}}>{sessionSummary.currentStreakDays || 0} days</p>
                <small>Consecutive active days</small>
              </div>
            </div>
          </section>
        )}

        {upcomingMeets.length > 0 && (
          <section style={{marginBottom: '2rem'}}>
            <h2 style={sectionHeaderStyle}>Upcoming Meets</h2>
            <div style={{...gridStyle, gridTemplateColumns: '1fr', gap: '1rem'}}>
              {upcomingMeets.map(meet => {
                const meetDate = new Date(meet.dateAndTime);
                const dateStr = meetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const timeStr = meetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const organizerName = meet.organizerName || (meet.organizer?.name || 'Unknown');
                const organizerIdRaw = (meet.organizer && (meet.organizer._id || meet.organizer)) || null;
                const organizerId = organizerIdRaw ? String(organizerIdRaw) : null;
                const currentUserId = String(user?._id || user?.id);
                const isOrganizer = organizerId === currentUserId;
                
                // Determine if user is teaching or learning based on organizerRole
                // If user is organizer: use organizerRole; if user is attendee: opposite of organizerRole
                let userIsTeaching = false;
                if (isOrganizer) {
                  userIsTeaching = meet.organizerRole === 'teach';
                } else {
                  userIsTeaching = meet.organizerRole === 'learn';
                }
                console.log('meet-role-debug', meet._id, 'organizerId=', organizerId, 'currentUserId=', currentUserId, 'isOrganizer=', isOrganizer, 'organizerRole=', meet.organizerRole, 'userIsTeaching=', userIsTeaching);

                // Determine skillBeingTaught: prefer explicit field, fallback to match.skill1/skill2 when available
                let displayedSkill = meet.skillBeingTaught || null;
                try {
                  if (!displayedSkill && meet.match) {
                    const m = typeof meet.match === 'object' ? meet.match : null;
                    if (m && (m.skill1 || m.skill2)) {
                      // Extract match.user1 id robustly
                      let matchUser1 = null;
                      if (m.user1) {
                        if (typeof m.user1 === 'object') {
                          matchUser1 = m.user1._id ? String(m.user1._id) : null;
                        } else {
                          matchUser1 = String(m.user1);
                        }
                      }

                      const organizerIsUser1 = matchUser1 && organizerId && (matchUser1 === organizerId);
                      displayedSkill = organizerIsUser1 ? (m.skill1 || null) : (m.skill2 || null);
                    }
                  }
                } catch (e) {
                  console.log('skill fallback failed for meet', meet._id, e);
                }

                // Ensure UI uses the derived skill when original field is missing
                if (displayedSkill && !meet.skillBeingTaught) {
                  meet.skillBeingTaught = displayedSkill;
                }

                return (
                  <div key={meet._id} style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{flex: 1, minWidth: '200px'}}>
                      <h3 style={{margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>
                        {meet.title || 'Skill Swap Meet'}
                      </h3>
                      {userIsTeaching ? (
                        meet.skillBeingTaught && (
                          <p style={{margin: '0.3rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.95rem', fontWeight: '600'}}>
                            📚 Teaching: <strong>{meet.skillBeingTaught}</strong>
                          </p>
                        )
                      ) : (
                        meet.skillBeingTaught && (
                          <p style={{margin: '0.3rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.95rem', fontWeight: '600'}}>
                            🎓 Learning: <strong>{meet.skillBeingTaught}</strong>
                          </p>
                        )
                      )}
                      <p style={{margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                        {dateStr} at {timeStr}
                      </p>
                      <p style={{margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                        With: <strong>{meet.attendees && meet.attendees.length > 0 ? meet.attendees.join(', ') : organizerName}</strong>
                      </p>
                      {meet.zoomJoinUrl && (
                        <p style={{margin: '0.5rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem'}}>
                          📹 Zoom: <a href={meet.zoomJoinUrl} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}>Join meeting</a>
                        </p>
                      )}
                      {meet.googleEventHtmlLink && (
                        <p style={{margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem'}}>
                          📅 <a href={meet.googleEventHtmlLink} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}>View in Google Calendar</a>
                        </p>
                      )}
                    </div>
                    <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                      {meet.meetType === 'online' && <span style={{display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#BFDBFE', color: '#1E40AF'}}>💻 Online</span>}
                      {meet.meetType === 'in person' && <span style={{display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#A7F3D0', color: '#065F46'}}>📍 In Person</span>}
                      {userIsTeaching ? (
                        <span style={{display: 'inline-flex', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#FDE68A', color: '#92400E', alignItems: 'center', gap: '0.5rem'}}>
                          <span>📚 Teaching</span>
                          {meet.skillBeingTaught && (
                            <span style={{background: 'transparent', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem'}}>• {meet.skillBeingTaught}</span>
                          )}
                        </span>
                      ) : (
                        <span style={{display: 'inline-flex', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#C7D2FE', color: '#3730A3', alignItems: 'center', gap: '0.5rem'}}>
                          <span>🎓 Learning</span>
                          {meet.skillBeingTaught && (
                            <span style={{background: 'transparent', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem'}}>• {meet.skillBeingTaught}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        
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