# Redux Persistence Debug Guide

This guide will help you diagnose why Redux state is not being persisted for availability, timezone, and preferredFormats.

## Steps to Test:

### 1. Clear Browser Data
- Open DevTools (F12)
- Application/Storage tab
- Clear LocalStorage and Cookies
- Close and reopen the application

### 2. Fresh Login
- Login with your credentials
- **Watch Console Logs** for:
  - `[LoginPage] Backend login response:` - Check if timezone, preferredFormats, availability are present
  - `[Redux authSlice] setAvailability called with:` - Verify Redux actions are firing
  - `[Redux authSlice] setTimezone called with:` - Verify Redux actions are firing
  - `[Redux authSlice] setPreferredFormats called with:` - Verify Redux actions are firing
  - `[LoginPage] localStorage after login dispatch:` - Check if data is in localStorage

### 3. Update Profile with Availability
- Go to CreateProfilePage
- Set timezone, preferred formats, and availability slots
- Click Save
- **Watch Console Logs** for:
  - `[CreateProfilePage] Sending payload to backend:` - Verify data being sent
  - Backend logs `[updateProfile] Received request body:` - Verify backend receives it
  - Backend logs `[updateProfile] Final updatePayload:` - Verify payload is built correctly
  - Backend logs `[updateProfile] Updated user from DB:` - Verify fields are saved
  - `[CreateProfilePage] Backend response:` - Verify response includes the fields
  - `[Redux authSlice] setAvailability called with:` - Verify Redux actions fire
  - `[CreateProfilePage] localStorage after dispatch:` - Verify localStorage is updated

### 4. Page Reload Test
- After saving profile, reload the page (F5)
- Check localStorage:
  ```javascript
  // In browser console:
  JSON.parse(localStorage.getItem('persist:root')).auth
  ```
- Should show:
  ```javascript
  {
    "availability": "[...]",
    "timezone": "...",
    "preferredFormats": "[...]"
  }
  ```

### 5. Check Redux Store State
- Install Redux DevTools Browser Extension (if not already)
- Open DevTools, go to Redux tab
- Check `auth` reducer state
- Should see:
  - `availability: [...]`
  - `timezone: "..."`
  - `preferredFormats: [...]`

## Expected Flow:

1. **Login**: Backend sends user data → LoginPage dispatches Redux → redux-persist saves to localStorage
2. **Update Profile**: Frontend sends data → Backend saves to DB → Backend returns updated user → Frontend dispatches Redux → redux-persist saves to localStorage
3. **Page Reload**: redux-persist rehydrates from localStorage → Redux state restored

## Common Issues:

### Issue 1: Redux actions not firing
- Check browser console for `[Redux authSlice]` logs
- If not present, check that dispatch() is being called in LoginPage/CreateProfilePage

### Issue 2: Redux actions firing but localStorage empty
- redux-persist might not be configured correctly
- Check store.js has persistConfig with `storage: localStorage`
- Check middleware includes persist actions

### Issue 3: localStorage has data but doesn't persist on reload
- Browser localStorage might be disabled
- Privacy mode might clear localStorage on close
- Check Storage tab in DevTools shows the data

### Issue 4: Backend not returning fields
- Check `[LoginPage] Backend login response:` log
- If timezone/preferredFormats/availability missing, backend is not returning them
- Check User model has these fields defined
- Check loginUser endpoint uses correct .select() to include these fields

## Files Modified with Logging:

1. `frontend/src/pages/CreateProfilePage.jsx` - logs payload and dispatch
2. `frontend/src/pages/LoginPage.jsx` - logs response and dispatch
3. `frontend/src/store/authSlice.js` - logs each action
4. `backend/src/controllers/user.controller.js` - logs updateProfile and loginUser flow

## Next Steps Based on Findings:

- **If backend not returning fields**: Update user.controller.js loginUser to ensure fields are selected
- **If Redux actions not firing**: Check dispatch() calls in pages
- **If localStorage empty**: Check redux-persist configuration in store.js
- **If fields not saving to DB**: Check updateProfile validation logic

