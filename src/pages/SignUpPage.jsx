
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store/authSlice';

const SignUpPage = () => {
  const dispatch = useDispatch();
  
  const handleSignUp = (e) => {
    e.preventDefault(); // Prevents the form from reloading the page
    // In a real app, you'd send user data to your backend here
    dispatch(login()); // Simulate login after successful signup
  };

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
  };

  const formContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6a5acd',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={{ marginBottom: '2rem' }}>Create Your Account</h2>
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Full Name" style={inputStyle} required />
          <input type="email" placeholder="Email Address" style={inputStyle} required />
          <input type="password" placeholder="Password" style={inputStyle} required />
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', color: '#555' }}>
          Already have an account? <Link to="/login" style={{ color: '#6a5acd', fontWeight: 'bold' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
