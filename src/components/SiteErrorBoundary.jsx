import { Component } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';

export default class SiteErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    document.title = 'Recovery · Hunter × Hunter Archive';
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
