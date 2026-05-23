import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { isSubmitEnabled } from '../../auth/validators.js';
import { roleToDashboardPath } from '../../auth/routes.js';
import { ACTION_TYPES } from './registerReducer.js';
import SidopiUpload from './SidopiUpload.jsx';

const SUBMIT_DELAY_MS = 800;
const SUCCESS_RATE = 0.95;
const FAILURE_MESSAGE = 'Pendaftaran gagal, silakan coba lagi';

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

function delay(ms) {
 return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function VerificationStep({ state, dispatch }) {
 const navigate = useNavigate();
 const { login } = useAuth();

 const submitDisabled = !isSubmitEnabled(state);

 function handleBack() {

 dispatch({ type: ACTION_TYPES.BACK });
 }

 function handleToggleTerms() {
 dispatch({ type: ACTION_TYPES.TOGGLE_TERMS });
 }

 async function handleSubmit(e) {
 if (e && typeof e.preventDefault === 'function') e.preventDefault();

 if (state.isSubmitting) return;
 if (submitDisabled) return;

 dispatch({ type: ACTION_TYPES.SUBMIT_START });

 await delay(SUBMIT_DELAY_MS);

 const success = Math.random() < SUCCESS_RATE;

 if (success) {
 const role = state.role;

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
