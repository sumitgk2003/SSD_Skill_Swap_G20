
import React from 'react';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import authReducer from './store/authSlice';


// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

// Render the application, wrapped in providers for state and routing
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
