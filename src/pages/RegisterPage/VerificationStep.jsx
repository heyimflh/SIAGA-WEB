// VerificationStep — Register flow Step 3.
// See .kiro/specs/auth-pages/design.md "VerificationStep" + Requirements
// 8.2, 8.5, 8.6, 8.6a, 8.7, 8.8, 8.9, 14.2, 14.2a, 14.3, 14.4.
//
// Responsibilities:
// - Branch by role: pilot → render <SidopiUpload>; client → render
// inline <ClientSummary>. The SidopiUpload component is NOT rendered
// for client at all .
// - Render TermsCheckbox bound to state.termsAccepted (TOGGLE_TERMS).
// - "Daftar" button is disabled per pure isSubmitEnabled(state).
// - "Kembali" dispatches BACK without losing Step 2 data (Req 8.9).
// - Submit handler: SUBMIT_START → 800ms mock delay → 95% success (call
// login + navigate) / 5% failure (SUBMIT_FAILURE with banner copy).
// - Global error banner shown above form when state.globalError is set.

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { isSubmitEnabled } from '../../auth/validators.js';
import { roleToDashboardPath } from '../../auth/routes.js';
import { ACTION_TYPES } from './registerReducer.js';
import SidopiUpload from './SidopiUpload.jsx';

const SUBMIT_DELAY_MS = 800;
const SUCCESS_RATE = 0.95;
const FAILURE_MESSAGE = 'Pendaftaran gagal, silakan coba lagi';

/**
 * Inline read-only summary of Step 2 client data. Only rendered for the
 * 'client' role branch — never shares the DOM tree with SidopiUpload.
 */
function ClientSummary({ client }) {
 const safe = client || {};
 return (
 <div className="verification-step__summary" data-testid="client-summary">
 <h3 className="verification-step__summary-title">Ringkasan data</h3>
 <dl className="verification-step__summary-list">
 <div className="verification-step__summary-row">
 <dt>Nama perusahaan</dt>
 <dd>{safe.companyName || '-'}</dd>
 </div>
 <div className="verification-step__summary-row">
 <dt>Email korporat</dt>
 <dd>{safe.corporateEmail || '-'}</dd>
 </div>
 <div className="verification-step__summary-row">
 <dt>Nomor telepon</dt>
 <dd>{safe.phone || '-'}</dd>
 </div>
 </dl>
 </div>
 );
}

/**
 * Sleep helper used to simulate the 800ms submit latency. Kept inline so
 * the component file stays self-contained.
 */
function delay(ms) {
 return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function VerificationStep({ state, dispatch }) {
 const navigate = useNavigate();
 const { login } = useAuth();

 const submitDisabled = !isSubmitEnabled(state);

 function handleBack() {
 // BACK preserves all field data — reducer guarantees this.
 dispatch({ type: ACTION_TYPES.BACK });
 }

 function handleToggleTerms() {
 dispatch({ type: ACTION_TYPES.TOGGLE_TERMS });
 }

 async function handleSubmit(e) {
 if (e && typeof e.preventDefault === 'function') e.preventDefault();

 // Local guard layered on top of the reducer's SUBMIT_START guard
 // .
 if (state.isSubmitting) return;
 if (submitDisabled) return;

 dispatch({ type: ACTION_TYPES.SUBMIT_START });

 await delay(SUBMIT_DELAY_MS);

 // Mock auth: 95% success, 5% failure.
 const success = Math.random() < SUCCESS_RATE;

 if (success) {
 const role = state.role;
 // Pilot uses `email`; client uses `corporateEmail` (per Step 2 fields).
 const email =
 role === 'pilot'
 ? state.pilot?.email ?? ''
 : state.client?.corporateEmail ?? '';

 dispatch({ type: ACTION_TYPES.SUBMIT_SUCCESS });
 login({ role, email });

 const dashboardPath = roleToDashboardPath(role);
 if (dashboardPath) navigate(dashboardPath);
 return;
 }

 // Failure path — preserve all field data via SUBMIT_FAILURE
 // and surface the banner copy
 // .
 dispatch({
 type: ACTION_TYPES.SUBMIT_FAILURE,
 payload: { globalError: FAILURE_MESSAGE },
 });
 }

 return (
 <form className="verification-step" onSubmit={handleSubmit} noValidate>
 {state.globalError && (
 <div
 className="verification-step__error-banner auth-error-banner"
 role="alert"
 aria-live="polite"
 >
 {state.globalError}
 </div>
 )}

 {/* Role branch — a: client must NOT render SidopiUpload. */}
 {state.role === 'pilot' ? (
 <SidopiUpload state={state} dispatch={dispatch} />
 ) : (
 <ClientSummary client={state.client} />
 )}

 <div className="verification-step__terms">
 <input
 type="checkbox"
 id="terms"
 checked={!!state.termsAccepted}
 onChange={handleToggleTerms}
 />
 <label htmlFor="terms">
 Saya menyetujui Syarat &amp; Ketentuan SIAGA
 </label>
 </div>

 <div className="verification-step__actions">
 <button
 type="button"
 className="verification-step__back"
 onClick={handleBack}
 disabled={state.isSubmitting}
 >
 Kembali
 </button>
 <button
 type="submit"
 className="verification-step__submit"
 disabled={submitDisabled || state.isSubmitting}
 aria-busy={state.isSubmitting ? 'true' : 'false'}
 >
 {state.isSubmitting ? 'Memproses...' : 'Daftar'}
 </button>
 </div>
 </form>
 );
}
