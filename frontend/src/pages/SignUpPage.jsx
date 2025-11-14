
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setSkills, setInterests,setUser } from '../store/authSlice';
const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSignUp = async(e) => {
    e.preventDefault(); 
    try {
      console.log(e.target[0].value, e.target[1].value, e.target[2].value);
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
        dispatch(setUser(res.data.data.user));
        console.log("Login successful:", res);
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
    //dispatch(setUser({ name: 'Logged In User'}));
    dispatch(setSkills(['JavaScript', 'React', 'Node.js']));
    dispatch(setInterests(['Web Development', 'Open Source']));
    navigate('/dashboard'); // Redirect to dashboard after login 
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
