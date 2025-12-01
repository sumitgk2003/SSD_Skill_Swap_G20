import React from 'react';

const AdminPolicyPage = () => {
  return (
    <div style={{ padding: 36, minHeight: '100vh', background: '#f4f7fb', fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
  <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 18px' }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 26, color: '#0f1724' }}>Policy</h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Site Terms of Service and Privacy Policy</p>
        </header>

        <article style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 10px 30px rgba(2,6,23,0.06)', color: '#111827' }}>
          <section style={{ marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 18, color: '#0f1724' }}>Terms of Service</h2>
            <p style={{ color: '#374151', lineHeight: 1.6, marginTop: 8 }}>
              Welcome to SkillSwap! These Terms of Service ("Terms") govern your access to and use of the SkillSwap website, applications, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <h3 style={{ fontSize: 16, marginTop: 12, color: '#0f1724' }}>1. Acceptance of Terms</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>
              By creating an account, accessing, or using the Service, you signify that you have read, understood, and agree to be bound by these Terms, whether or not you are a registered user of our Service. If you do not agree with these Terms, you must not use the Service.
            </p>

            <h3 style={{ fontSize: 16, marginTop: 12, color: '#0f1724' }}>2. Changes to Terms</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 style={{ margin: 0, fontSize: 18, color: '#0f1724' }}>Privacy Policy</h2>
            <p style={{ color: '#374151', lineHeight: 1.6, marginTop: 8 }}>
              Your privacy is important to us. This Privacy Policy explains how SkillSwap collects, uses, and discloses information about you.
            </p>
            <h3 style={{ fontSize: 16, marginTop: 12, color: '#0f1724' }}>1. Information We Collect</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>
              We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users. This may include your name, email address, skills, interests, and any other information you choose to provide.
            </p>
            <h3 style={{ fontSize: 16, marginTop: 12, color: '#0f1724' }}>2. How We Use Your Information</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>
              We use the information we collect to provide, maintain, and improve our Service, such as to facilitate skill exchanges, personalize your experience, and communicate with you.
            </p>
            <h3 style={{ fontSize: 16, marginTop: 12, color: '#0f1724' }}>3. Sharing of Information</h3>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>
              We may share information about you with third parties for various purposes, including to provide and improve our Service, for marketing, and for legal reasons. We do not sell your personal information to third parties.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default AdminPolicyPage;