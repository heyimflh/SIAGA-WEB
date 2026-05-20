import { useState, useEffect } from 'react';
import './WorkflowNavigator.css';

const steps = [
  { id: '01', label: 'Brief' },
  { id: '02', label: 'Matching' },
  { id: '03', label: 'Inspection' },
  { id: '04', label: 'Report' },
];

export default function WorkflowNavigator() {
  const [activeStep, setActiveStep] = useState('01');

  useEffect(() => {
    const sections = steps.map((s) => document.getElementById(`workflow-step-${s.id}`));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-step-id');
            if (id) setActiveStep(id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -40% 0px' }
    );

    sections.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollToStep = (id) => {
    const el = document.getElementById(`workflow-step-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="wf-nav" aria-label="Workflow steps">
      <div className="wf-nav__container">
        <div className="wf-nav__track">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              className={`wf-nav__step ${activeStep === step.id ? 'wf-nav__step--active' : ''}`}
              onClick={() => scrollToStep(step.id)}
              aria-current={activeStep === step.id ? 'step' : undefined}
            >
              <span className="wf-nav__step-num">{step.id}</span>
              <span className="wf-nav__step-label">{step.label}</span>
            </button>
          ))}
          {/* Progress line */}
          <div className="wf-nav__line" aria-hidden="true">
            <div
              className="wf-nav__line-fill"
              style={{ width: `${((parseInt(activeStep) - 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
