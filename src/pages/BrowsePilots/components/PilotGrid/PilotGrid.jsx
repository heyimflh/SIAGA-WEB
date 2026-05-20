import PilotCard from '../PilotCard/PilotCard.jsx';
import EmptyState from '../EmptyState/EmptyState.jsx';
import './PilotGrid.css';

function SkeletonCard() {
  return (
    <div className="pilot-card-skeleton" aria-hidden="true">
      <div className="pilot-card-skeleton__header">
        <div className="pilot-card-skeleton__avatar" />
        <div className="pilot-card-skeleton__lines">
          <div className="pilot-card-skeleton__line pilot-card-skeleton__line--w60" />
          <div className="pilot-card-skeleton__line pilot-card-skeleton__line--w40" />
        </div>
      </div>
      <div className="pilot-card-skeleton__line pilot-card-skeleton__line--w80" />
      <div className="pilot-card-skeleton__line pilot-card-skeleton__line--w100" />
      <div className="pilot-card-skeleton__line pilot-card-skeleton__line--w50" />
    </div>
  );
}

export default function PilotGrid({
  pilots, totalCount, visibleCount, searchQuery, authRole,
  onViewProfile, onInvite, onLoadMore, isLoadingMore, onReset, resultSummary,
}) {
  if (totalCount === 0) {
    return <EmptyState query={searchQuery} onReset={onReset} />;
  }

  return (
    <div className="pilot-grid-wrapper">
      <div className="pilot-grid">
        {pilots.map((pilot) => (
          <PilotCard
            key={pilot.id}
            pilot={pilot}
            searchQuery={searchQuery}
            authRole={authRole}
            onViewProfile={onViewProfile}
            onInvite={onInvite}
          />
        ))}
        {isLoadingMore && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {visibleCount < totalCount && !isLoadingMore && (
        <div className="pilot-grid__load-more">
          <button className="pilot-grid__load-btn" onClick={onLoadMore}>
            Tampilkan Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}
