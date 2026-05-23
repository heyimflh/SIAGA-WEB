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
