import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { resetAuth } from '../store/authSlice';
import axios from 'axios';
import ThemeToggleButton from './ThemeToggleButton';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'var(--background-primary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--accent-primary)',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  navLink: {
    textDecoration: 'none',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  },
  navLinkActive: {
    color: 'var(--accent-primary)',
    fontWeight: 'bold',
  },
  headerButtons: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'filter 0.2s ease-in-out',
  },
  buttonLogout: {
    backgroundColor: 'var(--accent-primary-light)',
    color: 'var(--accent-primary)',
    marginLeft: '1rem',
  },
  buttonLogin: {
    backgroundColor: 'transparent',
    color: 'var(--accent-primary)',
  },
  buttonSignup: {
    backgroundColor: 'var(--accent-primary)',
    color: 'white',
    marginLeft: '1rem',
  },
};


const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log("Logout successful:", res);
        // clear entire auth slice to initial state
        dispatch(resetAuth());
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getNavLinkStyle = ({ isActive }) => ({
    ...styles.navLink,
    ...(isActive ? styles.navLinkActive : {}),
  });

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>SkillSwap</Link>
      <nav style={styles.nav}>
        {user && <NavLink to="/browse" style={getNavLinkStyle}>Browse Skills</NavLink>}
        {user && <NavLink to="/dashboard" style={getNavLinkStyle}>Dashboard</NavLink>}
        {user && <NavLink to="/profile" style={getNavLinkStyle}>Profile</NavLink>}
        {user && <NavLink to="/find-matches" style={getNavLinkStyle}>Your Matches</NavLink>}
        {user && <NavLink to="/schedule" style={getNavLinkStyle}>Your Meets</NavLink>}
        {user && user.isAdmin && <NavLink to="/admin/users" style={getNavLinkStyle}>Admin Users</NavLink>}
        {user && user.isAdmin && <NavLink to="/admin/skills" style={getNavLinkStyle}>Admin Skills</NavLink>}
        {user && user.isAdmin && <NavLink to="/admin/disputes" style={getNavLinkStyle}>Admin Disputes</NavLink>}
        {user && user.isAdmin && <NavLink to="/admin/policy" style={getNavLinkStyle}>Admin Policy</NavLink>}
        {/* You can add other public links like 'About Us' here */}
      </nav>
      <div style={styles.headerButtons}>
        <ThemeToggleButton />
        {user ? (
          <button 
            onClick={handleLogout}
            style={{ ...styles.button, ...styles.buttonLogout }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.button, ...styles.buttonLogin }}>Log In</Link>
            <Link to="/signup" style={{ ...styles.button, ...styles.buttonSignup }}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;