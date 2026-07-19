import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SiteErrorBoundary from './components/SiteErrorBoundary';
import './styles.css';
import './redesign.css';
import './v3.css';

console.log('test 123');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteErrorBoundary><App /></SiteErrorBoundary>
  </React.StrictMode>,
);
