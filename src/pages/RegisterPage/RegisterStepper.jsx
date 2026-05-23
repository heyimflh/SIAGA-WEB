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
 >
 {STEPS.map((step, index) => {
 const isActive = step.number <= currentStep;
 const isCurrent = step.number === currentStep;
 const isLast = index === STEPS.length - 1;
 const nextActive = STEPS[index + 1]?.number <= currentStep;

 return (
 <li
 key={step.number}
 aria-current={isCurrent ? 'step' : undefined}
 className="register-stepper__item"
 >
 <div
 className="register-stepper__track"
 >
 {index > 0 && (
 <span
 aria-hidden="true"
 className={
 'register-stepper__connector register-stepper__connector--left' +
 (isActive ? ' register-stepper__connector--active' : '')
 }
 />
 )}
 {!isLast && (
 <span
 aria-hidden="true"
 className={
 'register-stepper__connector register-stepper__connector--right' +
 (nextActive ? ' register-stepper__connector--active' : '')
 }
 />
 )}
 <span
 className={
 'register-stepper__circle' +
 (isActive ? ' register-stepper__circle--active' : '')
 }
 >
 {step.number}
 </span>
 </div>
 <span
 className={
 'register-stepper__label' +
 (isActive ? ' register-stepper__label--active' : '') +
 (isCurrent ? ' register-stepper__label--current' : '')
 }
 >
 {step.label}
 </span>
 </li>
 );
 })}
 </ol>
 );
}
