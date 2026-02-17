import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Clear any persisted auth session so the user is always
// redirected to the login page on a fresh page load / server restart.
localStorage.removeItem('userInfo');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);