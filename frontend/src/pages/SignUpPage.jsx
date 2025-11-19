
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
        <h2 style={titleStyle}>Create Your Account</h2>
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Full Name" style={inputStyle} required />
          <input type="email" placeholder="Email Address" style={inputStyle} required />
          <input type="password" placeholder="Password" style={inputStyle} required />
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
