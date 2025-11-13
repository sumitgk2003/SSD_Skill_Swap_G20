import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BrowseSkillsPage from './pages/BrowseSkillsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateProfilePage from './pages/CreateProfilePage';
import FindMatchesPage from './pages/FindMatchesPage';

// This component provides a consistent layout with a header for all pages.
const AppLayout = () => {
  const containerStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f7ff', // A light, consistent background for the app
  };
  return (
    <div style={containerStyle}>
      <Header />
      <main style={{flexGrow: 1}}>
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

// This is the main component that sets up all the application's routes.
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowseSkillsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        {/* Protected Routes - only accessible when logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="create-profile" element={<CreateProfilePage />} />
          <Route path="find-matches" element={<FindMatchesPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
