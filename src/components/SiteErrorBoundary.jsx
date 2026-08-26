import { Component } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

export default class SiteErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error, info) {
    document.title = 'Recovery · Hunter × Hunter Archive';
    const diagnostic = {
      message: error?.message || String(error || 'Unknown render error'),
      stack: error?.stack || null,
      componentStack: info?.componentStack || null,
    };
    if (typeof window !== 'undefined') window.__HXA_RECOVERY_ERROR__ = diagnostic;
    console.error('[Hunter Archive recovery boundary]', diagnostic);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="site-recovery" role="alert">
        <BookOpen size={28} />
        <span>Hunter × Hunter Archive</span>
        <h1>This section could not finish loading.</h1>
        <p>Your browser-local notes and progress have not been removed. Retry the current page, or return to the archive entrance.</p>
        <div>
          <button type="button" onClick={() => window.location.reload()}><RefreshCw size={15} /> Retry this page</button>
          <button type="button" onClick={() => { window.location.hash = '#/home'; window.location.reload(); }}>Return home</button>
        </div>
      </main>
    );
  }
}
