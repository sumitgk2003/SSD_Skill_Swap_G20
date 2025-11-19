
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
        <h2 style={{ marginBottom: '2rem' }}>Welcome Back!</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" style={inputStyle} required />
          <input type="password" placeholder="Password" style={inputStyle} required />
          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', color: '#555' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#6a5acd', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
