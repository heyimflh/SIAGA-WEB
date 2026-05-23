import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { getReportProjects, getProjectImages, getInspectionData } from './report-data.js';
import {
 getInitialWizardState,
 resetWizardState,
 canProceedFromStep,
 getPreviewPages,
 getProgressStage,
 generateReportId,
 getTotalPages,
 isValidProjectId,
 getButtonAriaLabel,
} from './report-logic.js';
import ReportHeroHeader from './components/ReportHeroHeader/ReportHeroHeader.jsx';
import ReportStepper from './components/ReportStepper/ReportStepper.jsx';
import StepPilihProyek from './components/StepPilihProyek/StepPilihProyek.jsx';
import StepCustomize from './components/StepCustomize/StepCustomize.jsx';
import StepGenerate from './components/StepGenerate/StepGenerate.jsx';
import StepLoading from './components/StepLoading/StepLoading.jsx';
import StepDownload from './components/StepDownload/StepDownload.jsx';
import ToastNotification from './components/ToastNotification/ToastNotification.jsx';
import './ReportGeneratorPage.css';

const ACTIONS = {
 SET_STEP: 'SET_STEP',
 SELECT_PROJECT: 'SELECT_PROJECT',
 TOGGLE_CHECKBOX: 'TOGGLE_CHECKBOX',
 START_LOADING: 'START_LOADING',
 UPDATE_PROGRESS: 'UPDATE_PROGRESS',
 COMPLETE_LOADING: 'COMPLETE_LOADING',
 CANCEL_LOADING: 'CANCEL_LOADING',
 OPEN_MODAL: 'OPEN_MODAL',
 CLOSE_MODAL: 'CLOSE_MODAL',
 SET_MODAL_PAGE: 'SET_MODAL_PAGE',
 SHOW_TOAST: 'SHOW_TOAST',
 HIDE_TOAST: 'HIDE_TOAST',
 SET_GENERATING_PDF: 'SET_GENERATING_PDF',
 RESET: 'RESET',
};

function wizardReducer(state, action) {
 switch (action.type) {
 case ACTIONS.SET_STEP:
 return { ...state, currentStep: action.payload };
 case ACTIONS.SELECT_PROJECT:
 return { ...state, selectedProject: action.payload };
 case ACTIONS.TOGGLE_CHECKBOX:
 return {
 ...state,
 checkboxState: {
 ...state.checkboxState,
 [action.payload]: !state.checkboxState[action.payload],
 },
 };
 case ACTIONS.START_LOADING:
 return {
 ...state,
 currentStep: 3,
 isLoadingActive: true,
 isLoadingComplete: false,
 progress: 0,
 };
 case ACTIONS.UPDATE_PROGRESS:
 return { ...state, progress: action.payload };
 case ACTIONS.COMPLETE_LOADING:
 return {
 ...state,
 isLoadingActive: false,
 isLoadingComplete: true,
 progress: 100,
 currentStep: 4,
 reportId: generateReportId(),
 reportTimestamp: new Date().toISOString(),
 };
 case ACTIONS.CANCEL_LOADING:
 return {
 ...state,
 isLoadingActive: false,
 isLoadingComplete: false,
 progress: 0,
 currentStep: 2,
 };
 case ACTIONS.OPEN_MODAL:
 return { ...state, isModalOpen: true, modalCurrentPage: 0 };
 case ACTIONS.CLOSE_MODAL:
 return { ...state, isModalOpen: false };
 case ACTIONS.SET_MODAL_PAGE:
 return { ...state, modalCurrentPage: action.payload };
 case ACTIONS.SHOW_TOAST:
 return { ...state, toastMessage: action.payload.message, toastType: action.payload.type };
 case ACTIONS.HIDE_TOAST:
 return { ...state, toastMessage: null };
 case ACTIONS.SET_GENERATING_PDF:
 return { ...state, isGeneratingPdf: action.payload };
 case ACTIONS.RESET:
 return resetWizardState();
 default:
 return state;
 }
}

const stepVariants = {
 initial: { opacity: 0, y: 16, scale: 0.98 },
 animate: { opacity: 1, y: 0, scale: 1 },
 exit: { opacity: 0, y: -12, scale: 0.98 },
};

function ReportGeneratorPage() {
 const [searchParams] = useSearchParams();
 const [state, dispatch] = useReducer(wizardReducer, getInitialWizardState());

 const completedProjects = useMemo(() => getReportProjects(), []);

 useEffect(() => {
 const queryProjectId = searchParams.get('projectId');
 if (queryProjectId && isValidProjectId(queryProjectId, completedProjects)) {
 const project = completedProjects.find((p) => p.id === queryProjectId);
 if (project) {
 dispatch({ type: ACTIONS.SELECT_PROJECT, payload: project });
 }
 }
 }, [searchParams, completedProjects]);

 const handleProjectSelect = useCallback((project) => {
 dispatch({ type: ACTIONS.SELECT_PROJECT, payload: project });
 }, []);

 const handleCheckboxToggle = useCallback((blockId) => {
 dispatch({ type: ACTIONS.TOGGLE_CHECKBOX, payload: blockId });
 }, []);

 const handleNext = useCallback(() => {
 if (canProceedFromStep(state.currentStep, state)) {
 dispatch({ type: ACTIONS.SET_STEP, payload: state.currentStep + 1 });
 }
 }, [state]);

 const handleBack = useCallback(() => {
 if (state.currentStep > 0) {
 dispatch({ type: ACTIONS.SET_STEP, payload: state.currentStep - 1 });
 }
 }, [state.currentStep]);

 const handleGenerate = useCallback(() => {
 dispatch({ type: ACTIONS.START_LOADING });
 }, []);

 const handleLoadingComplete = useCallback(() => {
 dispatch({ type: ACTIONS.COMPLETE_LOADING });
 }, []);

 const handleLoadingCancel = useCallback(() => {
 dispatch({ type: ACTIONS.CANCEL_LOADING });
 }, []);

 const handleDownload = useCallback(async () => {
 if (state.isGeneratingPdf) return;
 dispatch({ type: ACTIONS.SET_GENERATING_PDF, payload: true });
 try {
 const { generateReportPdf } = await import('./report-pdf.jsx');
 const { blob, filename } = await generateReportPdf({
 project: state.selectedProject,
 checkboxState: state.checkboxState,
 reportId: state.reportId,
 timestamp: state.reportTimestamp,
 });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = filename;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
 dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message: 'Laporan berhasil diunduh!', type: 'success' } });
 } catch (err) {
 console.error('PDF generation failed:', err);

 try {
 const response = await fetch('/reports/sample-report.pdf');
 if (response.ok) {
 const blob = await response.blob();
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `SIAGA-Report-${state.reportId || 'draft'}.pdf`;
 document.body.appendChild(a);
 a.click();
 document.body.removeChild(a);
 URL.revokeObjectURL(url);
 dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message: 'Laporan diunduh (fallback mode)', type: 'info' } });
 } else {
 throw new Error('Fallback PDF not available');
 }
 } catch {
 dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message: 'Gagal membuat PDF. Silakan coba lagi.', type: 'error' } });
 }
 } finally {
 dispatch({ type: ACTIONS.SET_GENERATING_PDF, payload: false });
 }
 }, [state.selectedProject, state.checkboxState, state.reportId, state.reportTimestamp, state.isGeneratingPdf]);

 const handlePreview = useCallback(() => {
 dispatch({ type: ACTIONS.OPEN_MODAL });
 }, []);

 const handleCloseModal = useCallback(() => {
 dispatch({ type: ACTIONS.CLOSE_MODAL });
 }, []);

 const handleModalPageChange = useCallback((page) => {
 dispatch({ type: ACTIONS.SET_MODAL_PAGE, payload: page });
 }, []);

 const handleReset = useCallback(() => {
 dispatch({ type: ACTIONS.RESET });
 }, []);

 const handleToastClose = useCallback(() => {
 dispatch({ type: ACTIONS.HIDE_TOAST });
 }, []);

 const previewPages = useMemo(() => getPreviewPages(state.checkboxState), [state.checkboxState]);
 const totalPages = useMemo(() => getTotalPages(state.checkboxState), [state.checkboxState]);
 const projectImages = useMemo(() => getProjectImages(state.selectedProject), [state.selectedProject]);
 const inspectionData = useMemo(() => getInspectionData(state.selectedProject), [state.selectedProject]);

 const renderStep = () => {
 switch (state.currentStep) {
 case 0:
 return (
 <StepPilihProyek
 projects={completedProjects}
 selectedProject={state.selectedProject}
 onSelect={handleProjectSelect}
 onNext={handleNext}
 canProceed={canProceedFromStep(0, state)}
 projectImages={projectImages}
 inspectionData={inspectionData}
 />
 );
 case 1:
 return (
 <StepCustomize
 checkboxState={state.checkboxState}
 onToggle={handleCheckboxToggle}
 previewPages={previewPages}
 totalPages={totalPages}
 onBack={handleBack}
 onNext={handleNext}
 canProceed={canProceedFromStep(1, state)}
 projectImages={projectImages}
 />
 );
 case 2:
 return (
 <StepGenerate
 project={state.selectedProject}
 previewPages={previewPages}
 totalPages={totalPages}
 onBack={handleBack}
 onGenerate={handleGenerate}
 ariaLabel={getButtonAriaLabel(state.selectedProject?.nama)}
 />
 );
 case 3:
 return (
 <StepLoading
 isActive={state.isLoadingActive}
 progress={state.progress}
 onComplete={handleLoadingComplete}
 onCancel={handleLoadingCancel}
 dispatch={dispatch}
 ACTIONS={ACTIONS}
 />
 );
 case 4:
 return (
 <StepDownload
 project={state.selectedProject}
 reportId={state.reportId}
 timestamp={state.reportTimestamp}
 previewPages={previewPages}
 totalPages={totalPages}
 isModalOpen={state.isModalOpen}
 modalCurrentPage={state.modalCurrentPage}
 onDownload={handleDownload}
 onPreview={handlePreview}
 onCloseModal={handleCloseModal}
 onModalPageChange={handleModalPageChange}
 onReset={handleReset}
 projectImages={projectImages}
 inspectionData={inspectionData}
 isGeneratingPdf={state.isGeneratingPdf || false}
 />
 );
 default:
 return null;
 }
 };

 return (
 <div className="report-generator-page">
 <div className="report-generator-page__bg">
 <div className="report-generator-page__bg-glow" />
 <div className="report-generator-page__bg-grid" />
 </div>

 <div className="report-generator-page__container">

 <ReportHeroHeader completedCount={completedProjects.length} />

 <ReportStepper currentStep={state.currentStep} />

 <div className="report-generator-page__content">
 <AnimatePresence mode="wait">
 <motion.div
 key={state.currentStep}
 variants={stepVariants}
 initial="initial"
 animate="animate"
 exit="exit"
 transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
 >
 {renderStep()}
 </motion.div>
 </AnimatePresence>
 </div>
 </div>

 {state.toastMessage && (
 <ToastNotification
 message={state.toastMessage}
 type={state.toastType}
 onClose={handleToastClose}
 />
 )}
 </div>
 );
}

export default ReportGeneratorPage;
