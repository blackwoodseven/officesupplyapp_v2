import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppProviders from './context';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProviders>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENTID}>
        <App />
      </GoogleOAuthProvider>
    </AppProviders>
  </React.StrictMode>
);
