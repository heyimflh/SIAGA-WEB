import { useReducer } from 'react';
import { Link } from 'react-router-dom';
import RegisterLayout from '../../components/RegisterLayout.jsx';
import RegisterStepper from './RegisterStepper.jsx';
import RoleSelector from './RoleSelector.jsx';
import DataEntryForm from './DataEntryForm.jsx';
import VerificationStep from './VerificationStep.jsx';
import {
  registerReducer,
  initialRegisterState,
} from './registerReducer.js';
import './RegisterPage.css';

/* ──────────────────────────────────────────────────────────────
 * RegisterPage — Premium Green-Cyan Infrastructure Registration
 *
 * Top-level wrapper for the 3-step Register flow. Owns the
 * `useReducer(registerReducer, initialRegisterState)` instance
 * and forwards { state, dispatch } down to the step children.
 *
 * Layout: Form LEFT, Tower Visual RIGHT (via RegisterLayout)
 *
 * Validates: Requirements 1.9, 2.1–2.11, 9.4
 * ────────────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const [state, dispatch] = useReducer(
    registerReducer,
    initialRegisterState,
  );

  return (
    <RegisterLayout>
      <div className="register-page">
        {/* Glass Register Card */}
        <div className="register-card">
          {/* Heading */}
          <h2 className="register-card__heading">Daftar SIAGA</h2>

          {/* Subheading */}
          <p className="register-card__subheading">
            Bangun akses inspeksi aerial untuk perusahaan, pilot, dan agensi profesional.
          </p>

          {/* Stepper */}
          <RegisterStepper currentStep={state.step} />

          {/* Step Content */}
          <div className="register-card__step">
            {state.step === 1 && (
              <RoleSelector state={state} dispatch={dispatch} />
            )}
            {state.step === 2 && (
              <DataEntryForm state={state} dispatch={dispatch} />
            )}
            {state.step === 3 && (
              <VerificationStep state={state} dispatch={dispatch} />
            )}
          </div>

          {/* Login link */}
          <p className="register-card__login-link">
            Sudah punya akun? <Link to="/login">Masuk</Link>
          </p>
        </div>
      </div>
    </RegisterLayout>
  );
}
