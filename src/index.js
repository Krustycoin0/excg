import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Carica lo script LIFI widget
const loadLiFiScript = () => {
  if (!document.getElementById('lifi-widget-script')) {
    const script = document.createElement('script');
    script.id = 'lifi-widget-script';
    script.src = 'https://cdn.jsdelivr.net/npm/@lifi/widget/build/bundle.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

loadLiFiScript();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
