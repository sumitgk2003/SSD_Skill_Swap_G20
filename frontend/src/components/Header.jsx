import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#6a5acd',
    textDecoration: 'none',
  };

  const navStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#555',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  };
  
  const activeNavLinkStyle = {
    color: '#6a5acd',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center',
  };

  const getNavLinkStyle = ({ isActive }) => 
    isActive ? { ...navLinkStyle, ...activeNavLinkStyle } : navLinkStyle;

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoStyle}>SkillSwap</Link>
      <nav style={navStyle}>
        <NavLink to="/browse" style={getNavLinkStyle}>Browse Skills</NavLink>
        {/* You can add other public links like 'About Us' here */}
      </nav>
      <div>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <NavLink to="/dashboard" style={getNavLinkStyle}>Dashboard</NavLink>
            <NavLink to="/profile" style={getNavLinkStyle}>Profile</NavLink>
            <NavLink to="/find-matches" style={getNavLinkStyle}>Find Matches</NavLink>
            <button 
             onClick={() => dispatch(logout())}
             style={{...buttonStyle, backgroundColor: '#f0eaff', color: '#6a5acd', marginLeft: '1rem'}}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{...buttonStyle, backgroundColor: 'transparent', color: '#6a5acd'}}>Log In</Link>
            <Link to="/signup" style={{...buttonStyle, backgroundColor: '#6a5acd', color: 'white', marginLeft: '1rem'}}>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
