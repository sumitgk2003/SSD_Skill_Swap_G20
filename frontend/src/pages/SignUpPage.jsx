
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(''); // State for error messages
  
  const handleSignUp = async(e) => {
    e.preventDefault(); 
    setError(''); // Clear previous errors

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/register`,
        {
          name: e.target[0].value,
          email: e.target[1].value,
          password: e.target[2].value,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // Registration is successful, redirect to login page for the user to log in.
        // The previous implementation incorrectly assumed auto-login.
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError(error.response?.data?.message || "Sign up failed. Please try again.");
    }
  };

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    minHeight: 'calc(100vh - 120px)',
    backgroundColor: 'var(--background-secondary)',
  };

  const formContainerStyle = {
    backgroundColor: 'var(--background-primary)',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  };
  
  const titleStyle = {
    color: 'var(--text-primary)',
    marginBottom: '2rem',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    fontSize: '1rem',
    backgroundColor: 'var(--background-secondary)',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s ease, background-color 0.3s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const bottomTextStyle = {
    marginTop: '1.5rem',
    color: 'var(--text-secondary)',
  };

  const linkStyle = {
    color: 'var(--accent-primary)',
    fontWeight: 'bold',
  };

  const errorStyle = {
    color: '#dc3545',
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    border: '1px solid rgba(220, 53, 69, 0.2)',
    fontWeight: '500'
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Create Your Account</h2>
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Full Name" style={inputStyle} required onChange={() => setError('')}/>
          <input type="email" placeholder="Email Address" style={inputStyle} required onChange={() => setError('')}/>
          <input type="password" placeholder="Password" style={inputStyle} required onChange={() => setError('')}/>
          {error && <p style={errorStyle}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
        <p style={bottomTextStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
