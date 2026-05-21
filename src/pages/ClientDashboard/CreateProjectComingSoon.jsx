/**
 * CreateProjectComingSoon — placeholder page for route
 * `/dashboard/client/create-project`.
 *
 * Wrapped in DashboardShell for visual consistency (cursor, font, transition).
 * Content: Construction icon, heading, subtitle, and alternative CTAs.
 * Sidebar active item: null (no Create Project item in menu).
 *
 * Spec: .kiro/specs/client-dashboard
 * Provides a placeholder UI for the project creation flow.
 */

import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { ROUTES } from '../../routes/appRoutes';
import DashboardShell from './shell/DashboardShell';
import mockData from './mock-data.js';
import { selectCompanyByEmail } from './utils/selectors.js';
import './CreateProjectComingSoon.css';

function CreateProjectComingSoon() {
 const { session } = useAuth();
 const company = selectCompanyByEmail(mockData, session?.email);
 const companyName = company.nama || session?.email || 'Client';

 return (
 <DashboardShell
 session={session}
 mockData={mockData}
 companyName={companyName}
 notifUnread={mockData.notifications.unread_count}
 >
 <div className="coming-soon">
 <Construction className="coming-soon__icon" size={64} aria-hidden="true" />
 <h1 className="coming-soon__title">Buat Proyek Baru</h1>
 <p className="coming-soon__subtitle">
 Fitur pembuatan proyek sedang disiapkan. Untuk sementara, Anda dapat
 melihat pilot tersedia atau mencoba report generator demo.
 </p>
 <div className="coming-soon__actions">
 <Link to={ROUTES.pilots} className="coming-soon__btn coming-soon__btn--primary">
 Lihat Pilot
 </Link>
 <Link to={ROUTES.clientReportGenerator} className="coming-soon__btn coming-soon__btn--secondary">
 Coba Report Generator
 </Link>
 <Link to={ROUTES.clientDashboard} className="coming-soon__btn coming-soon__btn--ghost">
 Kembali ke Dashboard
 </Link>
 </div>
 </div>
 </DashboardShell>
 );
}

export default CreateProjectComingSoon;
