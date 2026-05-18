// Feature: auth-pages — Premium Green-Cyan Stepper
// Three-step indicator for Register flow.
// Active steps use emerald-cyan gradient; inactive steps use neutral gray.
// Requirements: 6.1, 6.5

const STEPS = [
  { number: 1, label: 'Pilih Peran' },
  { number: 2, label: 'Data Akun' },
  { number: 3, label: 'Verifikasi' },
];

export default function RegisterStepper({ currentStep = 1 }) {
  return (
    <ol
      className="register-stepper"
      aria-label="Register progress"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        listStyle: 'none',
        margin: '0 0 8px',
        padding: 0,
        width: '100%',
        gap: 8,
      }}
    >
      {STEPS.map((step, index) => {
        const isActive = step.number <= currentStep;
        const isCurrent = step.number === currentStep;
        const isLast = index === STEPS.length - 1;
        const nextActive = STEPS[index + 1]?.number <= currentStep;

        const activeColor = '#10B981';
        const inactiveColor = '#9CA3AF';

        return (
          <li
            key={step.number}
            aria-current={isCurrent ? 'step' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: '50%',
                    top: '50%',
                    height: 2,
                    transform: 'translateY(-50%)',
                    background: isActive ? activeColor : inactiveColor,
                    opacity: isActive ? 1 : 0.35,
                    marginRight: 16,
                    borderRadius: 1,
                  }}
                />
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    right: 0,
                    top: '50%',
                    height: 2,
                    transform: 'translateY(-50%)',
                    background: nextActive ? activeColor : inactiveColor,
                    opacity: nextActive ? 1 : 0.35,
                    marginLeft: 16,
                    borderRadius: 1,
                  }}
                />
              )}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isActive
                    ? 'linear-gradient(135deg, #10B981, #22D3EE)'
                    : 'rgba(255, 255, 255, 0.65)',
                  color: isActive ? '#ffffff' : '#7890A0',
                  border: isActive
                    ? 'none'
                    : '1.5px solid rgba(120, 150, 160, 0.3)',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: isActive
                    ? '0 8px 24px rgba(16, 185, 129, 0.25)'
                    : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {step.number}
              </span>
            </div>
            <span
              style={{
                marginTop: 8,
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: isCurrent ? 600 : 500,
                color: isActive ? '#062B35' : '#7890A0',
                textAlign: 'center',
                transition: 'color 0.2s ease',
              }}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
