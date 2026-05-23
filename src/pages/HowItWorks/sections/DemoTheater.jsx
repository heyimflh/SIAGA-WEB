import { useState } from 'react';
import SupportingSectionHeader from '../../SupportingPages/SupportingSectionHeader';
import './DemoTheater.css';

const tabs = [
 { id: 'client', label: 'Client View' },
 { id: 'pilot', label: 'Pilot View' },
 { id: 'report', label: 'Report View' },
];

const scenarios = ['Tower SUTET', 'Jembatan', 'Jalan Tol', 'Gedung'];

function ClientView() {
 return (
 <div className="dt-view">
 <div className="dt-view__row">
 <div className="dt-view__card">
 <span className="dt-view__card-label">Project Status</span>
 <span className="dt-view__card-value dt-view__card-value--active">In Progress</span>
 </div>
 <div className="dt-view__card">
 <span className="dt-view__card-label">Assigned Pilot</span>
 <span className="dt-view__card-value">Rizal Pratama</span>
 </div>
 </div>
 <div className="dt-view__map">
 <div className="dt-view__map-grid"/>
 <svg className="dt-view__map-route" viewBox="0 0 300 80" fill="none">
 <path d="M20 60 C60 15, 140 50, 200 20 C260 -10, 280 40, 280 60" stroke="rgba(0,212,255,0.5)" strokeWidth="2" strokeDasharray="5 3"/>
 <circle cx="200" cy="20" r="5" fill="#00D4FF"/>
 </svg>
 <div className="dt-view__map-label">Live Drone Position</div>
 </div>
 <div className="dt-view__card">
 <span className="dt-view__card-label">Pending Report</span>
 <span className="dt-view__card-value">Draft — 85% complete</span>
 </div>
 </div>
 );
}

function PilotView() {
 return (
 <div className="dt-view">
 <div className="dt-view__checklist">
 <span className="dt-view__checklist-title">Mission Checklist</span>
 <div className="dt-view__check dt-view__check--done"><span>✓</span> Pre-flight check</div>
 <div className="dt-view__check dt-view__check--done"><span>✓</span> Waypoint A — Tower base</div>
 <div className="dt-view__check dt-view__check--active"><span>●</span> Waypoint B — Mid section</div>
 <div className="dt-view__check"><span>○</span> Waypoint C — Top section</div>
 <div className="dt-view__check"><span>○</span> Submit inspection data</div>
 </div>
 <div className="dt-view__row">
 <div className="dt-view__card">
 <span className="dt-view__card-label">Photos Uploaded</span>
 <span className="dt-view__card-value">47 / 120</span>
 </div>
 <div className="dt-view__card">
 <span className="dt-view__card-label">Defects Marked</span>
 <span className="dt-view__card-value dt-view__card-value--alert">3</span>
 </div>
 </div>
 </div>
 );
}

function ReportView() {
 return (
 <div className="dt-view">
 <div className="dt-view__report-preview">
 <div className="dt-view__report-header">
 <span className="dt-view__report-badge">PDF REPORT</span>
 <span className="dt-view__report-title">Inspection Report — Tower SUTET #47</span>
 </div>
 <div className="dt-view__report-summary">
 <div className="dt-view__report-stat">
 <span className="dt-view__report-stat-val">3</span>
 <span className="dt-view__report-stat-lbl">Defects Found</span>
 </div>
 <div className="dt-view__report-stat">
 <span className="dt-view__report-stat-val">47</span>
 <span className="dt-view__report-stat-lbl">Pages</span>
 </div>
 <div className="dt-view__report-stat">
 <span className="dt-view__report-stat-val">120</span>
 <span className="dt-view__report-stat-lbl">Photos</span>
 </div>
 </div>
 </div>
 <button className="dt-view__download" type="button">
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
 Download PDF
 </button>
 </div>
 );
}

const views = { client: <ClientView/>, pilot: <PilotView/>, report: <ReportView/> };

export default function DemoTheater() {
 const [activeTab, setActiveTab] = useState('client');
 const [activeScenario, setActiveScenario] = useState('Tower SUTET');

 return (
 <section className="dt-section">
 <div className="dt-section__container">
 <SupportingSectionHeader
 eyebrow="INTERACTIVE PREVIEW"
 title="Simulasi 90 Detik Workflow SIAGA"
 subtitle="Lihat bagaimana client, pilot, dan report generator bekerja bersama dalam satu platform."
 dark
 />

 <div className="dt-scenarios">
 {scenarios.map((s) => (
 <button
 key={s}
 type="button"
 className={`dt-scenario ${activeScenario === s ? 'dt-scenario--active' : ''}`}
 onClick={() => setActiveScenario(s)}
 >
 {s}
 </button>
 ))}
 </div>

 <div className="dt-frame">
 <div className="dt-frame__header">
 <div className="dt-frame__dots"><span/><span/><span/></div>
 <span className="dt-frame__url">app.siaga.id — {activeScenario}</span>
 </div>


 <div className="dt-tabs" role="tablist" aria-label="Demo views">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 type="button"
 role="tab"
 aria-selected={activeTab === tab.id}
 className={`dt-tab ${activeTab === tab.id ? 'dt-tab--active' : ''}`}
 onClick={() => setActiveTab(tab.id)}
 >
 {tab.label}
 </button>
 ))}
 </div>


 <div className="dt-frame__body" role="tabpanel">
 {views[activeTab]}
 </div>
 </div>
 </div>
 </section>
 );
}
