import React, { useState } from 'react';
// import { MessageSquare, Send, X } from 'lucide-react'; // Removed this import to fix the error

// Mock data now includes messages and profile pictures
const mockMatchesData = [
  { 
    id: 1, 
    name: 'Alice', 
    teaches: 'Creative Writing', 
    learns: 'React', 
    pic: 'https://placehold.co/100x100/6a5acd/FFF?text=A',
    messages: [
      { id: 1, sender: 'Alice', text: 'Hey! I see you want to learn React. I can help!' },
      { id: 2, sender: 'You', text: 'That would be great! I can teach you creative writing in exchange.' },
    ]
  },
  { 
    id: 2, 
    name: 'Bob', 
    teaches: 'Public Speaking', 
    learns: 'Node.js',
    pic: 'https://placehold.co/100x100/5a4bad/FFF?text=B',
    messages: [
      { id: 1, sender: 'Bob', text: 'Hi, interested in learning Node.js?' },
    ]
  },
  { 
    id: 3, 
    name: 'Charlie', 
    teaches: 'Graphic Design', 
    learns: 'Pottery',
    pic: 'https://placehold.co/100x100/4a3ba9/FFF?text=C',
    messages: []
  },
  { 
    id: 4, 
    name: 'Diana', 
    teaches: 'Yoga Instruction', 
    learns: 'Python',
    pic: 'https://placehold.co/100x100/3a2ba5/FFF?text=D',
    messages: [
      { id: 1, sender: 'Diana', text: 'Namaste. Let me know if youd like to start with Python.' },
    ]
  },
  { 
    id: 5, 
    name: 'Eve', 
    teaches: 'Bread Making', 
    learns: 'React',
    pic: 'https://placehold.co/100x100/2a1ba1/FFF?text=E',
    messages: []
  },
];

// --- ChatWindow Component ---
// This component renders the active chat conversation
const ChatWindow = ({ user, onClose, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(user.id, newMessage);
      setNewMessage('');
    }
  };

  if (!user) {
    return (
      <div style={styles.chatPlaceholder}>
        {/* Replaced Lucide icon with an emoji */}
        <span style={{ fontSize: '64px', color: '#ccc' }}>✉️</span>
        <h2 style={{ color: '#777', fontWeight: 500 }}>Select a match to start messaging</h2>
      </div>
    );
  }

  return (
    <div style={styles.chatWindow}>
      {/* Chat Header */}
      <header style={styles.chatHeader}>
        <img src={user.pic} alt={user.name} style={styles.chatHeaderPic} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>{user.name}</h2>
        <button onClick={onClose} style={styles.closeButton}>
          {/* Replaced Lucide icon with an emoji */}
          <span style={{ fontSize: '16px', lineHeight: '1' }}>❌</span>
        </button>
      </header>

      {/* Messages Area */}
      <div style={styles.messagesArea}>
        {user.messages.length === 0 && (
          <div style={styles.noMessages}>
            This is the beginning of your conversation with {user.name}.
          </div>
        )}
        {user.messages.map(msg => (
          <div key={msg.id} style={msg.sender === 'You' ? styles.messageSent : styles.messageReceived}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form style={styles.messageInputForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          style={styles.messageInput}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" style={styles.sendButton}>
          {/* Replaced Lucide icon with an emoji */}
          <span style={{ fontSize: '20px', lineHeight: '1' }}>➡️</span>
        </button>
      </form>
    </div>
  );
};

// --- FindMatchesPage Component ---
// This is the main page component
const FindMatchesPage = () => {
  const [matches, setMatches] = useState(mockMatchesData);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = (userId, text) => {
    const newMessage = {
      id: Date.now(), // simple unique id
      sender: 'You',
      text: text,
    };

    // Update the messages for the specific user
    const updatedMatches = matches.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          messages: [...user.messages, newMessage],
        };
      }
      return user;
    });

    setMatches(updatedMatches);

    // Update the selectedUser state as well to re-render the chat window
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prevUser => ({
        ...prevUser,
        messages: [...prevUser.messages, newMessage],
      }));
    }
  };

  const selectedChatUser = matches.find(user => user.id === selectedUser?.id) || null;

  return (
    <div style={styles.page}>
      {/* Left Column: Match List */}
      <div style={styles.matchListContainer}>
        <h1 style={styles.header}>Your Skill Matches</h1>
        <div style={styles.matchList}>
          {matches.map(match => (
            <div 
              key={match.id} 
              style={selectedUser?.id === match.id ? styles.matchCardSelected : styles.matchCard}
              onClick={() => handleSelectUser(match)}
            >
              <img src={match.pic} alt={match.name} style={styles.matchPic} />
              <div style={styles.matchInfo}>
                <h2 style={styles.name}>{match.name}</h2>
                <p style={styles.skillLine}>
                  <strong>Teaches:</strong> <span style={{ color: '#6a5acd' }}>{match.teaches}</span>
                </p>
                <p style={styles.skillLine}>
                  <strong>Learns:</strong> {match.learns}
                </p>
              </div>
              <button style={styles.messageButton} onClick={() => handleSelectUser(match)}>
                {/* Replaced Lucide icon with an emoji */}
                <span>✉️</span>
                <span>Message</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      <div style={styles.chatContainer}>
        <ChatWindow 
          user={selectedChatUser} 
          onClose={handleCloseChat}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

// --- Styles ---
// Keeping styles in the same file for simplicity
const styles = {
  page: {
    display: 'flex',
    height: 'calc(100vh - 80px)', // Assuming a header height of 80px
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#f7f7f7',
  },
  matchListContainer: {
    width: '400px',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
  },
  matchList: {
    overflowY: 'auto',
    flexGrow: 1,
  },
  matchCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  matchCardSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    backgroundColor: '#f0eefc',
    borderRight: '4px solid #6a5acd',
  },
  matchPic: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  matchInfo: {
    flexGrow: 1,
  },
  name: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    margin: '0 0 0.25rem 0',
  },
  skillLine: {
    fontSize: '0.85rem',
    color: '#555',
    margin: 0,
    lineHeight: 1.4,
  },
  messageButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.8rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6a5acd',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  chatContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  chatPlaceholder: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  chatHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
  },
  chatHeaderPic: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  closeButton: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1, // Added for better emoji alignment
  },
  messagesArea: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '1.5rem',
    backgroundColor: '#f7f7f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#6a5acd',
    color: 'white',
    padding: '0.8rem 1rem',
    borderRadius: '20px 20px 4px 20px',
    maxWidth: '70%',
    lineHeight: 1.4,
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    color: '#333',
    padding: '0.8rem 1rem',
    borderRadius: '20px 20px 20px 4px',
    maxWidth: '70%',
    lineHeight: 1.4,
    border: '1px solid #eee',
  },
  noMessages: {
    textAlign: 'center',
    color: '#888',
    marginTop: '2rem',
    fontSize: '0.9rem',
  },
  messageInputForm: {
    display: 'flex',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #eee',
    backgroundColor: '#fff',
  },
  messageInput: {
    flexGrow: 1,
    border: '1px solid #ddd',
    borderRadius: '20px',
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    outline: 'none',
  },
  sendButton: {
    marginLeft: '1rem',
    border: 'none',
    backgroundColor: '#6a5acd',
    color: 'white',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1, // Added for better emoji alignment
  },
};

export default FindMatchesPage;