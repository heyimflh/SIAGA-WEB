/**
 * StepLoading — Step 4: Cinematic AI Geospatial Processing Overlay.
 * Fullscreen dark navy scene with drone, radar, progress, and confetti.
 *
 * BUG FIX: Previous version had stale closure / cleanup issues causing
 * the loading to get stuck. This version uses refs for callbacks and
 * a single orchestrating effect.
 */

import { useEffect, useRef, useState } from 'react';
import { getProgressStage } from '../../report-logic.js';
import './StepLoading.css';

const TECHNICAL_CHIPS = [
  { label: 'GPS locked', threshold: 10 },
  { label: 'Drone route verified', threshold: 20 },
  { label: '12 photos analyzed', threshold: 35 },
  { label: 'Map layer aligned', threshold: 50 },
  { label: 'Damage markers detected', threshold: 65 },
  { label: 'PDF layout compiled', threshold: 80 },
  { label: 'Digital signature attached', threshold: 92 },
];

const PROCESSING_LOG = [
  { text: '> initializing SIAGA report engine', threshold: 5 },
  { text: '> reading project inspection metadata', threshold: 15 },
  { text: '> compiling GPS coordinate matrix', threshold: 28 },
  { text: '> aligning orthomosaic preview layer', threshold: 42 },
  { text: '> rendering damage documentation gallery', threshold: 55 },
  { text: '> generating asset condition table', threshold: 68 },
  { text: '> attaching pilot digital signature', threshold: 82 },
  { text: '> finalizing PDF package', threshold: 95 },
];

function StepLoading({ isActive, progress, onComplete, onCancel, dispatch, ACTIONS }) {
  const intervalRef = useRef(null);
  const completeTimeoutRef = useRef(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const [localProgress, setLocalProgress] = useState(0);

  // Keep onComplete ref fresh
  onCompleteRef.current = onComplete;

  // Main progress timer — runs once when isActive becomes true
  useEffect(() => {
    if (!isActive) {
      // Reset when not active
      completedRef.current = false;
      setLocalProgress(0);
      return;
    }

    completedRef.current = false;
    setLocalProgress(0);

    const duration = 7000; // 7 seconds total
    const stepMs = 70;
    const increment = 100 / (duration / stepMs);
    let current = 0;

    intervalRef.current = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const rounded = Math.min(100, Math.round(current));
      setLocalProgress(rounded);
      dispatch({ type: ACTIONS.UPDATE_PROGRESS, payload: rounded });

      // When we hit 100, fire confetti and schedule completion
      if (rounded >= 100 && !completedRef.current) {
        completedRef.current = true;
        // Fire confetti (non-blocking)
        fireConfetti();
        // Schedule transition to Step 5 after 1.5s
        completeTimeoutRef.current = setTimeout(() => {
          onCompleteRef.current();
        }, 1500);
      }
    }, stepMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
        completeTimeoutRef.current = null;
      }
    };
  }, [isActive]); // Only depend on isActive — dispatch/ACTIONS are stable

  // Handle browser back
  useEffect(() => {
    const handlePopState = () => {
      if (isActive) onCancel();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isActive, onCancel]);

  if (!isActive && localProgress < 100) return null;

  const displayProgress = localProgress;
  const stage = getProgressStage(displayProgress);
  const visibleChips = TECHNICAL_CHIPS.filter((c) => displayProgress >= c.threshold);
  const visibleLogs = PROCESSING_LOG.filter((l) => displayProgress >= l.threshold);

  return (
    <div className="step-loading" aria-live="polite">
      <div className="step-loading__overlay">
        {/* Background effects */}
        <div className="step-loading__bg-grid" />
        <div className="step-loading__radar" />

        {/* Drone animation */}
        <div className="step-loading__drone-track">
          <div
            className="step-loading__drone"
            style={{ transform: `translateX(${displayProgress}%)` }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              <path d="M2 12h4m12 0h4M12 2v4m0 12v4" />
              <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
          </div>
          <div
            className="step-loading__scan-beam"
            style={{ transform: `translateX(${displayProgress}%)` }}
          />
        </div>

        {/* Technical chips */}
        <div className="step-loading__chips">
          {visibleChips.map((chip) => (
            <span key={chip.label} className="step-loading__chip">
              {chip.label}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="step-loading__progress-area">
          <div
            className="step-loading__progress-bar"
            role="progressbar"
            aria-valuenow={displayProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress pembuatan laporan"
          >
            <div
              className="step-loading__progress-fill"
              style={{ transform: `scaleX(${displayProgress / 100})` }}
            />
          </div>
          <div className="step-loading__progress-info">
            <span className="step-loading__progress-percent">{displayProgress}%</span>
            <span className="step-loading__progress-stage">{stage}</span>
          </div>
        </div>

        {/* Technical log */}
        <div className="step-loading__log">
          {visibleLogs.map((log) => (
            <div key={log.text} className="step-loading__log-line">
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Fire confetti — non-blocking, errors silently caught.
 */
async function fireConfetti() {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00B4D8', '#ffffff', '#7DD3FC', '#67E8F9', '#0062D6'],
      disableForReducedMotion: true,
    });
  } catch {
    // Silently skip — must not block flow
  }
}

export default StepLoading;
