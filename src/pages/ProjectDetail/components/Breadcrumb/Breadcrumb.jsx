import { Link } from 'react-router-dom';
import { getDashboardPath } from '../../project-logic.js';
import './Breadcrumb.css';

export default function Breadcrumb({ role, projectName }) {
 const dashPath = getDashboardPath(role);
 return (
 <nav className="pd-breadcrumb" aria-label="Breadcrumb">
 <ol className="pd-breadcrumb__list">
 <li><Link to={dashPath} className="pd-breadcrumb__link">Dashboard</Link></li>
 <li className="pd-breadcrumb__sep">›</li>
 <li><span className="pd-breadcrumb__link pd-breadcrumb__link--muted">Proyek</span></li>
 <li className="pd-breadcrumb__sep">›</li>
 <li className="pd-breadcrumb__current" title={projectName}>{projectName}</li>
 </ol>
 </nav>
 );
}
