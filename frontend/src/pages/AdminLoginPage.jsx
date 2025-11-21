import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    // Send credentials to backend admin login endpoint
    setError(null);
    setLoading(true);
    client
      .post('/admin/login', { email: username, password })
      .then((res) => {
        const data = res?.data;
        if (data && data.success) {
          // Save admin info & access token locally (frontend state or storage)
          try {
            if (data.data?.user) localStorage.setItem('admin', JSON.stringify(data.data.user));
            if (data.data?.accessToken) localStorage.setItem('adminAccessToken', data.data.accessToken);
          } catch (err) {
            // ignore storage errors
          }
          // Redirect to admin dashboard after login
          navigate('/admin/dashboard');
        } else {
          setError(data?.message || 'Login failed');
        }
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err.message || 'Login failed';
        setError(msg);
      })
      .finally(() => setLoading(false));
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
            disabled={loading}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </form>
        <p style={{ marginTop: '20px', color: '#666' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Go back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
