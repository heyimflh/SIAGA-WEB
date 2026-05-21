import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

const containerStyle = {
 minHeight: '100vh',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '1rem',
 padding: '2rem',
 background: 'var(--color-primary)',
 color: 'var(--color-surface)',
 fontFamily: 'inherit',
};

const headingStyle = {
 margin: 0,
 fontSize: '2rem',
 fontWeight: 700,
};

const infoStyle = {
 margin: 0,
 fontSize: '1rem',
 opacity: 0.9,
};

const buttonStyle = {
 marginTop: '1rem',
 padding: '0.6rem 1.4rem',
 fontSize: '1rem',
 fontWeight: 600,
 color: 'var(--color-primary)',
 background: 'var(--color-surface)',
 border: 'none',
 borderRadius: '0.4rem',
 cursor: 'pointer',
};

export default function PilotDashboard() {
 const { session, logout } = useAuth();
 const navigate = useNavigate();

 const handleLogout = () => {
 logout();
 navigate('/login');
 };

 return (
 <main style={containerStyle}>
 <h1 style={headingStyle}>Pilot Dashboard</h1>
 <p style={infoStyle}>Logged in as: {session?.email ?? '-'}</p>
 <p style={infoStyle}>Role: pilot</p>
 <button type="button" style={buttonStyle} onClick={handleLogout}>
 Logout
 </button>
 </main>
 );
}
