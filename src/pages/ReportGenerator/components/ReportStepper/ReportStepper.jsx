/**
 * ReportStepper — Enhanced aerospace-tech stepper with 5 steps.
 */

import { FolderSearch, SlidersHorizontal, Zap, Activity, FileCheck } from 'lucide-react';
import './ReportStepper.css';

const STEPS = [
  { label: 'Pilih Proyek', icon: FolderSearch },
  { label: 'Customize', icon: SlidersHorizontal },
  { label: 'Generate', icon: Zap },
  { label: 'Loading', icon: Activity },
  { label: 'Download', icon: FileCheck },
];

function ReportStepper({ currentStep = 0 }) {
  return (
    <nav className="report-stepper" role="navigation" aria-label="Progress langkah">
      {/* Desktop stepper */}
      <div className="report-stepper__desktop">
        <div className="report-stepper__rail">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <div key={step.label} className="report-stepper__item">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={`report-stepper__connector ${
                      index <= currentStep ? 'report-stepper__connector--filled' : ''
                    }`}
                  />
                )}

                {/* Node */}
                <div
                  className={`report-stepper__node ${
                    isActive ? 'report-stepper__node--active' : ''
                  } ${isCompleted ? 'report-stepper__node--completed' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <Icon size={16} />
                  )}
                  {isActive && <span className="report-stepper__pulse" />}
                </div>

                {/* Label */}
                <span
                  className={`report-stepper__label ${
                    isActive ? 'report-stepper__label--active' : ''
                  } ${isCompleted ? 'report-stepper__label--completed' : ''}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile compact stepper */}
      <div className="report-stepper__mobile">
        <span className="report-stepper__mobile-step">
          Step {currentStep + 1}/5
        </span>
        <span className="report-stepper__mobile-label">
          {STEPS[currentStep]?.label}
        </span>
      </div>
    </nav>
  );
}

export default ReportStepper;
