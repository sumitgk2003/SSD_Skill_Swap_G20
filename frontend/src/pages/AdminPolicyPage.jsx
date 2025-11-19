import React from 'react';

const AdminPolicyPage = () => {
  return (
    <div className="admin-policy-page p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Policy Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Terms of Service</h2>
        <p className="text-gray-600 mb-4">
          Welcome to SkillSwap! These Terms of Service ("Terms") govern your access to and use of the SkillSwap website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">1. Acceptance of Terms</h3>
        <p className="text-gray-600 mb-4">
          By creating an account, accessing, or using the Service, you signify that you have read, understood, and agree to be bound by these Terms, whether or not you are a registered user of our Service. If you do not agree with these Terms, you must not use the Service.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">2. Changes to Terms</h3>
        <p className="text-gray-600 mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">3. User Accounts</h3>
        <p className="text-gray-600 mb-4">
          You must be at least 18 years old to use the Service. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-8">Privacy Policy</h2>
        <p className="text-gray-600 mb-4">
          Your privacy is important to us. This Privacy Policy explains how SkillSwap collects, uses, and discloses information about you.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">1. Information We Collect</h3>
        <p className="text-gray-600 mb-4">
          We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users. This may include your name, email address, skills, interests, and any other information you choose to provide.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">2. How We Use Your Information</h3>
        <p className="text-gray-600 mb-4">
          We use the information we collect to provide, maintain, and improve our Service, such as to facilitate skill exchanges, personalize your experience, and communicate with you.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">3. Sharing of Information</h3>
        <p className="text-gray-600 mb-4">
          We may share information about you with third parties for various purposes, including to provide and improve our Service, for marketing, and for legal reasons. We do not sell your personal information to third parties.
        </p>
      </div>
    </div>
  );
};

export default AdminPolicyPage;