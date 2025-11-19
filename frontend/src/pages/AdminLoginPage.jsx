import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  };

  const headingStyle = {
    color: '#333',
    marginBottom: '20px',
    fontSize: '2em',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1em',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle authentication here.
    // For this task, we are only creating the UI.
    console.log('Admin Login Attempt:', { username, password });
    alert('Login logic not implemented. This is a UI-only demonstration.');
    // On successful login, you would typically redirect to /admin/dashboard
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Admin Login</h1>
        <form style={formStyle} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            style={inputStyle}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: '20px', color: '#666' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Go back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
