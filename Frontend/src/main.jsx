import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      containerStyle={{ top: 20, right: 20 }}
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "'Inter', 'Outfit', sans-serif",
          fontSize: "13.5px",
          fontWeight: 500,
          borderRadius: "10px",
          padding: "12px 16px",
          maxWidth: "360px",
          background: "rgba(30, 20, 10, 0.85)",
          color: "#e5d5b8",
          border: "1px solid rgba(255,157,77,0.15)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      }}
    />
  </StrictMode>,
);
