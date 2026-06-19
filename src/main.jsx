import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app/App';
import './styles/index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  _jsx(React.StrictMode, {
    children: _jsx(GoogleOAuthProvider, {
      clientId: GOOGLE_CLIENT_ID,
      children: _jsx(App, {})
    })
  })
);
