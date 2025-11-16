import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './contexts/AppProvider';
import App from './components/App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
