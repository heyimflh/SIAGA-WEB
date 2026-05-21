import BidIntelligencePanel from './BidIntelligencePanel.jsx';
import BidCommandPanel from './BidCommandPanel.jsx';
import PilotSelectionModal from './PilotSelectionModal.jsx';
import PilotProfileDrawer from './PilotProfileDrawer.jsx';
import './BiddingSection.css';

export default function BiddingSection({
 role, project, derivedStatus, roleVisibility,
 hasBid, submittedBid, bidFormData, bidFormErrors, isBidSubmitting,
 onBidFormChange, onBidSubmit, onSelectPilot, onViewProfile,
 isSelectionModalOpen, selectedPilotId, onConfirmSelection, onCloseModal,
 isProfileDrawerOpen, drawerPilotId, onCloseDrawer,
}) {
 const isClosed = roleVisibility.biddingClosed;

 return (
 <div className="pd-bidding">
 {role === 'client' ? (
 <>
 <BidIntelligencePanel
 project={project}
 isClosed={isClosed}
 onSelectPilot={onSelectPilot}
 onViewProfile={onViewProfile}
 />
 {isSelectionModalOpen && (
 <PilotSelectionModal
 pilot={project.bids?.find((b) => b.pilot_id === selectedPilotId)}
 onConfirm={onConfirmSelection}
 onClose={onCloseModal}
 />
 )}
 {isProfileDrawerOpen && (
 <PilotProfileDrawer
 pilot={project.bids?.find((b) => b.pilot_id === drawerPilotId)}
 onClose={onCloseDrawer}
 />
 )}
 </>
 ) : (
 <BidCommandPanel
 project={project}
 derivedStatus={derivedStatus}
 hasBid={hasBid}
 submittedBid={submittedBid}
 bidFormData={bidFormData}
 bidFormErrors={bidFormErrors}
 isBidSubmitting={isBidSubmitting}
 isClosed={isClosed}
 onBidFormChange={onBidFormChange}
 onBidSubmit={onBidSubmit}
 />
 )}
 </div>
 );
}
