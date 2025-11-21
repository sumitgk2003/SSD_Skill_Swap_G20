import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
    page: {
        padding: '2rem',
        backgroundColor: 'var(--background-secondary)',
        minHeight: 'calc(100vh - 100px)',
    },
    card: {
        maxWidth: '900px',
        margin: '2rem auto',
        backgroundColor: 'var(--background-primary)',
        borderRadius: '16px',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border-color)',
        padding: '2rem 3rem',
    },
    topSection: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '2rem',
        marginBottom: '2rem',
    },
    avatar: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-primary-light)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '4rem',
        fontWeight: 'bold',
        color: 'var(--accent-primary)',
        flexShrink: 0,
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    name: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        margin: 0,
        color: 'var(--text-primary)',
    },
    bio: {
        color: 'var(--text-secondary)',
        fontSize: '1.1rem',
        margin: '0 0 1rem 0',
        maxWidth: '600px',
    },
    skillsSection: {
        marginTop: '2rem',
    },
    skillsTitle: {
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        fontWeight: 'bold',
    },
    skillTagsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
    },
    skillTag: {
        display: 'inline-block',
        backgroundColor: 'var(--accent-primary-light)',
        color: 'var(--accent-primary)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontWeight: 500,
    },
    noSkillsText: {
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
    },
    backButton: {
      padding: '0.6rem 1.2rem',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      backgroundColor: 'var(--background-secondary)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.2s, color 0.2s',
      marginBottom: '2rem'
    },
    reviewCard: {
      background: 'var(--background-secondary)', 
      padding: '1rem', 
      borderRadius: 8, 
      border: '1px solid var(--border-color)',
      marginBottom: '1rem'
    }
};

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userId) {
            setError('User ID is missing.');
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            setError('');
            try {
                const [profileRes, reviewsRes, avgRatingRes] = await Promise.all([
                    axios.get(`http://localhost:8000/api/v1/users/profile/${userId}`, { withCredentials: true }),
                    axios.get(`http://localhost:8000/api/v1/reviews/${userId}`, { withCredentials: true }),
                    axios.get(`http://localhost:8000/api/v1/reviews/${userId}/average`, { withCredentials: true })
                ]);

                if (profileRes.data.success) {
                    setUserData(profileRes.data.data);
                } else {
                    throw new Error(profileRes.data.message || 'Failed to fetch user profile.');
                }

                if (reviewsRes.data.success) {
                    setReviews(reviewsRes.data.data);
                }

                if (avgRatingRes.data.success) {
                    setAvgRating(avgRatingRes.data.data);
                }

            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.response?.data?.message || err.message || 'Could not load user profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [userId]);

    if (loading) {
        return <div style={styles.page}><p style={{textAlign: 'center'}}>Loading profile...</p></div>
    }
    
    if (error) {
        return <div style={styles.page}><p style={{textAlign: 'center', color: 'red'}}>{error}</p></div>
    }

    if (!userData) {
        return <div style={styles.page}><p style={{textAlign: 'center'}}>User not found.</p></div>
    }

    return (
        <div style={styles.page}>
            <div style={{maxWidth: '900px', margin: '0 auto'}}>
                <button style={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
            </div>
            <div style={styles.card}>
                <div style={styles.topSection}>
                    <div style={styles.avatar}>{(userData.name || "U").charAt(0)}</div>
                    <div style={styles.info}>
                        <h1 style={styles.name}>{userData.name}</h1>
                        <p style={styles.bio}>{userData.bio || 'This user has not added a bio yet.'}</p>
                        {avgRating && (
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                ⭐ {avgRating.avg !== null ? `${avgRating.avg.toFixed(1)} average rating` : 'No ratings yet'} ({avgRating.count} reviews)
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.skillsSection}>
                    <h2 style={styles.skillsTitle}>Skills They Can Teach</h2>
                    <div style={styles.skillTagsContainer}>
                        {userData.skills && userData.skills.length > 0 ? (
                            userData.skills.map((skill, index) => (
                                <span key={index} style={styles.skillTag}>{skill}</span>
                            ))
                        ) : (
                            <p style={styles.noSkillsText}>This user hasn't listed any skills to teach.</p>
                        )}
                    </div>
                </div>

                <div style={styles.skillsSection}>
                    <h2 style={styles.skillsTitle}>Skills They Want To Learn</h2>
                    <div style={styles.skillTagsContainer}>
                        {userData.interests && userData.interests.length > 0 ? (
                            userData.interests.map((interest, index) => (
                                <span key={index} style={styles.skillTag}>{interest}</span>
                            ))
                        ) : (
                            <p style={styles.noSkillsText}>This user hasn't listed any skills they want to learn.</p>
                        )}
                    </div>
                </div>

                <div style={styles.skillsSection}>
                    <h2 style={styles.skillsTitle}>Recent Reviews</h2>
                    {reviews && reviews.length > 0 ? (
                        <div>
                            {reviews.map(review => (
                                <div key={review._id} style={styles.reviewCard}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                        <strong style={{color: 'var(--text-primary)'}}>{review.fromUser?.name || 'Anonymous'}</strong>
                                        <span style={{fontWeight: 'bold', color: 'var(--accent-primary)'}}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                                    </div>
                                    <p style={{margin: 0, color: 'var(--text-secondary)'}}>{review.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.noSkillsText}>This user has not received any reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
