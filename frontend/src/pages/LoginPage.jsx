
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { setSkills, setUser,setInterests,setBio } from '../store/authSlice'; // Import setUser action
import axios from 'axios';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      console.log(e.target[0].value, e.target[1].value);
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/login`,
        {
          email: e.target[0].value,
          password: e.target[1].value,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const user = {
          name: res.data.data.user.name,
          email: res.data.data.user.email,
          id: res.data.data.user._id,
        };
        console.log("Login successful:", res);
        dispatch(setUser(user));
        dispatch(setBio(res.data.data.user.bio || ""));
        dispatch(setSkills(res.data.data.user.skills || []));
        dispatch(setInterests(res.data.data.user.interests || []));
        navigate("/dashboard");
        //toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      //toast.error(
        //error.response?.data?.message || "Login failed. Please try again."
      //);
    } finally {
      //dispatch(setLoading(false));
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

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" style={inputStyle} required />
          <input type="password" placeholder="Password" style={inputStyle} required />
          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
        <p style={bottomTextStyle}>
          Don't have an account? <Link to="/signup" style={linkStyle}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
