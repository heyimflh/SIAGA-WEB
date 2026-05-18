/**
 * CreateProjectComingSoon — placeholder page for route
 * `/dashboard/client/create-project`.
 *
 * Wrapped in DashboardShell for visual consistency (cursor, font, transition).
 * Content: Construction icon, heading, subtitle, and back-to-dashboard link.
 * Sidebar active item: null (no Create Project item in menu).
 *
 * Spec: .kiro/specs/client-dashboard
 * Requirements: 17.2, 17.3
 */

import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import DashboardShell from './shell/DashboardShell';
import mockData from './mock-data.js';
import './CreateProjectComingSoon.css';

function CreateProjectComingSoon() {
  const { session } = useAuth();

  return (
    <DashboardShell session={session} mockData={mockData}>
      <div className="coming-soon">
        <Construction className="coming-soon__icon" size={64} aria-hidden="true" />
        <h1 className="coming-soon__title">Buat Proyek Baru</h1>
        <p className="coming-soon__subtitle">
          Wizard 4-step akan segera tersedia.
        </p>
        <Link to="/dashboard/client" className="coming-soon__btn">
          Kembali ke Dashboard
        </Link>
      </div>
    </DashboardShell>
  );
}

export default CreateProjectComingSoon;
