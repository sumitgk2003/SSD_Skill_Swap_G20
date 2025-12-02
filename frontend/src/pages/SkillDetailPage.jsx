import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Message Component with Enhanced UI - Theme Aware
const MessageBubble = ({ message, isOwn, senderName }) => {
    const bubbleStyle = {
        maxWidth: '75%',
        padding: '0.875rem 1.25rem',
        borderRadius: isOwn ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
        backgroundColor: isOwn 
            ? 'var(--accent-primary)' 
            : 'var(--background-secondary)',
        color: isOwn ? '#fff' : 'var(--text-primary)',
        wordWrap: 'break-word',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        boxShadow: isOwn 
            ? '0 2px 8px rgba(0, 0, 0, 0.15)' 
            : '0 1px 3px rgba(0, 0, 0, 0.08)',
        border: isOwn ? 'none' : '1px solid var(--border-color)',
        animation: 'slideIn 0.3s ease-out',
        fontWeight: '500',
    };

    const senderStyle = {
        fontSize: '0.75rem',
        color: isOwn ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)',
        marginBottom: '0.4rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        marginBottom: '1.2rem',
        gap: '0.75rem',
    };

    const avatarStyle = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: isOwn ? 'var(--accent-primary)' : 'var(--accent-primary-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isOwn ? '#fff' : 'var(--accent-primary)',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        flexShrink: 0,
    };

    return (
        <div style={containerStyle}>
            {!isOwn && <div style={avatarStyle}>{senderName.charAt(0)}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                {!isOwn && <div style={senderStyle}>{senderName}</div>}
                <div style={bubbleStyle}>{message}</div>
            </div>
            {isOwn && <div style={avatarStyle}>You</div>}
        </div>
    );
};

import ReportModal from '../components/ReportModal';

// Chat Section Component
const ChatSection = ({ skillId, skillTitle, matchedUsers, onOpenReport }) => {
    const { user } = useSelector((state) => state.auth);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Report (dispute) modal state (local fallback if parent doesn't provide handler)
    const [reportModalOpenLocal, setReportModalOpenLocal] = useState(false);
    const [reportTargetLocal, setReportTargetLocal] = useState(null); // user object being reported
    const [reportReasonLocal, setReportReasonLocal] = useState('');
    const [submittingReportLocal, setSubmittingReportLocal] = useState(false);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    'http://localhost:8000/api/v1/messages/get',
                    { matchId: selectedUser.matchId },
                    { withCredentials: true }
                );
                if (res.data) {
                    setMessages(res.data || []);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedUser]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedUser) return;

        try {
            const res = await axios.post(
                'http://localhost:8000/api/v1/messages/send',
                {
                    matchId: selectedUser.matchId,
                    text: messageInput,
                },
                { withCredentials: true }
            );

            if (res.data) {
                // Add the new message to the messages list
                setMessages([...messages, res.data]);
                setMessageInput('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const chatContainerStyle = {
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '1.5rem',
        height: '650px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--background-secondary)',
        border: '1px solid var(--border-color)',
    };

    // openReportFor replaced by onOpenReport prop passed from parent

    const submitReport = async () => {
        if (!reportTarget || !reportReason.trim()) return alert('Please add a reason for the report');
        setSubmittingReport(true);
        try {
            await axios.post(
                'http://localhost:8000/api/v1/disputes',
                {
                    reportedId: reportTarget._id,
                    matchId: reportTarget.matchId,
                    skill: skillTitle,
                    reason: reportReason,
                },
                { withCredentials: true }
            );
            setReportModalOpen(false);
            alert('Report submitted. Admin will review it shortly.');
        } catch (err) {
            console.error('Failed to submit report', err);
            alert(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setSubmittingReport(false);
        }
    };

    const usersListStyle = {
        backgroundColor: 'var(--background-primary)',
        borderRight: '1px solid var(--border-color)',
        overflowY: 'auto',
        padding: '1.25rem 0',
        display: 'flex',
        flexDirection: 'column',
    };

    const usersListHeaderStyle = {
        padding: '1rem 1.25rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '0.5rem',
    };

    const userItemStyle = (isSelected) => ({
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--accent-primary-light)' : 'transparent',
        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
        borderLeft: isSelected ? `4px solid var(--accent-primary)` : '4px solid transparent',
        fontWeight: isSelected ? '600' : 'normal',
        transition: 'all 0.2s ease',
        borderRadius: '0 8px 8px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        '&:hover': {
            backgroundColor: 'var(--background-secondary)',
        },
    });

    const messagesContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background-secondary)',
        overflow: 'hidden',
        padding: 0,
    };

    const messagesViewStyle = {
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        backgroundColor: 'var(--background-secondary)',
    };

    const formStyle = {
        display: 'flex',
        gap: '0.75rem',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--background-secondary)',
    };

    const inputStyle = {
        flex: 1,
        padding: '0.875rem 1.25rem',
        borderRadius: '24px',
        border: '2px solid var(--border-color)',
        backgroundColor: 'var(--background-primary)',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontFamily: 'inherit',
    };

    const sendBtnStyle = {
        padding: '0.875rem 1.75rem',
        backgroundColor: 'var(--accent-primary)',
        color: '#fff',
        border: 'none',
        borderRadius: '24px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(var(--accent-primary-rgb), 0.3)',
    };

    return (
        <div style={chatContainerStyle}>
            <div style={usersListStyle}>
                <div style={usersListHeaderStyle}>
                    👥 Matched Users ({matchedUsers.length})
                </div>
                {matchedUsers.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '1.25rem', textAlign: 'center' }}>
                        No matched users yet
                    </p>
                ) : (
                    matchedUsers.map((matchUser) => (
                        <div
                            key={matchUser._id}
                            style={userItemStyle(selectedUser?._id === matchUser._id)}
                            onClick={() => setSelectedUser(matchUser)}
                        >
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{matchUser.name}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.65 }}>
                                {matchUser.email}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={messagesContainerStyle}>
                {selectedUser ? (
                    <>
                        <div style={{ 
                            borderBottom: '1px solid var(--border-color)', 
                            padding: '1.25rem 1.5rem',
                            backgroundColor: 'var(--background-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'var(--accent-primary)',
                                fontSize: '1rem',
                            }}>
                                {selectedUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, marginLeft: '0.5rem' }}>
                                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '600' }}>
                                    {selectedUser.name}
                                </h4>
                                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {selectedUser.email}
                                </p>
                            </div>
                                <div style={{ marginLeft: '1rem' }}>
                                <button
                                    onClick={() => {
                                        if (typeof onOpenReport === 'function') return onOpenReport(selectedUser);
                                        setReportTargetLocal(selectedUser);
                                        setReportReasonLocal('');
                                        setReportModalOpenLocal(true);
                                    }}
                                    style={{ padding: '6px 10px', borderRadius: 8, background: '#f97373', color: '#fff', border: 'none', cursor: 'pointer' }}
                                >
                                    Report
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Loading messages...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={messagesViewStyle}>
                                    {messages.length === 0 ? (
                                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                                            No messages yet. Start the conversation!
                                        </p>
                                    ) : (
                                        messages.map((msg) => {
                                            const isOwnMessage = String(msg.sendersId) === String(user?.id || user?._id);
                                            return (
                                                <MessageBubble
                                                    key={msg._id}
                                                    message={msg.text}
                                                    isOwn={isOwnMessage}
                                                    senderName={isOwnMessage ? 'You' : selectedUser.name}
                                                />
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form style={formStyle} onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        style={inputStyle}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--accent-primary)';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(89, 146, 241, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = 'var(--border-color)';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={sendBtnStyle}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 16px rgba(89, 146, 241, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(89, 146, 241, 0.3)';
                                        }}
                                    >
                                        📤 Send
                                    </button>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%', 
                        color: 'var(--text-secondary)',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div style={{ fontSize: '3rem' }}>💬</div>
                        <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>No chat selected</p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
    // Local fallback modal render
    if (reportModalOpenLocal) {
        return (
            <>
                <ReportModal
                    open={reportModalOpenLocal}
                    target={reportTargetLocal}
                    reason={reportReasonLocal}
                    setReason={setReportReasonLocal}
                    onClose={() => setReportModalOpenLocal(false)}
                    onSubmit={async () => {
                        if (!reportTargetLocal || !reportReasonLocal.trim()) return alert('Please add a reason for the report');
                        setSubmittingReportLocal(true);
                        try {
                            await axios.post('http://localhost:8000/api/v1/disputes', {
                                reportedId: reportTargetLocal._id,
                                matchId: reportTargetLocal.matchId,
                                skill: skillTitle,
                                reason: reportReasonLocal,
                            }, { withCredentials: true });
                            setReportModalOpenLocal(false);
                            alert('Report submitted. Admin will review it shortly.');
                        } catch (err) {
                            console.error('Failed to submit report', err);
                            alert(err.response?.data?.message || 'Failed to submit report');
                        } finally {
                            setSubmittingReportLocal(false);
                        }
                    }}
                    submitting={submittingReportLocal}
                />
            </>
        );
    }
    // Report Modal (rendered adjacent to ChatSection)
    // Note: rendered from within ChatSection scope so it has access to state/handlers
    ;
};

// NOTE: modal is placed as a sibling render via a small helper component pattern below
// We render it by conditionally attaching to document.body via portal if needed, but
// for simplicity we will render it directly in the page where ChatSection is mounted.


// Meetings Section Component
const MeetingsSection = ({ skillId, skillTitle, matchedUsers }) => {
    const { user } = useSelector((state) => state.auth);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8000/api/v1/meets', {
                    withCredentials: true,
                });
                if (res.data && res.data.success) {
                    // Filter meetings related to the matched users for this skill
                    const matchedUserIds = matchedUsers.map((u) => u._id);
                    const filteredMeetings = res.data.data.filter((meet) => {
                        const isOrganizerMatched = matchedUserIds.includes(String(meet.organizer));
                        const isParticipantMatched = (meet.participants || []).some((p) =>
                            matchedUserIds.includes(String(p))
                        );
                        return isOrganizerMatched || isParticipantMatched;
                    });

                    const mapped = filteredMeetings.map((m) => ({
                        id: m._id,
                        title: m.title,
                        host: String(m.organizer) === String(user._id) ? 'You' : (m.organizerName || 'Host'),
                        type: m.meetType === 'online' ? 'online' : 'inperson',
                        date: new Date(m.dateAndTime).toISOString().slice(0, 10),
                        time: new Date(m.dateAndTime).toTimeString().slice(0, 5),
                        joinUrl: m.zoomJoinUrl || m.googleEventHtmlLink || null,
                    }));
                    setMeetings(mapped.sort((a, b) => (a.date + 'T' + a.time) > (b.date + 'T' + b.time) ? 1 : -1));
                }
            } catch (error) {
                console.error('Error fetching meetings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [matchedUsers, user._id]);

    const handleJoin = (joinUrl) => {
        if (!joinUrl) return;
        window.open(joinUrl, '_blank', 'noopener,noreferrer');
    };

    const meetingCardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
    };

    const meetingInfoStyle = {
        flex: 1,
    };

    const meetingTitleStyle = {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
    };

    const meetingDetailsStyle = {
        margin: '0.5rem 0 0 0',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    };

    const pillStyle = (type) => ({
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        backgroundColor: type === 'online' ? 'var(--accent-primary-light)' : '#D1E7DD',
        color: type === 'online' ? 'var(--accent-primary)' : '#0F5132',
    });

    const joinBtnStyle = {
        padding: '0.6rem 1.2rem',
        backgroundColor: 'var(--accent-primary)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    };

    return (
        <div>
            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading meetings...
                </p>
            ) : meetings.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No scheduled meetings yet for this skill
                </p>
            ) : (
                <div style={gridStyle}>
                    {meetings.map((meeting) => (
                        <div key={meeting.id} style={meetingCardStyle}>
                            <div style={meetingInfoStyle}>
                                <h4 style={meetingTitleStyle}>{meeting.title}</h4>
                                <p style={meetingDetailsStyle}>
                                    <span style={pillStyle(meeting.type)}>
                                        {meeting.type === 'online' ? '🌐 Online' : '📍 In-Person'}
                                    </span>
                                </p>
                                <p style={meetingDetailsStyle}>
                                    📅 {meeting.date} at {meeting.time}
                                </p>
                                <p style={meetingDetailsStyle}>
                                    👤 {meeting.host}
                                </p>
                            </div>
                            <button
                                style={joinBtnStyle}
                                onClick={() => handleJoin(meeting.joinUrl)}
                                disabled={!meeting.joinUrl}
                                onMouseEnter={(e) => {
                                    if (meeting.joinUrl) e.target.style.opacity = '0.9';
                                }}
                                onMouseLeave={(e) => {
                                    if (meeting.joinUrl) e.target.style.opacity = '1';
                                }}
                            >
                                {meeting.joinUrl ? 'Join' : 'N/A'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Main SkillDetailPage Component
const SkillDetailPage = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [skill, setSkill] = useState(null);
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    // Report modal state (lifted up so modal can be rendered at page level)
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    const [reportReason, setReportReason] = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);

    // Add CSS animations
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }

            input:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        const fetchSkillData = async () => {
            setLoading(true);
            try {
                // Fetch user data to get their profile info
                const userRes = await axios.get('http://localhost:8000/api/v1/users/me', {
                    withCredentials: true,
                });

                if (userRes.data.success) {
                    const userData = userRes.data.data.user;
                    
                    // Get the skill title from the skillId
                    const skills = userData.skills || [];
                    const interests = userData.interests || [];
                    
                    // Determine if this is a teaching or learning skill
                    let foundSkillTitle = null;
                    let foundSkillType = 'unknown';
                    
                    // Check if it's in teaching skills
                    const teachingSkillTitle = skills.find((s) => s.toLowerCase().replace(/\s+/g, '_') === skillId);
                    if (teachingSkillTitle) {
                        foundSkillTitle = teachingSkillTitle;
                        foundSkillType = 'teaching';
                    }
                    
                    // Check if it's in learning skills (interests)
                    const learningSkillTitle = interests.find((s) => s.toLowerCase().replace(/\s+/g, '_') === skillId);
                    if (learningSkillTitle) {
                        foundSkillTitle = learningSkillTitle;
                        foundSkillType = 'learning';
                    }
                    
                    if (foundSkillTitle) {
                        setSkill({
                            id: skillId,
                            title: foundSkillTitle.charAt(0).toUpperCase() + foundSkillTitle.slice(1),
                            category: foundSkillType === 'teaching' ? 'Skill' : 'Interest',
                            type: foundSkillType,
                        });
                    } else {
                        // Fallback: create a basic skill object from the skillId
                        const displayTitle = skillId.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        setSkill({
                            id: skillId,
                            title: displayTitle,
                            category: 'General',
                            type: 'unknown',
                        });
                    }
                    
                    // Fetch all connections to filter by skill
                    try {
                        const connectionsRes = await axios.get(
                            'http://localhost:8000/api/v1/users/getConnections',
                            { withCredentials: true }
                        );
                        
                        if (connectionsRes.data.success) {
                            const allMatches = connectionsRes.data.data;
                            
                            // Filter matches based on the skill being viewed
                            const skillMatches = allMatches.filter((match) => {
                                // Normalize skill names for comparison
                                const normalizeSkill = (s) => s.toLowerCase().replace(/\s+/g, '_');
                                const matchTeachSkill = normalizeSkill(match.skill_i_teach || '');
                                const matchLearnSkill = normalizeSkill(match.skill_i_learn || '');
                                
                                return matchTeachSkill === skillId || matchLearnSkill === skillId;
                            });
                            
                            // Extract unique partners from matched connections
                            const matched = skillMatches.map((match) => ({
                                _id: String(match.partner._id),
                                name: match.partner.name,
                                email: match.partner.email,
                                matchId: String(match._id),
                            }));
                            
                            setMatchedUsers(matched);
                        }
                    } catch (error) {
                        console.error('Error fetching connections:', error);
                        setMatchedUsers([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching skill data:', error);
                // Set a fallback skill object
                const displayTitle = skillId.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                setSkill({
                    id: skillId,
                    title: displayTitle,
                    category: 'General',
                    type: 'unknown',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSkillData();
    }, [skillId, user]);

    const pageStyle = {
        padding: '4rem 2rem',
        backgroundColor: 'var(--background-primary)',
        color: 'var(--text-primary)',
        minHeight: 'calc(100vh - 60px)',
    };

    const contentWrapperStyle = {
        maxWidth: '1400px',
        margin: '0 auto',
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '3rem',
        paddingBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
    };

    const backBtnStyle = {
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--background-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
        fontWeight: 'bold',
        transition: 'all 0.2s ease',
    };

    const titleStyle = {
        flex: 1,
    };

    const skillTitleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
        color: 'var(--text-primary)',
    };

    const skillSubtitleStyle = {
        fontSize: '1.1rem',
        color: 'var(--text-secondary)',
        margin: 0,
    };

    const tabsStyle = {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
    };

    const tabBtnStyle = (isActive) => ({
        padding: '1rem 1.5rem',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: isActive ? '3px solid var(--accent-primary)' : 'none',
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
    });

    const sectionStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border-color)',
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={contentWrapperStyle}>
                    <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</p>
                </div>
            </div>
        );
    }

    if (!skill) {
        return (
            <div style={pageStyle}>
                <div style={contentWrapperStyle}>
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Skill not found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={contentWrapperStyle}>
                <div style={headerStyle}>
                    <button
                        style={backBtnStyle}
                        onClick={() => navigate('/dashboard')}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--background-tertiary)')}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--background-secondary)')}
                    >
                        ← Back
                    </button>
                    <div style={titleStyle}>
                        <h1 style={skillTitleStyle}>{skill.title}</h1>
                        <p style={skillSubtitleStyle}>
                            {skill.type === 'teaching' ? '📚 Teaching' : '🎓 Learning'} •{' '}
                            {skill.category}
                        </p>
                    </div>
                </div>

                <div style={tabsStyle}>
                    <button
                        style={tabBtnStyle(activeTab === 'chat')}
                        onClick={() => setActiveTab('chat')}
                    >
                        💬 Chat
                    </button>
                    <button
                        style={tabBtnStyle(activeTab === 'meetings')}
                        onClick={() => setActiveTab('meetings')}
                    >
                        📅 Meetings
                    </button>
                </div>

                <div style={sectionStyle}>
                    {activeTab === 'chat' && (
                        <ChatSection
                            skillId={skillId}
                            skillTitle={skill.title}
                            matchedUsers={matchedUsers}
                            // report props
                            onOpenReport={(userObj) => { setReportTarget(userObj); setReportReason(''); setReportModalOpen(true); }}
                        />
                    )}
                    {activeTab === 'meetings' && (
                        <MeetingsSection
                            skillId={skillId}
                            skillTitle={skill.title}
                            matchedUsers={matchedUsers}
                        />
                    )}
                </div>
                {/* Report Modal rendered at page level */}
                <ReportModal
                    open={reportModalOpen}
                    target={reportTarget}
                    reason={reportReason}
                    setReason={setReportReason}
                    onClose={() => setReportModalOpen(false)}
                    onSubmit={async () => {
                        if (!reportTarget || !reportReason.trim()) return alert('Please add a reason for the report');
                        setSubmittingReport(true);
                        try {
                            await axios.post('http://localhost:8000/api/v1/disputes', {
                                reportedId: reportTarget._id,
                                matchId: reportTarget.matchId,
                                skill: skill.title,
                                reason: reportReason,
                            }, { withCredentials: true });
                            setReportModalOpen(false);
                            alert('Report submitted. Admin will review it shortly.');
                        } catch (err) {
                            console.error('Failed to submit report', err);
                            alert(err.response?.data?.message || 'Failed to submit report');
                        } finally {
                            setSubmittingReport(false);
                        }
                    }}
                    submitting={submittingReport}
                />
            </div>
        </div>
    );
};

export default SkillDetailPage;
