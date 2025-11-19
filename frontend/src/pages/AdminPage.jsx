import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  };

  const headingStyle = {
    color: '#333',
    marginBottom: '20px',
    fontSize: '2em',
  };

  const paragraphStyle = {
    color: '#666',
    marginBottom: '30px',
    lineHeight: '1.6',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    justifyContent: 'center',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 25px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    width: '100%',
  };

  const statCardStyle = {
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const statCardHeadingStyle = {
    color: '#555',
    fontSize: '1.1em',
    marginBottom: '10px',
  };

  const statCardValueStyle = {
    color: '#007bff',
    fontSize: '2.5em',
    fontWeight: 'bold',
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>Admin Dashboard</h1>
        <p style={paragraphStyle}>
          Welcome to the administration panel. From here, you can manage users, skills, and other application settings.
        </p>

        <div style={statsContainerStyle}>
          <div style={statCardStyle}>
            <h3 style={statCardHeadingStyle}>Total Users</h3>
            <p style={statCardValueStyle}>1,234</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={statCardHeadingStyle}>Total Skills</h3>
            <p style={statCardValueStyle}>567</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={statCardHeadingStyle}>Total Matches</h3>
            <p style={statCardValueStyle}>890</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={statCardHeadingStyle}>Disputes</h3>
            <p style={statCardValueStyle}>12</p>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <Link
            to="/admin/users"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Manage Users
          </Link>

          <Link
            to="/admin/skills"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Manage Skills
          </Link>

          <Link
            to="/admin/disputes"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Manage Disputes
          </Link>

          <Link
            to="/admin/policy"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Policy Page
          </Link>

          <Link
            to="/"
            style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
