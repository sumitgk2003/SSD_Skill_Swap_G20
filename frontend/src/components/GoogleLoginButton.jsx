import React from 'react';
import axios from 'axios';

const GoogleLoginButton = ({ className, children }) => {
  const handleClick = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/auth/google/login-url', { withCredentials: true });
      const authUrl = res.data.data?.authUrl;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        console.error('No authUrl returned from server');
      }
    } catch (err) {
      console.error('Failed to get Google login URL', err);
    }
  };

  return (
    <button onClick={handleClick} className={className} style={{
      width: '100%',
      padding: '0.9rem',
      borderRadius: 8,
      border: '1px solid #ddd',
      background: '#fff',
      color: '#333',
      fontWeight: 700,
      cursor: 'pointer',
      marginTop: '1rem'
    }}>
      {children || 'Continue with Google'}
    </button>
  );
};

export default GoogleLoginButton;
