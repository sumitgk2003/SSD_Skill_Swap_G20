import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setBio, setSkills, setInterests } from '../store/authSlice';

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/users/me', { withCredentials: true });
        if (res.data.success) {
          const user = res.data.data.user;
          dispatch(setUser({ name: user.name, email: user.email, id: user._id }));
          dispatch(setBio(user.bio || ''));
          dispatch(setSkills(user.skills || []));
          dispatch(setInterests(user.interests || []));
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching current user after OAuth:', err);
        navigate('/login');
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Signing you in…</h2>
      <p>If you are not redirected, <a href="/login">click here</a>.</p>
    </div>
  );
};

export default AuthSuccess;
