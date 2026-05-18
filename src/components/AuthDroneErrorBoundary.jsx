import { Component } from 'react';

/* ──────────────────────────────────────────────────────────────
 * AuthDroneErrorBoundary
 * Separated from AuthDroneScene to allow proper code-splitting.
 * The scene is lazy-loaded while this boundary is statically imported.
 * ────────────────────────────────────────────────────────────── */

function DronePlaceholder() {
  return (
    <div
      className="auth-drone-placeholder"
      aria-hidden="true"
    >
      <div className="auth-drone-placeholder__loader">
        <div className="auth-drone-placeholder__pulse" />
        <span>Loading drone...</span>
      </div>
    </div>
  );
}

export class AuthDroneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow — fallback placeholder is the UX contract.
  }

  render() {
    if (this.state.hasError) {
      return <DronePlaceholder />;
    }
    return this.props.children;
  }
}

export default AuthDroneErrorBoundary;
