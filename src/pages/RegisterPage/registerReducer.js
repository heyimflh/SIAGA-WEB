// Pure reducer for Register_Form_State (RegisterPage flow).
// See .kiro/specs/auth-pages/design.md "RegisterPage" + Properties 5, 6, 9, 10, 11.
//
// Contract:
//   - Pure function: (state, action) => newState. No side effects. No clones of File blobs.
//   - All transitions are explicit; unknown action types return state unchanged.
//   - `inFlight` guards navigation actions (GO_TO_STEP, BACK) against a second action
//     fired in the same frame while a submit is in progress (Requirement 7.8b).
//   - `isSubmitting` guards SUBMIT_START against double-trigger (Requirement 14.4 / Property 9).

// ---------------------------------------------------------------------------
// Action type constants (single source of truth).
// ---------------------------------------------------------------------------
export const ACTION_TYPES = Object.freeze({
  SET_ROLE: 'SET_ROLE',
  SET_FIELD: 'SET_FIELD',
  SET_FILE: 'SET_FILE',
  CLEAR_FILE: 'CLEAR_FILE',
  TOGGLE_TERMS: 'TOGGLE_TERMS',
  GO_TO_STEP: 'GO_TO_STEP',
  BACK: 'BACK',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_FAILURE: 'SUBMIT_FAILURE',
});

// ---------------------------------------------------------------------------
// Initial state (matches design RegisterFormState shape).
// Frozen factory to prevent accidental mutation between consumers.
// ---------------------------------------------------------------------------
const emptyClient = () => ({
  companyName: '',
  corporateEmail: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const emptyPilot = () => ({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

export const initialRegisterState = Object.freeze({
  step: 1,
  role: null,
  client: emptyClient(),
  pilot: emptyPilot(),
  sidopiFile: null,
  termsAccepted: false,
  stepErrors: {},
  globalError: null,
  isSubmitting: false,
  inFlight: false,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function omitKey(obj, key) {
  if (obj == null || !(key in obj)) return obj;
  const next = { ...obj };
  delete next[key];
  return next;
}

function isValidRole(role) {
  return role === 'client' || role === 'pilot';
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------
export function registerReducer(state = initialRegisterState, action) {
  if (!action || typeof action.type !== 'string') return state;

  switch (action.type) {
    // -------------------------------------------------------------------
    // SET_ROLE — payload: { role: 'client' | 'pilot' | null }
    // Property 6: changing to a *different* role clears client/pilot/sidopiFile.
    // Same-role dispatch is a no-op so accidental re-clicks don't wipe data.
    // -------------------------------------------------------------------
    case ACTION_TYPES.SET_ROLE: {
      const nextRole = action.payload?.role ?? null;
      if (nextRole !== null && !isValidRole(nextRole)) return state;
      if (state.role === nextRole) return state;

      return {
        ...state,
        role: nextRole,
        client: emptyClient(),
        pilot: emptyPilot(),
        sidopiFile: null,
        stepErrors: {},
        globalError: null,
      };
    }

    // -------------------------------------------------------------------
    // SET_FIELD — payload: { role: 'client'|'pilot', field: string, value: any }
    // Property 11: clears stepErrors[field] regardless of new value validity.
    // -------------------------------------------------------------------
    case ACTION_TYPES.SET_FIELD: {
      const { role, field, value } = action.payload ?? {};
      if (!isValidRole(role)) return state;
      if (typeof field !== 'string' || field.length === 0) return state;
      const bucket = state[role];
      if (!bucket || !(field in bucket)) return state;

      return {
        ...state,
        [role]: { ...bucket, [field]: value },
        stepErrors: omitKey(state.stepErrors, field),
      };
    }

    // -------------------------------------------------------------------
    // SET_FILE — payload: { file: { name, size, type, blob } }
    // Caller is responsible for validating MIME/size before dispatching.
    // -------------------------------------------------------------------
    case ACTION_TYPES.SET_FILE: {
      const file = action.payload?.file ?? null;
      return {
        ...state,
        sidopiFile: file,
        stepErrors: omitKey(state.stepErrors, 'sidopiFile'),
      };
    }

    // -------------------------------------------------------------------
    // CLEAR_FILE — drop sidopiFile, no other state changes.
    // -------------------------------------------------------------------
    case ACTION_TYPES.CLEAR_FILE: {
      if (state.sidopiFile === null) return state;
      return { ...state, sidopiFile: null };
    }

    // -------------------------------------------------------------------
    // TOGGLE_TERMS — flip termsAccepted boolean.
    // -------------------------------------------------------------------
    case ACTION_TYPES.TOGGLE_TERMS: {
      return { ...state, termsAccepted: !state.termsAccepted };
    }

    // -------------------------------------------------------------------
    // GO_TO_STEP — payload: { step: 1 | 2 | 3 }
    // Guards:
    //   - inFlight=true drops the action (Requirement 7.8b).
    //   - GO_TO_STEP(2) rejected when role is null (Requirement 6.6).
    //   - step must be 1, 2, or 3.
    // On success: advance step, clear stepErrors and globalError, reset inFlight.
    // -------------------------------------------------------------------
    case ACTION_TYPES.GO_TO_STEP: {
      if (state.inFlight) return state;

      const step = action.payload?.step;
      if (step !== 1 && step !== 2 && step !== 3) return state;
      if (step === 2 && state.role === null) return state;
      if (step === 3 && state.role === null) return state;
      if (step === state.step) {
        // Idempotent: still ensure inFlight is reset.
        if (!state.inFlight) return state;
        return { ...state, inFlight: false };
      }

      return {
        ...state,
        step,
        stepErrors: {},
        globalError: null,
        inFlight: false,
      };
    }

    // -------------------------------------------------------------------
    // BACK — go to previous step, no validation, preserves all field data.
    // Requirements 7.9 and 8.9.
    // -------------------------------------------------------------------
    case ACTION_TYPES.BACK: {
      if (state.inFlight) return state;
      if (state.step <= 1) return state;
      return {
        ...state,
        step: state.step - 1,
        stepErrors: {},
        globalError: null,
        inFlight: false,
      };
    }

    // -------------------------------------------------------------------
    // SET_ERRORS — payload: { stepErrors?: {...}, globalError?: string|null }
    // Replaces stepErrors map and/or sets globalError. Either field is optional.
    // -------------------------------------------------------------------
    case ACTION_TYPES.SET_ERRORS: {
      const { stepErrors, globalError } = action.payload ?? {};
      const next = { ...state };
      if (stepErrors !== undefined) {
        next.stepErrors = stepErrors == null ? {} : { ...stepErrors };
      }
      if (globalError !== undefined) {
        next.globalError = globalError;
      }
      return next;
    }

    // -------------------------------------------------------------------
    // CLEAR_ERROR — payload: { field?: string }
    // If field given, removes that key from stepErrors; otherwise clears all
    // stepErrors and globalError.
    // -------------------------------------------------------------------
    case ACTION_TYPES.CLEAR_ERROR: {
      const field = action.payload?.field;
      if (typeof field === 'string' && field.length > 0) {
        return { ...state, stepErrors: omitKey(state.stepErrors, field) };
      }
      return { ...state, stepErrors: {}, globalError: null };
    }

    // -------------------------------------------------------------------
    // SUBMIT_START — Property 9: if already submitting, return state unchanged.
    // Otherwise set isSubmitting=true, inFlight=true, clear globalError.
    // -------------------------------------------------------------------
    case ACTION_TYPES.SUBMIT_START: {
      if (state.isSubmitting) return state;
      return {
        ...state,
        isSubmitting: true,
        inFlight: true,
        globalError: null,
      };
    }

    // -------------------------------------------------------------------
    // SUBMIT_SUCCESS — terminal: clear submission flags.
    // Field data is preserved (caller will navigate away anyway).
    // -------------------------------------------------------------------
    case ACTION_TYPES.SUBMIT_SUCCESS: {
      return {
        ...state,
        isSubmitting: false,
        inFlight: false,
        globalError: null,
      };
    }

    // -------------------------------------------------------------------
    // SUBMIT_FAILURE — Property 10: preserve role, client, pilot, sidopiFile,
    // termsAccepted. Only flip submission flags and surface globalError.
    // payload: { globalError?: string }
    // -------------------------------------------------------------------
    case ACTION_TYPES.SUBMIT_FAILURE: {
      const message =
        action.payload?.globalError ?? 'Pendaftaran gagal, silakan coba lagi';
      return {
        ...state,
        isSubmitting: false,
        inFlight: false,
        globalError: message,
      };
    }

    default:
      return state;
  }
}

export default registerReducer;
