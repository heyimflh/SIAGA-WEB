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

function omitKey(obj, key) {
 if (obj == null || !(key in obj)) return obj;
 const next = { ...obj };
 delete next[key];
 return next;
}

function isValidRole(role) {
 return role === 'client' || role === 'pilot';
}

export function registerReducer(state = initialRegisterState, action) {
 if (!action || typeof action.type !== 'string') return state;

 switch (action.type) {

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

 case ACTION_TYPES.SET_FILE: {
 const file = action.payload?.file ?? null;
 return {
 ...state,
 sidopiFile: file,
 stepErrors: omitKey(state.stepErrors, 'sidopiFile'),
 };
 }

 case ACTION_TYPES.CLEAR_FILE: {
 if (state.sidopiFile === null) return state;
 return { ...state, sidopiFile: null };
 }

 case ACTION_TYPES.TOGGLE_TERMS: {
 return { ...state, termsAccepted: !state.termsAccepted };
 }

 case ACTION_TYPES.GO_TO_STEP: {
 if (state.inFlight) return state;

 const step = action.payload?.step;
 if (step !== 1 && step !== 2 && step !== 3) return state;
 if (step === 2 && state.role === null) return state;
 if (step === 3 && state.role === null) return state;
 if (step === state.step) {

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

 case ACTION_TYPES.CLEAR_ERROR: {
 const field = action.payload?.field;
 if (typeof field === 'string' && field.length > 0) {
 return { ...state, stepErrors: omitKey(state.stepErrors, field) };
 }
 return { ...state, stepErrors: {}, globalError: null };
 }

 case ACTION_TYPES.SUBMIT_START: {
 if (state.isSubmitting) return state;
 return {
 ...state,
 isSubmitting: true,
 inFlight: true,
 globalError: null,
 };
 }

 case ACTION_TYPES.SUBMIT_SUCCESS: {
 return {
 ...state,
 isSubmitting: false,
 inFlight: false,
 globalError: null,
 };
 }

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
