# Skill Swap - Peer Learning Platform

A full-stack web application that connects users to exchange skills through one-on-one peer learning sessions. Whether you want to teach a skill you know or learn something new, Skill Swap makes it easy to find compatible learning partners and track your progress.

## 🎯 Project Overview

**Skill Swap** is a community-driven learning platform where users can:
- Browse and search for skill-learning opportunities
- Connect with peers who want to teach/learn complementary skills
- Schedule meetings for skill exchange sessions
- Track teaching and learning hours
- Leave reviews and ratings for learning partners
- Browse skills by category for organized discovery

### Key Features

✅ **Peer Matching** - AI-powered algorithm to find compatible skill-swap partners based on interests and availability  
✅ **Meeting Scheduler** - Schedule online/in-person sessions with automatic conflict detection  
✅ **Session Tracking** - Record completed sessions and automatically update teaching/learning hours  
✅ **User Ratings & Reviews** - Build trust through community reviews  
✅ **Skill Categories** - Browse skills organized by categories (Art, Technology, Languages, Sports, etc.)  
✅ **Real-time Notifications** - Get notified of connection requests and meeting updates  
✅ **Profile Management** - Showcase skills, interests, availability, and timezone preferences  

---

## 📁 Project Structure

```
SSD_FINAL/
├── backend/                          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/              # Business logic handlers
│   │   │   ├── user.controller.js    # User & matching logic
│   │   │   ├── meet.controller.js    # Meeting management
│   │   │   ├── session.controller.js # Session recording & hour tracking
│   │   │   ├── message.controller.js # Chat functionality
│   │   │   ├── review.controller.js  # Ratings & reviews
│   │   │   ├── notification.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/                   # MongoDB Schemas
│   │   │   ├── user.model.js
│   │   │   ├── match.model.js        # Peer connections & hour tracking
│   │   │   ├── meet.model.js         # Scheduled meetings
│   │   │   ├── session.model.js      # Completed sessions
│   │   │   ├── message.model.js
│   │   │   ├── review.model.js
│   │   │   └── skill.model.js
│   │   ├── routes/                   # API endpoints
│   │   ├── middlewares/              # Auth & validation
│   │   ├── utils/                    # Helper functions & integrations
│   │   │   ├── googleCalendar.js     # Google Calendar sync
│   │   │   └── zoom.js               # Zoom meeting creation
│   │   └── index.js                  # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MatchDetailPage.jsx   # Match details & meeting management
│   │   │   ├── DashboardPage.jsx     # User dashboard
│   │   │   ├── BrowseSkillsPage.jsx  # Skill browsing & discovery
│   │   │   ├── FindMatchesPage.jsx   # Peer matching interface
│   │   │   ├── MeetScheduler.jsx     # Meeting scheduling UI
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ReportModal.jsx
│   │   ├── store/                    # Redux state management
│   │   │   ├── authSlice.js
│   │   │   └── store.js
│   │   ├── assets/                   # Images & logos
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.MD                          # This file
```

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access & Refresh tokens)
- **External APIs**: Google Calendar, Zoom
- **Utilities**: Axios, CORS, dotenv

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: CSS-in-JS (inline styles)
- **Routing**: React Router v6

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm/yarn
- MongoDB (local or Atlas)
- Google OAuth credentials (for Calendar sync)
- Zoom App credentials (for meeting creation)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Update `.env` with:
```
MONGODB_URI=mongodb://localhost:27017/skill-swap
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skill-swap

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
PORT=8000

# Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Zoom
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_ACCOUNT_ID=your_zoom_account_id

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

4. **Start the server**
```bash
npm run dev
```

Server runs on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📊 Core Data Models

### User
- Email, name, password (hashed)
- Skills (array of skills they can teach)
- Interests (array of skills they want to learn)
- Bio, avatar, timezone
- Availability (weekly schedule slots)
- Preferred meeting formats (online/in-person/chat)
- Google & Zoom integration tokens

### Match
- user1, user2 (references to User)
- skill1, skill2 (skills being exchanged)
- status: pending | accepted | rejected
- taughtHoursUser1, taughtHoursUser2 (progress tracking)
- requestedHoursUser1, requestedHoursUser2 (goals)

### Meet
- organizer (reference to User)
- attendees (email list)
- match (reference to Match)
- dateAndTime, durationInMinutes
- meetType: online | in person
- organizerRole: teach | learn
- skillBeingTaught (explicit skill name)
- zoomMeetingId, googleEventId (integration IDs)

### Session
- tutor, learner (references to User)
- meet (reference to Meet)
- match (reference to Match)
- date, durationInMinutes
- completed (boolean)
- rating, review (learner's feedback)

### Review
- fromUser, toUser (references)
- session (reference to Session)
- rating (1-5 stars)
- text (review content)

---

## 🔌 Key API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Sign up
- `POST /api/v1/auth/login` - Sign in
- `POST /api/v1/auth/logout` - Sign out

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateProfile` - Update profile
- `GET /api/v1/users/profile/:userId` - Get user profile
- `POST /api/v1/users/getMatches` - Find peer matches
- `GET /api/v1/users/getConnections` - Get all connections

### Connections (Skill Swap Requests)
- `POST /api/v1/users/sendRequest` - Send connection request
- `GET /api/v1/users/viewRequests` - View pending requests
- `POST /api/v1/users/respondRequest` - Accept/reject request

### Meetings
- `POST /api/v1/meets` - Create meeting
- `GET /api/v1/meets` - Get user's meetings
- `PATCH /api/v1/meets/:id/reschedule` - Reschedule meeting
- `DELETE /api/v1/meets/:id` - Cancel meeting

### Sessions
- `POST /api/v1/sessions/complete` - Mark session as complete & record hours
- `GET /api/v1/sessions` - Get user's sessions

### Reviews
- `POST /api/v1/reviews` - Leave a review
- `GET /api/v1/reviews/:userId` - Get user's reviews
- `GET /api/v1/reviews/:userId/average` - Get average rating

### Skills & Categories
- `GET /api/v1/users/getAllSkills` - Get all unique skills
- `GET /api/v1/users/getAllCategory` - Get all categories
- `POST /api/v1/users/getCategoryMatches` - Get matches in a category

---

## ✨ Feature Highlights

### 1. Smart Peer Matching
- Reciprocal skill matching algorithm
- Availability overlap detection
- Timezone-aware scheduling
- Existing connection filtering

**Logic**: User A teaches skill X and wants to learn Y. System finds users who:
- Teach skill Y (what User A wants to learn)
- Want to learn skill X (what User A offers)
- Have overlapping availability

### 2. Session Hours Tracking
When a learner marks a session as complete:
1. Session is created/updated with duration
2. Match.taughtHoursUser1/User2 is incremented
3. Frontend fetches updated match data
4. Stats section displays teaching/learning hours

**Progress Flow**:
```
Mark Complete → submitMarkComplete() → POST /sessions/complete 
→ Backend increments Match hours → fetchMatchStats() 
→ updateUI with fresh hours
```

### 3. Meeting Management
- Create meetings with organizer role (teaching/learning)
- Automatic Google Calendar & Zoom integration
- Conflict detection for participants
- Reschedule or cancel meetings
- Real-time notifications

### 4. User Availability
Users can set weekly availability slots:
```javascript
availability: [
  { dayOfWeek: 1, start: "09:00", end: "17:00" }, // Monday 9am-5pm
  { dayOfWeek: 2, start: "14:00", end: "20:00" }  // Tuesday 2pm-8pm
]
```

---

## 🔐 Authentication & Security

- **JWT Tokens**: Access tokens (15min) + Refresh tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: All API endpoints (except auth) require JWT
- **CORS Configuration**: Restricted to frontend origin
- **Middleware**: Auth verification on all secured endpoints

---

## 📈 Future Enhancements

- [ ] Real-time chat with WebSocket (Socket.io)
- [ ] Video call integration (Jitsi Meet)
- [ ] Advanced analytics dashboard
- [ ] Skill endorsements system
- [ ] Automated recommendation engine
- [ ] Mobile app (React Native)
- [ ] Payment system for premium features
- [ ] AI-powered skill assessment
- [ ] Community badges & achievements

---

## 🐛 Known Issues & Troubleshooting

### Frontend not showing updated hours
- Ensure backend is restarted after changes
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for API errors
- Verify `fetchMatchStats` callback is being triggered

### MongoDB connection fails
- Verify MongoDB service is running
- Check connection string in `.env`
- Ensure database exists or has auto-creation enabled

### Google Calendar integration not working
- Verify OAuth credentials are valid
- Check Google API is enabled in GCP console
- Ensure redirect URI matches in `.env`

### Zoom meetings not creating
- Verify Zoom app credentials
- Check account ID is correct
- Ensure Zoom API is enabled in app settings

---

## 📝 Development Notes

### Adding a New Feature
1. Create backend controller method
2. Add/update MongoDB schema if needed
3. Create route endpoint
4. Test with Postman or curl
5. Build frontend UI component
6. Wire up axios API call
7. Add Redux state management (if needed)
8. Test end-to-end flow

### Debugging Tips
- Enable detailed console logging in controllers
- Use MongoDB Compass to inspect data
- Use browser DevTools for frontend debugging
- Check server logs for API errors
- Use Postman to test endpoints in isolation

---

## 📞 Support & Contribution

For issues, questions, or contributions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Fork the repo and create a feature branch
4. Submit a pull request with clear commit messages

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👥 Team

**SSD - Skill Swap G20**
- Project Owner: Sumit
- Repository: [GitHub - sumitgk2003/SSD_Skill_Swap_G20](https://github.com/sumitgk2003/SSD_Skill_Swap_G20)

---

**Last Updated**: December 2, 2025

For the latest updates and documentation, visit the [GitHub Repository](https://github.com/sumitgk2003/SSD_Skill_Swap_G20).
