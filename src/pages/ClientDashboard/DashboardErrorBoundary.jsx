/**
 * DashboardErrorBoundary — React class component error boundary for ClientDashboardPage.
 *
 * Wraps ClientDashboardPage inside <PageTransition>. When an error is caught
 * during render of any section, the boundary renders a plain DOM fallback
 * immediately — bypassing/ignoring the PageTransition exit animation.
 *
 * Fallback: "Terjadi kesalahan memuat dashboard" + reload button.
 *
 * Spec: .kiro/specs/client-dashboard
 * Ensures critical render failures are caught and handled gracefully.
 */

import { Component } from 'react';

class DashboardErrorBoundary extends Component {
 constructor(props) {
 super(props);
 this.state = { hasError: false };
 }

 static getDerivedStateFromError() {
 return { hasError: true };
 }

 componentDidCatch(error, errorInfo) {
 // Always log in development for debugging
 console.error(
 '[DashboardErrorBoundary] Caught error in dashboard subtree:',
 error,
 errorInfo
 );
 }

 handleReload = () => {
 window.location.reload();
 };

 render() {
 if (this.state.hasError) {
 // Plain DOM fallback — no Framer Motion, no PageTransition animation.
 // Renders immediately without waiting for exit animation.
 return (
 <div
 style={{
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 minHeight: '100vh',
 padding: '2rem',
 fontFamily: 'Inter, sans-serif',
 color: '#0A192F',
 backgroundColor: '#F4F7F6',
 textAlign: 'center',
 }}
 >
 <h1
 style={{
 fontSize: '1.5rem',
 fontWeight: 600,
 marginBottom: '1rem',
 fontFamily: 'Montserrat, sans-serif',
 }}
 >
 Terjadi kesalahan memuat dashboard
 </h1>
 <button
 onClick={this.handleReload}
 style={{
 padding: '0.75rem 1.5rem',
 fontSize: '1rem',
 fontWeight: 500,
 color: '#ffffff',
 backgroundColor: '#00D2FF',
 border: 'none',
 borderRadius: '8px',
 cursor: 'pointer',
 fontFamily: 'Inter, sans-serif',
 transition: 'opacity 200ms ease',
 }}
 onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; }}
 onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
 >
 Muat Ulang
 </button>
 </div>
 );
 }

 return this.props.children;
 }
}

export default DashboardErrorBoundary;
