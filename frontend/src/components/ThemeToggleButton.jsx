import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

const ThemeToggleButton = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  const buttonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--background-secondary)',
    color: 'var(--text-primary)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: 'none',
    zIndex: 1000,
    fontSize: '20px',
    transition: 'transform 0.2s ease-in-out, background-color 0.3s ease, color 0.3s ease',
    marginRight: '1rem',
  };

  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={() => dispatch(toggleTheme())} 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggleButton;