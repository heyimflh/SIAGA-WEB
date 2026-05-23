import { useState, useCallback, useRef, useEffect } from 'react';
import { mockData } from './mock-data.js';
import {
 selectPendingBidCount,
 selectProyekBerjalanCount,
 selectTotalEarnings,
 selectRatingAvg,
 selectUrgentDeadlineCount,
 selectNextDeadline,
} from './utils/selectors.js';

import PilotDashboardShell from './shell/PilotDashboardShell.jsx';
import PilotMissionHeader from './sections/PilotMissionHeader/PilotMissionHeader.jsx';
import SectionNavigator from './sections/SectionNavigator/SectionNavigator.jsx';
import OverviewCards from './sections/OverviewCards/OverviewCards.jsx';
import BidAktif from './sections/BidAktif/BidAktif.jsx';
import ProyekBerjalan from './sections/ProyekBerjalan/ProyekBerjalan.jsx';
import Workspace from './sections/Workspace/Workspace.jsx';
import Earnings from './sections/Earnings/Earnings.jsx';
import RatingReviews from './sections/RatingReviews/RatingReviews.jsx';
import QuickActions from './sections/QuickActions/QuickActions.jsx';

import './PilotDashboardPage.css';

function PilotDashboardPage() {

 const [bidSort, setBidSort] = useState('terbaru');
 const [selectedProjectId, setSelectedProjectId] = useState(
 mockData.proyek_berjalan.length > 0 ? mockData.proyek_berjalan[0].id : null
 );
 const [uploadedFiles, setUploadedFiles] = useState([...mockData.workspace_files]);
 const [uploadingFiles, setUploadingFiles] = useState([]);
 const [activeSection, setActiveSection] = useState('section-overview');

 const workspaceRef = useRef(null);
 const timersRef = useRef([]);

 useEffect(() => {
 return () => {
 timersRef.current.forEach(clearInterval);
 };
 }, []);

 const pendingBidCount = selectPendingBidCount(mockData.bids);
 const proyekBerjalanCount = selectProyekBerjalanCount(mockData.proyek_berjalan);
 const totalEarnings = selectTotalEarnings(mockData.earnings);
 const ratingAvg = selectRatingAvg(mockData.pilot_profile);
 const urgentDeadlineCount = selectUrgentDeadlineCount(mockData.proyek_berjalan);
 const nextDeadline = selectNextDeadline(mockData.proyek_berjalan);

 const handleSortChange = useCallback((sort) => setBidSort(sort), []);
 const handleProjectSelect = useCallback((id) => setSelectedProjectId(id), []);

 const handleScrollToWorkspace = useCallback((projectId) => {
 if (projectId) setSelectedProjectId(projectId);
 setTimeout(() => {
 const el = document.getElementById('section-workspace');
 if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }, 100);
 }, []);

 const handleSectionClick = useCallback((sectionId) => {
 setActiveSection(sectionId);
 }, []);

 const handleFilesAdded = useCallback((files) => {
 const newUploading = files.map((file, i) => ({
 id: `upload-${Date.now()}-${i}`,
 nama_file: file.name,
 progress: 0,
 status: 'uploading',
 _file: file,
 }));

 setUploadingFiles((prev) => [...prev, ...newUploading]);

 newUploading.forEach((uf) => {
 const timer = setInterval(() => {
 setUploadingFiles((prev) => {
 const updated = prev.map((f) => {
 if (f.id !== uf.id || f.status !== 'uploading') return f;
 const newProgress = Math.min(f.progress + Math.random() * 25 + 10, 100);
 if (newProgress >= 100) {

 if (Math.random() < 0.1) {
 return { ...f, progress: f.progress, status: 'error' };
 }
 return { ...f, progress: 100, status: 'complete' };
 }
 return { ...f, progress: Math.round(newProgress) };
 });

 const completed = updated.filter((f) => f.status === 'complete');
 if (completed.length > 0) {
 setUploadedFiles((prevFiles) => [
 ...prevFiles,
 ...completed.map((c) => ({
 id: c.id,
 project_id: selectedProjectId,
 nama_file: c.nama_file,
 ukuran: c._file?.size || 0,
 tipe: c.nama_file.split('.').pop()?.toUpperCase() || 'Unknown',
 tanggal_upload: new Date().toISOString().split('T')[0],
 thumbnail: null,
 })),
 ]);
 }

 return updated.filter((f) => f.status === 'uploading' || f.status === 'error');
 });
 }, 500);

 timersRef.current.push(timer);

 setTimeout(() => clearInterval(timer), 5000);
 });
 }, [selectedProjectId]);

 const handleFileDelete = useCallback((fileId) => {
 setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
 }, []);

 const handleRetry = useCallback((fileId) => {
 setUploadingFiles((prev) =>
 prev.map((f) => (f.id === fileId ? { ...f, progress: 0, status: 'uploading' } : f))
 );
 }, []);

 return (
 <div className="pilot-dashboard">
 <PilotDashboardShell
 pilotProfile={mockData.pilot_profile}
 notifUnread={mockData.notifications.unread_count}
 activeMissionCount={proyekBerjalanCount}
 >
 <PilotMissionHeader
 pilotProfile={mockData.pilot_profile}
 activeMissionCount={proyekBerjalanCount}
 pendingBidCount={pendingBidCount}
 nextDeadline={nextDeadline}
 />

 <SectionNavigator
 activeSection={activeSection}
 onSectionClick={handleSectionClick}
 />

 <OverviewCards
 bidAktifCount={pendingBidCount}
 proyekBerjalanCount={proyekBerjalanCount}
 totalEarnings={totalEarnings}
 ratingAvg={ratingAvg}
 totalReviews={mockData.pilot_profile.total_reviews}
 urgentDeadlineCount={urgentDeadlineCount}
 />

 <BidAktif
 bids={mockData.bids}
 sortBy={bidSort}
 onSortChange={handleSortChange}
 />

 <ProyekBerjalan
 projects={mockData.proyek_berjalan}
 onUploadClick={handleScrollToWorkspace}
 />

 <div ref={workspaceRef}>
 <Workspace
 projects={mockData.proyek_berjalan}
 selectedProjectId={selectedProjectId}
 onProjectSelect={handleProjectSelect}
 uploadedFiles={uploadedFiles}
 uploadingFiles={uploadingFiles}
 onFilesAdded={handleFilesAdded}
 onFileDelete={handleFileDelete}
 onRetry={handleRetry}
 />
 </div>


 <Earnings
 earnings={mockData.earnings}
 payments={mockData.payments}
 />

 <RatingReviews
 ratingAvg={ratingAvg}
 totalReviews={mockData.pilot_profile.total_reviews}
 reviews={mockData.reviews}
 />

 <QuickActions onScrollToWorkspace={() => handleScrollToWorkspace(null)} />
 </PilotDashboardShell>
 </div>
 );
}

export default PilotDashboardPage;
