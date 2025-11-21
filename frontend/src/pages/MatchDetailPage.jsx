import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import zoomLogo from '../assets/zoom-logo.svg';
import calendarLogo from '../assets/calendar-logo.svg';

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

// Chat Section Component - Single Match (No User List)
const ChatSection = ({ matchId, matchUser, skillTitle }) => {
    const { user } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    // Auto-scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch messages for match
    useEffect(() => {
        if (!matchId) return;

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    'http://localhost:8000/api/v1/messages/get',
                    { matchId: matchId },
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
    }, [matchId]);

    // Socket: connect and listen for incoming messages
    useEffect(() => {
        if (!user) return; // wait for user

        try {
            const userId = user?.id || user?._id;
            const socket = io('http://localhost:8000', {
                query: { userId },
                withCredentials: true,
            });

            socketRef.current = socket;

            // Listen for new messages emitted by the server
            socket.on('newMessage', (newMsg) => {
                try {
                    if (!newMsg) return;
                    // Only append if the message belongs to the current match
                    if (String(newMsg.matchId) === String(matchId)) {
                        setMessages((prev) => [...prev, newMsg]);
                    }
                } catch (err) {
                    console.error('Error handling newMessage socket event', err);
                }
            });

            // optional: listen for online users list
            socket.on('getOnlineUsers', (users) => {
                // you can expose online status in UI if desired
                // console.log('online users:', users);
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.off('newMessage');
                    socketRef.current.off('getOnlineUsers');
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        } catch (err) {
            console.error('Socket connection failed', err);
        }
    }, [user, matchId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !matchId) return;

        try {
            const res = await axios.post(
                'http://localhost:8000/api/v1/messages/send',
                {
                    matchId: matchId,
                    text: messageInput,
                },
                { withCredentials: true }
            );

            if (res.data) {
                setMessages([...messages, res.data]);
                setMessageInput('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const chatContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '650px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--background-secondary)',
        border: '1px solid var(--border-color)',
    };

    const messagesContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background-secondary)',
        overflow: 'hidden',
        padding: 0,
        flex: 1,
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
        boxShadow: '0 4px 12px rgba(89, 146, 241, 0.3)',
    };

    return (
        <div style={chatContainerStyle}>
            <div style={messagesContainerStyle}>
                <>
                    <div style={{ 
                        borderBottom: '1px solid var(--border-color)', 
                        padding: '1.25rem 1.5rem',
                        backgroundColor: 'var(--background-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
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
                            {matchUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '600' }}>
                                {matchUser?.name}
                            </h4>
                            <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {skillTitle}
                            </p>
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
                                                senderName={isOwnMessage ? 'You' : matchUser?.name}
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
            </div>
        </div>
    );
};

// Meetings Section Component (with scheduling)
const MeetingsSection = ({ matchId, matchUser }) => {
    const { user } = useSelector((state) => state.auth);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState('all'); // 'all', 'online', 'inperson'
    const [deleting, setDeleting] = useState(null); // track which meet is being deleted
    const [confirmDialog, setConfirmDialog] = useState({ show: false, meetId: null }); // confirmation dialog state

    // scheduler state
    const [schedulerOpen, setSchedulerOpen] = useState(false);
    const [meetType, setMeetType] = useState('online');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [errors, setErrors] = useState(null);
    const [confirmation, setConfirmation] = useState('');

    const fetchMeetings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/v1/meets', {
                withCredentials: true,
            });
            if (res.data && res.data.success) {
                // Filter meetings by match ID
                const filteredMeetings = res.data.data.filter((meet) => {
                    return String(meet.match) === String(matchId);
                });

                const mapped = filteredMeetings.map((m) => ({
                    id: m._id,
                    title: m.title || (m.meetType ? (m.meetType === 'online' ? 'Online Meeting' : 'In-Person Meeting') : 'Meeting'),
                    host: String(m.organizer._id || m.organizer) === String(user._id) ? 'You' : (m.organizerName || 'Host'),
                    organizer: m.organizer._id || m.organizer,
                    type: m.meetType === 'online' ? 'online' : 'inperson',
                    date: new Date(m.dateAndTime).toISOString().slice(0, 10),
                    time: new Date(m.dateAndTime).toTimeString().slice(0, 5),
                    zoomUrl: m.zoomJoinUrl || null,
                    googleCalendarUrl: m.googleEventHtmlLink || null,
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

    useEffect(() => {
        fetchMeetings();
    }, [matchId, user._id]);

    const handleJoin = (joinUrl) => {
        if (!joinUrl) return;
        window.open(joinUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDeleteMeet = async (meetId) => {
        setConfirmDialog({ show: true, meetId });
    };

    const confirmDeleteMeet = async (meetId) => {
        setConfirmDialog({ show: false, meetId: null });
        setDeleting(meetId);
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/meets/${meetId}`, {
                withCredentials: true,
            });
            if (res.data?.success || res.status === 200) {
                setMeetings((prev) => prev.filter((m) => m.id !== meetId));
                setConfirmation('Meeting cancelled successfully');
                setTimeout(() => setConfirmation(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting meet:', error);
            alert(error.response?.data?.message || 'Failed to cancel meeting');
        } finally {
            setDeleting(null);
        }
    };

    const cancelDeleteMeet = () => {
        setConfirmDialog({ show: false, meetId: null });
    };

    const validateAndBuildPayload = () => {
        setErrors(null);
        if (!date || !time) {
            setErrors('Please select date and time');
            return null;
        }
        const payload = {
            match_id: matchId,
            type: meetType === 'inperson' ? 'in person' : 'online',
            note: title || `${meetType === 'online' ? 'Online' : 'In-Person'} session with ${matchUser?.name}`,
            date,
            time,
            duration,
            with: matchUser ? { id: matchUser._id, name: matchUser.name, email: matchUser.email } : null,
        };
        return payload;
    };

    const handleCreateMeeting = async (e) => {
        e.preventDefault();
        const payload = validateAndBuildPayload();
        if (!payload) return;

        try {
            const res = await axios.post('http://localhost:8000/api/v1/meets', payload, { withCredentials: true });
            if (res.data?.success) {
                setConfirmation('Meeting scheduled successfully');
                setSchedulerOpen(false);
                // reset small form
                setTitle(''); setDate(''); setTime(''); setDuration(30);
                // refresh meetings
                await fetchMeetings();
                setTimeout(() => setConfirmation(''), 5000);
            } else {
                throw new Error(res.data?.message || 'Failed to create meeting');
            }
        } catch (err) {
            console.error('Create meeting failed', err);
            setErrors(err.response?.data?.message || err.message || 'Failed to create meeting');
        }
    };

    const meetingCardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
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

    return (
        <div>
            {/* Confirmation Dialog */}
            {confirmDialog.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'var(--background-secondary)',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        border: '1px solid var(--border-color)',
                    }}>
                        <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>
                            Cancel Meeting?
                        </h2>
                        <p style={{ margin: '0 0 1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Are you sure you want to cancel this meeting? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={cancelDeleteMeet}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    backgroundColor: 'var(--background-primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--background-tertiary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'var(--background-primary)';
                                }}
                            >
                                Keep Meeting
                            </button>
                            <button
                                onClick={() => confirmDeleteMeet(confirmDialog.meetId)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#c82333';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#dc3545';
                                }}
                            >
                                Cancel Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Meetings</h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {confirmation && <div style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{confirmation}</div>}
                    <button
                        style={{ padding: '0.5rem 0.9rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
                        onClick={() => setSchedulerOpen((s) => !s)}
                    >
                        {schedulerOpen ? 'Cancel' : 'Schedule Meet'}
                    </button>
                </div>
            </div>

            {schedulerOpen && (
                <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--background-primary)' }}>
                    {errors && <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{errors}</div>}

                    {/* Header controls similar to MeetsListPage */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="button" onClick={() => setMeetType('online')} style={{ padding: '0.5rem 0.9rem', borderRadius: 10, border: meetType === 'online' ? 'none' : '1px solid var(--border-color)', background: meetType === 'online' ? 'var(--accent-primary)' : 'transparent', color: meetType === 'online' ? '#fff' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>Online</button>
                            <button type="button" onClick={() => setMeetType('inperson')} style={{ padding: '0.5rem 0.9rem', borderRadius: 10, border: meetType === 'inperson' ? 'none' : '1px solid var(--border-color)', background: meetType === 'inperson' ? 'var(--accent-primary)' : 'transparent', color: meetType === 'inperson' ? '#fff' : 'var(--text-primary)', fontWeight: 700, cursor: 'pointer' }}>In person</button>
                        </div>
                        <input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--border-color)', minWidth: 200 }} />
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                            <button type="button" onClick={() => { setDate(''); setTime(''); setDuration(30); setTitle(''); setNote(''); }} style={{ padding: '0.45rem 0.75rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)' }}>Reset</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '0.6rem', borderRadius: 10, border: '1px solid var(--border-color)' }} />
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ padding: '0.6rem', borderRadius: 10, border: '1px solid var(--border-color)' }} />
                        <input type="number" min={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: 140, padding: '0.6rem', borderRadius: 10, border: '1px solid var(--border-color)' }} />
                    </div>

                    {/* Notes and title are treated the same: single Title/Notes input above. */}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                        <button onClick={handleCreateMeeting} style={{ padding: '0.75rem 1rem', borderRadius: 10, border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Create Meet</button>
                    </div>
                </div>
            )}

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilterType('all')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: filterType === 'all' ? 'none' : '1px solid var(--border-color)',
                        backgroundColor: filterType === 'all' ? 'var(--accent-primary)' : 'transparent',
                        color: filterType === 'all' ? '#fff' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterType('online')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: filterType === 'online' ? 'none' : '1px solid var(--border-color)',
                        backgroundColor: filterType === 'online' ? 'var(--accent-primary)' : 'transparent',
                        color: filterType === 'online' ? '#fff' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    🌐 Online
                </button>
                <button
                    onClick={() => setFilterType('inperson')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: filterType === 'inperson' ? 'none' : '1px solid var(--border-color)',
                        backgroundColor: filterType === 'inperson' ? 'var(--accent-primary)' : 'transparent',
                        color: filterType === 'inperson' ? '#fff' : 'var(--text-primary)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    📍 In Person
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading meetings...
                </p>
            ) : meetings.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    No scheduled meetings yet with this contact
                </p>
            ) : (
                <div>
                    {meetings
                        .filter((meeting) => {
                            if (filterType === 'all') return true;
                            if (filterType === 'online') return meeting.type === 'online';
                            if (filterType === 'inperson') return meeting.type === 'inperson';
                            return true;
                        })
                        .map((meeting) => (
                            <div key={meeting.id} style={meetingCardStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={meetingInfoStyle}>
                                        <h4 style={{ ...meetingTitleStyle, marginBottom: '0.75rem', fontWeight: 'bold' }}>{meeting.title}</h4>
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
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexShrink: 0 }}>
                                    {meeting.type === 'online' && (
                                        <>
                                            {meeting.zoomUrl && (
                                                <button
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        padding: 0,
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onClick={() => handleJoin(meeting.zoomUrl)}
                                                    title="Join Zoom Meeting"
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = 'rgba(11, 92, 255, 0.1)';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <img src={zoomLogo} alt="Zoom" style={{ width: '40px', height: '40px' }} />
                                                </button>
                                            )}
                                            {meeting.googleCalendarUrl && (
                                                <button
                                                    style={{
                                                        width: '48px',
                                                        height: '48px',
                                                        padding: 0,
                                                        backgroundColor: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onClick={() => handleJoin(meeting.googleCalendarUrl)}
                                                    title="View Google Calendar Event"
                                                    onMouseEnter={(e) => {
                                                        e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                                                        e.target.style.transform = 'scale(1.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.backgroundColor = 'transparent';
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    <img src={calendarLogo} alt="Calendar" style={{ width: '40px', height: '40px' }} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {meeting.type === 'inperson' && meeting.googleCalendarUrl && (
                                        <button
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                padding: 0,
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => handleJoin(meeting.googleCalendarUrl)}
                                            title="View Calendar Event"
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
                                                e.target.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        >
                                            <img src={calendarLogo} alt="Calendar" style={{ width: '40px', height: '40px' }} />
                                        </button>
                                    )}
                                    {String(meeting.organizer) === String(user?.id || user?._id) && (
                                        <button
                                            style={{
                                                padding: '0.6rem 1.2rem',
                                                backgroundColor: '#dc3545',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                opacity: deleting === meeting.id ? 0.6 : 1,
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => handleDeleteMeet(meeting.id)}
                                            disabled={deleting === meeting.id}
                                            onMouseEnter={(e) => {
                                                if (deleting !== meeting.id) e.target.style.backgroundColor = '#c82333';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#dc3545';
                                            }}
                                        >
                                            {deleting === meeting.id ? 'Canceling...' : 'Cancel'}
                                        </button>
                                    )}
                                </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

// Main MatchDetailPage Component
const MatchDetailPage = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');

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
        const fetchMatchData = async () => {
            setLoading(true);
            try {
                // Fetch the specific match data
                const connectionsRes = await axios.get(
                    'http://localhost:8000/api/v1/users/getConnections',
                    { withCredentials: true }
                );

                if (connectionsRes.data.success) {
                    const allMatches = connectionsRes.data.data || [];
                    const match = allMatches.find((m) => String(m._id) === String(matchId));
                    
                    if (match) {
                        setMatchData(match);
                    } else {
                        console.error('Match not found');
                    }
                }
            } catch (error) {
                console.error('Error fetching match data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (matchId) {
            fetchMatchData();
        }
    }, [matchId, user]);

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

    const matchTitleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: '0 0 0.5rem 0',
        color: 'var(--text-primary)',
    };

    const matchSubtitleStyle = {
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

    if (!matchData) {
        return (
            <div style={pageStyle}>
                <div style={contentWrapperStyle}>
                    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Match not found
                    </p>
                </div>
            </div>
        );
    }

    const skillTitle = matchData.skill_i_teach || matchData.skill_i_learn || 'Unknown Skill';

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
                        <h1 style={matchTitleStyle}>{matchData.partner.name}</h1>
                        <p style={matchSubtitleStyle}>
                            {matchData.skill_i_teach ? '📚 Teaching' : '🎓 Learning'} • {skillTitle}
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
                            matchId={matchId}
                            matchUser={matchData.partner}
                            skillTitle={skillTitle}
                        />
                    )}
                    {activeTab === 'meetings' && (
                        <MeetingsSection
                            matchId={matchId}
                            matchUser={matchData.partner}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDetailPage;
