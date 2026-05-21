import { validateStep2 } from '../../auth/validators.js';
import { ACTION_TYPES } from './registerReducer.js';

/* ──────────────────────────────────────────────────────────────
 * DataEntryForm — Step 2 of the Register flow
 *
 * Renders role-specific input fields (client vs pilot), runs
 * validateStep2 on submit, and transitions to Step 3 only after
 * a successful persistence simulation (try/catch).
 *
 * Submit order ("Lanjut" button):
 * 1. validateStep2(state.role, state[state.role])
 * 2. errors non-empty → dispatch SET_ERRORS({ stepErrors }), return
 * 3. else: try { persistenceSimulation() } catch {
 * dispatch SET_ERRORS({ globalError: 'Gagal menyimpan data, silakan coba lagi' });
 * return;
 * }
 * 4. dispatch GO_TO_STEP(3)
 *
 * "Kembali" button: dispatch BACK with no validation; 
 * reducer preserves Step 2 field data automatically.
 *
 * Concurrent guard: a double-click on "Lanjut" is benign because 
 * the reducer treats GO_TO_STEP(3) → 3 as a no-op once the step 
 * has advanced, and the inFlight flag drops any second navigation 
 * action queued in the same frame.
 *
 * Inline error clearing: the SET_FIELD reducer branch removes 
 * stepErrors[field] on every keystroke, so we don't have to 
 * manage it from this component.
 * ────────────────────────────────────────────────────────────── */

const PERSISTENCE_FAIL_MESSAGE = 'Gagal menyimpan data, silakan coba lagi';

// Field metadata keyed by role — keeps render logic declarative and
// guarantees the rendered field set matches validateStep2's expectations.
const FIELD_DEFS = {
 client: [
 { name: 'companyName', label: 'Nama Perusahaan', type: 'text', autoComplete: 'organization' },
 { name: 'corporateEmail', label: 'Email Korporat', type: 'email', autoComplete: 'email' },
 { name: 'phone', label: 'Nomor Telepon', type: 'tel', autoComplete: 'tel' },
 { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
 { name: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', autoComplete: 'new-password' },
 ],
 pilot: [
 { name: 'fullName', label: 'Nama Lengkap', type: 'text', autoComplete: 'name' },
 { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
 { name: 'phone', label: 'Nomor Telepon', type: 'tel', autoComplete: 'tel' },
 { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
 { name: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', autoComplete: 'new-password' },
 ],
};

/**
 * Persistence simulation — placeholder for a real write.
 *
 * The design (Persistence Failure section) acknowledges that an
 * in-memory React form will essentially never throw, but the
 * try/catch path must still exist so a is enforced
 * if a future implementation swaps this for a real write.
 */
function persistStep2Data(/* role, fields */) {
 // Intentionally a no-op for the mock implementation.
 // A real impl could write to localStorage or call a backend.
}

export default function DataEntryForm({ state, dispatch }) {
 const role = state.role;

 // Defensive: if reducer guards somehow let us render here without a
 // role, fall back to nothing rather than crashing on FIELD_DEFS[null].
 const fields = role ? FIELD_DEFS[role] : null;
 if (!fields) return null;

 const values = state[role] || {};
 const stepErrors = state.stepErrors || {};
 const globalError = state.globalError;

 function handleChange(field, value) {
 dispatch({
 type: ACTION_TYPES.SET_FIELD,
 payload: { role, field, value },
 });
 }

 function handleSubmit(event) {
 event.preventDefault();

 // Step 1: validate.
 const result = validateStep2(role, values);

 // Step 2: surface inline errors and bail.
 if (!result.ok) {
 dispatch({
 type: ACTION_TYPES.SET_ERRORS,
 payload: { stepErrors: result.errors, globalError: null },
 });
 return;
 }

 // Step 3: persistence simulation guarded by try/catch.
 try {
 persistStep2Data(role, values);
 } catch {
 dispatch({
 type: ACTION_TYPES.SET_ERRORS,
 payload: { globalError: PERSISTENCE_FAIL_MESSAGE },
 });
 return;
 }

 // Step 4: advance. Reducer's inFlight + step-equality guard makes a
 // second click in the same frame a no-op.
 dispatch({
 type: ACTION_TYPES.GO_TO_STEP,
 payload: { step: 3 },
 });
 }

 function handleBack() {
 dispatch({ type: ACTION_TYPES.BACK });
 }

 const headingId = 'data-entry-form-heading';

 return (
 <form
 className="data-entry-form"
 onSubmit={handleSubmit}
 aria-labelledby={headingId}
 noValidate
 >
 <h2 id={headingId} className="data-entry-form__heading">
 {role === 'client' ? 'Data Perusahaan' : 'Data Pilot'}
 </h2>
 <p className="data-entry-form__subheading">
 Lengkapi informasi berikut untuk melanjutkan ke verifikasi.
 </p>

 {globalError ? (
 <div role="alert" className="data-entry-form__banner">
 {globalError}
 </div>
 ) : null}

 <div className="data-entry-form__fields">
 {fields.map(({ name, label, type, autoComplete }) => {
 const inputId = `register-${role}-${name}`;
 const errorId = `${inputId}-err`;
 const errorMessage = stepErrors[name];
 const hasError = Boolean(errorMessage);

 return (
 <div
 key={name}
 className={
 'data-entry-form__field' +
 (hasError ? ' data-entry-form__field--invalid' : '')
 }
 >
 <label htmlFor={inputId} className="data-entry-form__label">
 {label}
 </label>
 <input
 id={inputId}
 name={name}
 type={type}
 autoComplete={autoComplete}
 value={values[name] ?? ''}
 onChange={(e) => handleChange(name, e.target.value)}
 aria-invalid={hasError || undefined}
 aria-describedby={hasError ? errorId : undefined}
 className="data-entry-form__input"
 />
 {hasError ? (
 <span
 id={errorId}
 role="alert"
 className="data-entry-form__error"
 >
 {errorMessage}
 </span>
 ) : null}
 </div>
 );
 })}
 </div>

 <div className="data-entry-form__actions">
 <button
 type="button"
 className="data-entry-form__back"
 onClick={handleBack}
 >
 Kembali
 </button>
 <button type="submit" className="data-entry-form__submit">
 Lanjut
 </button>
 </div>
 </form>
 );
}
