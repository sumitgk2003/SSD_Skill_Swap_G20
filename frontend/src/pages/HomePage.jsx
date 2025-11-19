import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// --- Reusable Components for this page ---

const HeroGraphic = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDarkMode = theme === 'dark';

  const graphicStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '120%',
    height: '120%',
    transform: 'translate(-50%, -50%)',
    zIndex: -1,
    pointerEvents: 'none',
  };
  
  if (isDarkMode) {
    return (
      <div style={graphicStyle}>
        <svg width="100%" height="100%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: 'rgba(150, 136, 224, 0.2)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(150, 136, 224, 0)', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: 'rgba(106, 90, 205, 0.25)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'rgba(106, 90, 205, 0)', stopOpacity: 1 }} />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="280" stroke="#58428a" strokeWidth="2" fill="none" />
          <ellipse cx="220" cy="200" rx="200" ry="100" fill="url(#grad1)" transform="rotate(-30 220 200)" />
          <ellipse cx="350" cy="380" rx="180" ry="160" fill="url(#grad2)" />
        </svg>
      </div>
    );
  }

  return (
    <div style={graphicStyle}>
      <svg width="100%" height="100%" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        {/* Thin circle outline - drawn first to be in the back */}
        <circle cx="300" cy="300" r="280" stroke="#E0F2F7" strokeWidth="2.5" fill="none" />
        
        {/* Peach/orange shape */}
        <ellipse cx="220" cy="200" rx="200" ry="100" fill="#FDE2D7" transform="rotate(-30 220 200)" />
        
        {/* Teal shape */}
        <ellipse cx="350" cy="380" rx="180" ry="160" fill="#A2D9CE" />
      </svg>
    </div>
  );
};


const CategoryCard = ({ title, image }) => {
  const style = {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '1rem',
    background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent), url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return <div style={style}>{title}</div>;
};

const FeatureItem = ({ icon, title, description }) => {
  const style = {
    marginBottom: '2rem',
    maxWidth: '400px'
  };
  return (
    <div style={style}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
};

// --- Main HomePage Component ---

const HomePage = () => {

  // --- Styles ---
  const pageStyles = {
    container: {
      backgroundColor: 'var(--background-primary)',
      color: 'var(--text-primary)',
    },
    hero: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6rem 5%',
      minHeight: '60vh',
      position: 'relative',
      overflow: 'hidden',
      gap: '4rem',
      flexWrap: 'wrap',
    },
    heroText: {
      position: 'relative',
      textAlign: 'left',
      maxWidth: '600px',
      zIndex: 1,
      flex: '1 1 500px',
    },
    heroTitle: {
      fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
      fontWeight: 'bold',
      lineHeight: 1.2,
      color: 'var(--text-primary)',
      margin: 0,
    },
    signupModule: {
      flex: '0 1 420px',
      padding: '2.5rem',
      borderRadius: '16px',
      backgroundColor: 'var(--background-primary)',
      border: '1px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      textAlign: 'center',
      zIndex: 1,
    },
    signupTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
      marginBottom: '0.75rem',
    },
    signupSubtitle: {
      fontSize: '1rem',
      color: 'var(--text-secondary)',
      marginBottom: '2rem',
    },
    button: {
      display: 'block',
      width: '100%',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
      textDecoration: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s',
    },
    buttonPrimary: {
      backgroundColor: 'var(--accent-primary)',
      color: 'white',
      border: '1px solid var(--accent-primary)',
      marginBottom: '1rem',
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: 'var(--accent-primary)',
      border: '1px solid var(--accent-primary)',
    },
    categories: {
      padding: '4rem 5%',
      backgroundColor: 'var(--background-secondary)',
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '2rem auto 0',
    },
    explore: {
      padding: '4rem 5%',
      backgroundColor: 'var(--background-secondary)',
      color: 'var(--text-primary)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4rem',
      flexWrap: 'wrap',
    },
    exploreContent: {
      textAlign: 'left',
    },
    exploreTitle: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 'bold',
      marginBottom: '2rem',
      color: 'var(--text-primary)',
    },
    exploreImages: {
        position: 'relative',
        width: '400px',
        height: '400px',
    },
    exploreImage: {
        position: 'absolute',
        width: '250px',
        borderRadius: '8px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
    },
    footer: {
      padding: '2rem 5%',
      backgroundColor: 'var(--background-primary)',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      color: 'var(--text-secondary)',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      marginBottom: '1rem',
    },
    footerLink: {
      color: 'var(--text-secondary)',
      textDecoration: 'none',
    }
  };

  return (
    <div style={pageStyles.container}>
      {/* Hero Section */}
      <section style={pageStyles.hero}>
        <div style={pageStyles.heroText}>
          <HeroGraphic />
          <h1 style={pageStyles.heroTitle}>
            Creative Classes<br />Taught by the Best<br />Creative Pros
          </h1>
        </div>
        <div style={pageStyles.signupModule}>
          <h2 style={pageStyles.signupTitle}>Join SkillSwap Today</h2>
          <p style={pageStyles.signupSubtitle}>Start sharing your skills and learning new ones from peers in our community.</p>
          <Link to="/signup" style={{...pageStyles.button, ...pageStyles.buttonPrimary}}>Sign Up</Link>
          <Link to="/login" style={{...pageStyles.button, ...pageStyles.buttonSecondary}}>Sign In</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section style={pageStyles.categories}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', fontWeight: 'bold' }}>Find Your Passion</h2>
        <div style={pageStyles.categoriesGrid}>
          <CategoryCard title="UI/UX Design" image="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070" />
          <CategoryCard title="Productivity" image="https://images.unsplash.com/photo-1531403009284-440989df39f6?q=80&w=2070" />
          <CategoryCard title="Photography" image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964" />
          <CategoryCard title="Fine Art" image="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1972" />
        </div>
      </section>

      {/* Explore Section */}
      <section style={pageStyles.explore}>
        <div style={pageStyles.exploreContent}>
          <h2 style={pageStyles.exploreTitle}>Connect, Learn, and Grow</h2>
          <FeatureItem icon="🤝" title="Find Your Perfect Match" description="Find users who want to learn what you can teach, and teach what you want to learn." />
          <FeatureItem icon="📅" title="Schedule Meets" description="Easily schedule online or in-person sessions to exchange skills with your matches." />
          <FeatureItem icon="🌱" title="Track Your Progress" description="Manage your learning journey, keep track of your meets, and grow your skillset." />
        </div>
        <div style={pageStyles.exploreImages}>
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070" alt="creative work 1" style={{...pageStyles.exploreImage, top: '20px', left: '0', transform: 'rotate(-5deg)'}} />
            <img src="https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?q=80&w=1935" alt="creative work 2" style={{...pageStyles.exploreImage, top: '100px', left: '120px', transform: 'rotate(8deg)', zIndex: 2}} />
            <img src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1983" alt="creative work 3" style={{...pageStyles.exploreImage, top: '220px', left: '40px', transform: 'rotate(-2deg)'}} />
        </div>
      </section>
      
      {/* Footer Section */}
      <footer style={pageStyles.footer}>
        <div style={pageStyles.footerLinks}>
          <a href="#" style={pageStyles.footerLink}>About Us</a>
          <a href="#" style={pageStyles.footerLink}>Terms of Service</a>
          <a href="#" style={pageStyles.footerLink}>Privacy Policy</a>
        </div>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;