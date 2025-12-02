import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const pillColors = [
    { bg: '#FDE68A', text: '#92400E' }, // Yellow
    { bg: '#A7F3D0', text: '#065F46' }, // Green
    { bg: '#BFDBFE', text: '#1E40AF' }, // Blue
    { bg: '#FBCFE8', text: '#9D266B' }, // Pink
];

// --- COACH CARD COMPONENT (Unchanged) ---
const CoachCard = ({ coach, onBook }) => {
    const navigate = useNavigate();
    const pillColor = pillColors[coach.id.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #F59E0B',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
    };
    
    const [hovered, setHovered] = useState(false);
    const dynamicCardStyle = {
        ...cardStyle,
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(245, 158, 11, 0.15)' : 'var(--card-shadow)',
    }

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const bookButtonStyle = {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        backgroundColor: '#F59E0B',
        color: 'white',
        border: 'none',
        transition: 'all 0.2s ease-in-out',
    };

    const premiumBadgeStyle = {
        position: 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: '#FDE68A',
        color: '#92400E',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const rateStyle = {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        marginTop: 'auto',
    };

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/coach/${coach.id}`)}
        >
            <div style={premiumBadgeStyle}>Premium Coach</div>
            
            <div>
                <span style={pillStyle}>{coach.expertise}</span>
            </div>
            
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{coach.name}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#F59E0B', fontSize: '1rem' }}>★</span>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{coach.rating.toFixed(1)}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({coach.reviewCount} reviews)</span>
            </div>

            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {coach.bio}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={rateStyle}>${coach.rate}/hr</span>
            </div>

            <button 
                style={bookButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onBook(coach);
                }}
            >
                Book Session
            </button>
        </div>
    );
};


// --- USER CARD COMPONENT (Unchanged) ---
const UserCard = ({ user, onConnect, connectionStatus }) => {
    const navigate = useNavigate();
    const interest = user.matchedInterest;
    const pillColor = pillColors[user.user_id.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        cursor: 'pointer',
    };
    
    const [hovered, setHovered] = useState(false);
    const dynamicCardStyle = {
        ...cardStyle,
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(0,0,0,0.2)' : 'var(--card-shadow)',
    }

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const connectButtonStyle = {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        backgroundColor: connectionStatus === 'requested' ? 'var(--background-secondary)' : 'var(--accent-primary)',
        color: connectionStatus === 'requested' ? 'var(--text-secondary)' : 'white',
        border: connectionStatus === 'requested' ? '1px solid var(--border-color)' : 'none',
        transition: 'all 0.2s ease-in-out',
    };

    const handleCardClick = () => {
        navigate(`/user/${user.user_id}`);
    };

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            <div>
                <span style={pillStyle}>{interest}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.name}</h3>
            
            {user.avgRating != null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: '#ffc107', fontSize: '1rem' }}>★</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{user.avgRating.toFixed(1)}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({user.reviewCount} reviews)</span>
                </div>
            ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                    No ratings yet
                </div>
            )}

            <p style={{ margin: 0, color: 'var(--text-secondary)', flexGrow: 1 }}>This user can teach you {interest} and is interested in learning one of your skills.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span>Wants to learn: {user.skills_they_want.join(', ')}</span>
            </div>
            <button 
                style={connectButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onConnect(user);
                }}
                disabled={connectionStatus === 'requested'}
            >
                {connectionStatus === 'requested' ? 'Requested' : 'Connect'}
            </button>
        </div>
    );
};


// --- NEW CATEGORY MATCH CARD COMPONENT (Modified UserCard for Category matches) ---
const CategoryMatchCard = ({ user, onConnect, connectionStatus, category }) => {
    const navigate = useNavigate();
    const pillColor = pillColors[user.user_id.charCodeAt(0) % pillColors.length];

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        cursor: 'pointer',
    };
    
    const [hovered, setHovered] = useState(false);
    const dynamicCardStyle = {
        ...cardStyle,
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 12px 24px rgba(0,0,0,0.2)' : 'var(--card-shadow)',
    }

    const pillStyle = {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: 'bold',
        backgroundColor: pillColor.bg,
        color: pillColor.text,
    };
    
    const connectButtonStyle = {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
        width: '100%',
        marginTop: '1rem',
        fontSize: '1rem',
        backgroundColor: connectionStatus === 'requested' ? 'var(--background-secondary)' : 'var(--accent-primary)',
        color: connectionStatus === 'requested' ? 'var(--text-secondary)' : 'white',
        border: connectionStatus === 'requested' ? '1px solid var(--border-color)' : 'none',
        transition: 'all 0.2s ease-in-out',
    };

    const handleCardClick = () => {
        navigate(`/user/${user.user_id}`);
    };

    // The skill they teach in this category is the first one in the list for display
    const skillToTeach = user.skills_they_teach_in_category?.[0];
    const skillTheyWant = user.skills_they_want_from_you?.[0];

    return (
        <div 
            style={dynamicCardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            <div>
                <span style={pillStyle}>{skillToTeach || category}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{user.name}</h3>
            
            {/* Rating part removed as the API doesn't provide it */}
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                Peer Match in {category}
            </div>

            <p style={{ margin: 0, color: 'var(--text-secondary)', flexGrow: 1 }}>
                This user can teach you {skillToTeach} and wants to learn {skillTheyWant} from you.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <span>Wants to learn: {user.skills_they_want_from_you.join(', ')}</span>
            </div>
            <button 
                style={connectButtonStyle}
                onClick={(e) => {
                    e.stopPropagation();
                    onConnect(user);
                }}
                disabled={connectionStatus === 'requested'}
            >
                {connectionStatus === 'requested' ? 'Requested' : 'Connect'}
            </button>
        </div>
    );
};


// --- SKILL CATEGORY CARD COMPONENT (Modified for Category View) ---
const SkillCategoryCard = ({ category }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const cardStyle = {
        backgroundColor: 'var(--background-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--border-color)',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 8px 16px rgba(0,0,0,0.1)' : 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%', // Ensure cards take up equal height in grid
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem'
    };

    const iconStyle = {
        fontSize: '1.5rem',
        padding: '0.5rem',
        borderRadius: '8px',
        backgroundColor: 'var(--background-tertiary)',
        color: 'var(--accent-primary)',
    };

    const pillContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: 'auto', // Push pills to the bottom
    };

    const simplePillStyle = {
        backgroundColor: 'var(--background-primary)',
        color: 'var(--text-secondary)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        border: '1px solid var(--border-color)',
    };

    const handleCardClick = () => {
        // When a category card is clicked, navigate to the category view
        // The parent component will handle setting the activeCategoryTab
        // For now, we can just log or trigger an event if needed.
        console.log(`Clicked on category: ${category.name}`);
    };

    return (
        <div 
            style={cardStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
        >
            <div style={headerStyle}>
                <span style={iconStyle}>{category.icon}</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {category.name}
                </h3>
            </div>
            <div style={pillContainerStyle}>
                {category.skills && category.skills.length > 0 ? (
                    category.skills.slice(0, 3).map((skill, idx) => ( // Display only a few skills
                        <span key={idx} style={simplePillStyle}>{skill}</span>
                    ))
                ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Browse skills in this category...
                    </span>
                )}
                {category.skills && category.skills.length > 3 && (
                    <span style={simplePillStyle}>+{category.skills.length - 3} more</span>
                )}
            </div>
        </div>
    );
};


const BrowseSkillsPage = () => {
    const { interests: userInterests } = useSelector((state) => state.auth);
    const [requestedUsers, setRequestedUsers] = useState(new Set());
    const [matches, setMatches] = useState([]); // Matches for Peers view
    const [coaches, setCoaches] = useState([]); // Coaches for Coaches view
    const [viewMode, setViewMode] = useState('peers'); 
    
    // Updated state for Category View
    const [activeCategoryTab, setActiveCategoryTab] = useState('All'); 
    const [skillDirectory, setSkillDirectory] = useState([]); // Categories directory
    const [categoryMatches, setCategoryMatches] = useState([]); // NEW: Matches for Category view
    
    const [loading, setLoading] = useState(false);
    const [activeInterest, setActiveInterest] = useState('All');
    const interestsForFilter = useMemo(() => ['All', ...userInterests], [userInterests]);
    
    // Helper to assign icons based on category name
    const getCategoryIcon = (categoryName) => {
        const map = {
            'art': '🎨',
            'computer science': '💻',
            'craft': '🧶',
            'language': '🌍',
            'music': '🎵',
            'sport': '⚽',
            'technology': '💻',
            'business': '💼',
            'lifestyle': '🧘'
        };
        return map[categoryName.toLowerCase()] || '📂';
    };

    // 1. Fetch Categories from Backend (Modified to include 'All')
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch categories from the backend
                const res = await axios.get(
                    'http://localhost:8000/api/v1/users/getAllCategory',
                    { withCredentials: true }
                );
                
                if (res.data.success && Array.isArray(res.data.data)) {
                    // Map the fetched categories and add icons
                    const categories = res.data.data.map(catName => ({
                        name: catName, 
                        icon: getCategoryIcon(catName),
                        skills: [] // Skills will be fetched/displayed when a category is selected
                    }));
                    setSkillDirectory(categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error, e.g., set an error state or show a message
            }
        };

        fetchCategories();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Compute category names for tabs based on fetched data, including 'All'
    const categoryNames = useMemo(() => [ ...skillDirectory.map(cat => cat.name)], [skillDirectory]);


    // 2. Fetch Category Matches from Backend (New Logic)
    const fetchCategoryMatches = async (category) => {
        setLoading(true);
        try {
            if (category === 'All') {
                // If 'All' is selected, we don't fetch specific matches, 
                // but rather display the category cards themselves.
                setCategoryMatches([]); 
                setLoading(false);
                return;
            }

            // Fetch matches for the selected category
            const res = await axios.post(
                'http://localhost:8000/api/v1/users/getCategoryMatches',
                { category }, // Send the selected category to the backend
                { withCredentials: true }
            );

            if (res.data.success) {
                setCategoryMatches(res.data.data); // Update state with fetched matches
            } else {
                setCategoryMatches([]); // Clear matches if response indicates failure
            }
        } catch (error) {
            console.error(`Error fetching category matches for ${category}:`, error);
            setCategoryMatches([]); // Clear matches on error
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // Effect to trigger category match fetching when viewMode or activeCategoryTab changes
    useEffect(() => {
        if (viewMode === 'categories' && activeCategoryTab) {
            fetchCategoryMatches(activeCategoryTab);
        }
    }, [viewMode, activeCategoryTab]); // Re-run when view mode or category tab changes


    // Mock Data generator for coaches (Unchanged)
    useEffect(() => {
        const generateCoaches = () => {
            const skillsToGenerate = activeInterest === 'All' ? userInterests : [activeInterest];
            if(!skillsToGenerate.length) return [];

            const mockNames = ['Sarah Jenkins', 'Mike Chen', 'Elena Rodriguez', 'David Kim', 'Anita Roy', 'James Wilson'];
            
            return mockNames.map((name, index) => {
                const skill = skillsToGenerate[index % skillsToGenerate.length];
                return {
                    id: `coach-${index}`,
                    name: name,
                    expertise: skill || 'General Mentorship',
                    rating: 4.5 + (Math.random() * 0.5),
                    reviewCount: Math.floor(Math.random() * 100) + 20,
                    rate: Math.floor(Math.random() * 50) + 30, 
                    bio: `Certified professional in ${skill || 'mentorship'} with over ${Math.floor(Math.random() * 10) + 3} years of experience helping students achieve their goals.`
                };
            });
        };

        if (viewMode === 'coaches') {
            setCoaches(generateCoaches());
        }
    }, [activeInterest, userInterests, viewMode]);


    const fetchMatchesForInterest = async (interest) => {
        setLoading(true);
        // ... (API call for peer matches - Unchanged)
        try {
            const res = await axios.post(
                'http://localhost:8000/api/v1/users/getMatches',
                { interest },
                { withCredentials: true }
            );
            if (res.data.success) {
                const matchesWithInterest = res.data.data.map(match => ({ ...match, matchedInterest: interest }));
                setMatches(matchesWithInterest);
            } else {
                setMatches([]);
            }
        } catch (error) {
            console.error(`Error fetching matches for ${interest}:`, error);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllMatches = async () => {
        // ... (API call for all peer matches - Unchanged)
        if (!userInterests || userInterests.length === 0) {
            setMatches([]);
            return;
        }
        setLoading(true);
        try {
            const allMatchesPromises = userInterests.map(interest =>
                axios.post(
                    'http://localhost:8000/api/v1/users/getMatches',
                    { interest },
                    { withCredentials: true }
                ).then(res => {
                    if (res.data.success) {
                        return res.data.data.map(match => ({ ...match, matchedInterest: interest }));
                    }
                    return [];
                })
            );

            const results = await Promise.all(allMatchesPromises);
            const flattenedMatches = results.flat();

            const uniqueMatches = new Map();
            flattenedMatches.forEach(match => {
                if (!uniqueMatches.has(match.user_id)) {
                    uniqueMatches.set(match.user_id, match);
                }
            });

            setMatches(Array.from(uniqueMatches.values()));
        } catch (error) {
            console.error("Error fetching all matches:", error);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Effect to trigger peer match fetching when viewMode or activeInterest changes
    useEffect(() => {
        if (viewMode === 'peers') {
            if (activeInterest === 'All') {
                fetchAllMatches();
            } else if (activeInterest) {
                fetchMatchesForInterest(activeInterest);
            }
        }
    }, [activeInterest, userInterests, viewMode]); // Re-run when active interest, user interests, or view mode changes


    const handleConnect = async (userToConnect) => {
        // Determine the skill the user wants to learn and the skill they teach
        let teachSkill = '';
        let learnSkill = '';

        if (viewMode === 'peers') {
            // Logic for 'peers' view (UserCard)
            if (!userToConnect.skills_they_want || userToConnect.skills_they_want.length === 0) {
                console.error("Cannot connect: No matching skills they want.");
                return;
            }
            learnSkill = userToConnect.matchedInterest;
            teachSkill = userToConnect.skills_they_want[0]; 

        } else if (viewMode === 'categories') {
            // Logic for 'categories' view (CategoryMatchCard)
            if (!userToConnect.skills_they_want_from_you || userToConnect.skills_they_want_from_you.length === 0) {
                console.error("Cannot connect: No matching skills they want.");
                return;
            }
            learnSkill = userToConnect.skills_they_teach_in_category[0]; // The skill *they* teach is what *you* learn
            teachSkill = userToConnect.skills_they_want_from_you[0]; // The skill *they* want is what *you* teach
        }

        try {
            await axios.post(
                'http://localhost:8000/api/v1/users/sendRequest',
                {
                    recipientId: userToConnect.user_id,
                    learnSkill: learnSkill,
                    teachSkill: teachSkill,
                },
                { withCredentials: true }
            );
            setRequestedUsers(prev => new Set(prev).add(userToConnect.user_id));
        } catch (error) {
            console.error("Error sending connection request:", error);
            alert(error.response?.data?.message || 'Failed to send request.');
        }
    };
        
    const handleBookCoach = (coach) => {
        alert(`Booking functionality for ${coach.name} ($${coach.rate}/hr) coming soon!`);
    };
    try {
        // Ask how many hours the requester needs to learn this skill
        const hoursInput = window.prompt('How many hours do you want to learn this skill? (enter a number)', '1');
        const requestedHours = hoursInput ? Number(hoursInput) : null;
        await axios.post(
            'http://localhost:8000/api/v1/users/sendRequest',
            {
                recipientId: userToConnect.user_id,
                learnSkill: userToConnect.matchedInterest,
                teachSkill: userToConnect.skills_they_want[0],
                requestedHours: Number.isFinite(requestedHours) && requestedHours > 0 ? requestedHours : undefined,
            },
            { withCredentials: true }
        );
        setRequestedUsers(prev => new Set(prev).add(userToConnect.user_id));
    } catch (error) {
        console.error("Error sending connection request:", error);
        alert(error.response?.data?.message || 'Failed to send request.');
    }
  };
  
  const handleBookCoach = (coach) => {
      // Placeholder for booking logic
      alert(`Booking functionality for ${coach.name} ($${coach.rate}/hr) coming soon!`);
  };

    const getConnectionStatus = (userId) => {
        return requestedUsers.has(userId) ? 'requested' : 'none';
    };

    const pageStyle = {
        padding: '4rem 2rem',
        backgroundColor: 'var(--background-primary)',
        color: 'var(--text-primary)',
        minHeight: 'calc(100vh - 60px)',
    };

    const contentWrapperStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
    };

    const mainHeadlineStyle = {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 'bold',
        marginBottom: '1rem',
    };

    const toggleContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        backgroundColor: 'var(--background-secondary)',
        padding: '0.25rem',
        borderRadius: '9999px',
        width: 'fit-content',
        margin: '0 auto 2rem auto',
        border: '1px solid var(--border-color)',
        gap: '0.25rem'
    };

    const toggleButtonStyle = (isActive) => ({
        padding: '0.5rem 1.5rem',
        borderRadius: '9999px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
        color: isActive ? 'var(--background-primary)' : 'var(--text-secondary)',
        transition: 'all 0.2s ease',
    });

    const interestFilterContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '3rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
    };

    const interestFilterButtonStyle = (isActive) => ({
        padding: '0.75rem 1.5rem',
        border: '1px solid transparent',
        borderRadius: '30px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--background-secondary)',
        color: isActive ? 'white' : 'var(--text-primary)',
        transition: 'all 0.2s ease',
        borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
    });
    
    const subTabContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
    };

    const subTabButtonStyle = (isActive) => ({
        padding: '0.5rem 1rem',
        border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'var(--background-secondary)', 
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        textTransform: 'capitalize', 
        transition: 'all 0.2s ease',
    });

    const usersGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    };

    return (
        <div style={pageStyle}>
            <div style={contentWrapperStyle}>
                <h1 style={mainHeadlineStyle}>Find Your Skill Swap Partner</h1>
                
                {/* Main View Mode Toggle */}
                <div style={toggleContainerStyle}>
                    <button 
                        style={toggleButtonStyle(viewMode === 'peers')}
                        onClick={() => setViewMode('peers')}
                    >
                        Find Peers (Barter)
                    </button>
                    <button 
                        style={toggleButtonStyle(viewMode === 'coaches')}
                        onClick={() => setViewMode('coaches')}
                    >
                        Find Coaches (Premium)
                    </button>
                    <button 
                        style={toggleButtonStyle(viewMode === 'categories')}
                        onClick={() => setViewMode('categories')}
                    >
                        Browse Categories
                    </button>
                </div>

                {/* 1. FILTER FOR PEERS/COACHES (Hidden if in Category view) */}
                {viewMode !== 'categories' && (
                    <div style={interestFilterContainerStyle}>
                        {userInterests.length > 0 ? (
                            interestsForFilter.map(interest => (
                                <button
                                    key={interest}
                                    style={interestFilterButtonStyle(activeInterest === interest)}
                                    onClick={() => setActiveInterest(interest)}
                                >
                                    {interest}
                                </button>
                            ))
                        ) : (
                            <p style={{color: 'var(--text-secondary)'}}>Add some interests to your profile to see tailored matches!</p>
                        )}
                    </div>
                )}

                {/* 2. SUB-TABS FOR CATEGORIES (Only shown in Category view) */}
                {viewMode === 'categories' && (
                    <div style={subTabContainerStyle}>
                             {categoryNames.map(catName => (
                                 <button
                                     key={catName}
                                     style={subTabButtonStyle(activeCategoryTab === catName)}
                                     onClick={() => setActiveCategoryTab(catName)}
                                 >
                                     {catName}
                                 </button>
                             ))}
                    </div>
                )}

                {/* --- CONTENT AREA --- */}

                {/* PEER VIEW */}
                {viewMode === 'peers' && (
                    loading ? <p>Finding reciprocal matches...</p> : (
                        <>
                            <div style={usersGridStyle}>
                            {matches.map(user => (
                                <UserCard 
                                    key={user.user_id} 
                                    user={user}
                                    onConnect={handleConnect}
                                    connectionStatus={getConnectionStatus(user.user_id)}
                                />
                            ))}
                            </div>
                            {!loading && matches.length === 0 && (
                            <p>
                                {activeInterest === 'All'
                                ? 'No potential matches found across all your interests.'
                                : `No reciprocal matches found for "${activeInterest}". Try another skill!`}
                            </p>
                            )}
                        </>
                    )
                )}

                {/* COACH VIEW */}
                {viewMode === 'coaches' && (
                    <div style={usersGridStyle}>
                        {coaches.length > 0 ? (
                            coaches.map(coach => (
                                <CoachCard 
                                    key={coach.id}
                                    coach={coach}
                                    onBook={handleBookCoach}
                                />
                            ))
                        ) : (
                            <p style={{ gridColumn: '1/-1' }}>No coaches found for this skill.</p>
                        )}
                    </div>
                )}

                {/* CATEGORY VIEW */}
                {viewMode === 'categories' && (
                    <div>
                        <div style={usersGridStyle}>
                            {categoryMatches.length > 0 ? (
                                categoryMatches.map(user => (
                                    <CategoryMatchCard
                                        key={user.user_id}
                                        user={user}
                                        onConnect={handleConnect}
                                        connectionStatus={getConnectionStatus(user.user_id)}
                                        category={activeCategoryTab}
                                        />
                                    ))
                            ) : (
                                <p style={{ gridColumn: '1/-1' }}>
                                    No peer matches found in the category {activeCategoryTab}.
                                </p>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BrowseSkillsPage;
