import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SiteErrorBoundary from './components/SiteErrorBoundary';
import { installAccessibilityRuntime } from './lib/accessibilityRuntime';
import './styles.css';
import './nen.css';
import './styles/final-polish.css';
import './nen-spectrum.css';

installAccessibilityRuntime();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteErrorBoundary><App /></SiteErrorBoundary>
  </React.StrictMode>,
);
