import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateLogin } from '../../auth/validators.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { roleToDashboardPath } from '../../auth/routes.js';

/**
 * LoginForm — Premium glassmorphism login form with icons.
 *
 * Props:
 *   - role: 'client' | 'pilot'           (controlled by RoleTabSwitcher)
 *   - onLoadingChange?: (loading) => void (optional notifier)
 *
 * Submit handler order (EXACT, per design):
 *   1. validateLogin({email, password})
 *   2. if errors non-empty → setState({errors}), return early; do NOT set isSubmitting
 *   3. if state.errors still has any visible message → return early (Req 5.9)
 *   4. if state.isSubmitting === true → return (Req 14.4)
 *   5. set isSubmitting = true
 *   6. await 800ms mock delay
 *   7. mock auth: 95% success, 5% random failure (Math.random() < 0.05)
 *   8. on success: login({role, email}) then navigate(roleToDashboardPath(role))
 *   9. on failure: setState({ errors: { ...prev, global: 'Login gagal, silakan coba lagi' }, isSubmitting: false })
 *
 * Requirements: 4.4–4.10, 5.1–5.9, 11.1, 11.4, 12.1–12.4, 14.1, 14.3, 14.4
 */

const MOCK_DELAY_MS = 800;
const FAILURE_PROBABILITY = 0.05;
const GLOBAL_ERROR_MESSAGE = 'Login gagal, silakan coba lagi';

function hasFieldErrors(errors) {
  if (!errors) return false;
  return Boolean(errors.email) || Boolean(errors.password);
}

export default function LoginForm({ role, onLoadingChange }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inFlightRef = useRef(false);

  useEffect(() => {
    if (typeof onLoadingChange === 'function') {
      onLoadingChange(isSubmitting);
    }
  }, [isSubmitting, onLoadingChange]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => {
      if (!prev.email && !prev.global) return prev;
      const next = { ...prev };
      delete next.email;
      delete next.global;
      return next;
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => {
      if (!prev.password && !prev.global) return prev;
      const next = { ...prev };
      delete next.password;
      delete next.global;
      return next;
    });
  };

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = validateLogin({ email, password });

    if (!result.ok) {
      setErrors((prev) => ({
        ...(prev.global ? {} : prev),
        ...result.errors,
      }));
      return;
    }

    if (hasFieldErrors(errors)) {
      return;
    }

    if (inFlightRef.current || isSubmitting) {
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);
    setErrors((prev) => {
      if (!prev.global) return prev;
      const next = { ...prev };
      delete next.global;
      return next;
    });

    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    const failed = Math.random() < FAILURE_PROBABILITY;

    if (!failed) {
      login({ role, email });
      // Check for redirect query param
      const redirectTarget = searchParams.get('redirect');
      if (redirectTarget) {
        // Validate redirect target matches the user's role
        const isClientRoute = redirectTarget.startsWith('/dashboard/client');
        const isPilotRoute = redirectTarget.startsWith('/dashboard/pilot');
        const isSharedRoute = redirectTarget.startsWith('/project/');
        const roleMatches =
          (role === 'client' && (isClientRoute || isSharedRoute)) ||
          (role === 'pilot' && (isPilotRoute || isSharedRoute)) ||
          (!isClientRoute && !isPilotRoute && !isSharedRoute);

        if (roleMatches) {
          navigate(decodeURIComponent(redirectTarget), { replace: true });
          return;
        }
      }
      // Default: go to role's dashboard
      const dashboardPath = roleToDashboardPath(role);
      if (dashboardPath) {
        navigate(dashboardPath, { replace: true });
      }
      return;
    }

    setErrors((prev) => ({ ...prev, global: GLOBAL_ERROR_MESSAGE }));
    setIsSubmitting(false);
    inFlightRef.current = false;
  };

  const emailHasError = Boolean(errors.email);
  const passwordHasError = Boolean(errors.password);

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      {errors.global ? (
        <div role="alert" className="auth-error-banner">
          {errors.global}
        </div>
      ) : null}

      {/* Email Field */}
      <div className={`login-form__field${emailHasError ? ' is-invalid' : ''}`}>
        <label htmlFor="login-email">Email</label>
        <div className="login-form__input-wrapper">
          <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={emailHasError || undefined}
            aria-describedby={emailHasError ? 'login-email-err' : undefined}
            disabled={isSubmitting}
          />
        </div>
        {emailHasError ? (
          <span id="login-email-err" role="alert" className="login-form__error">
            {errors.email}
          </span>
        ) : null}
      </div>

      {/* Password Field */}
      <div className={`login-form__field${passwordHasError ? ' is-invalid' : ''}`}>
        <label htmlFor="login-password">Password</label>
        <div className="login-form__input-wrapper">
          <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Masukkan password"
            value={password}
            onChange={handlePasswordChange}
            aria-invalid={passwordHasError || undefined}
            aria-describedby={passwordHasError ? 'login-password-err' : undefined}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <path d="m1 1 22 22"/>
                <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {passwordHasError ? (
          <span id="login-password-err" role="alert" className="login-form__error">
            {errors.password}
          </span>
        ) : null}
      </div>

      {/* Remember Me + Forgot Password */}
      <div className="login-form__options-row">
        <div className="login-form__remember">
          <label htmlFor="login-remember" className="login-form__remember-label">
            <input
              id="login-remember"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberChange}
              disabled={isSubmitting}
            />
            <span>Ingat Saya</span>
          </label>
        </div>
        <a href="#" className="login-form__forgot-link" onClick={(e) => e.preventDefault()}>
          Lupa Password?
        </a>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="login-form__submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting || undefined}
      >
        {isSubmitting ? (
          <span className="login-form__spinner" aria-hidden="true" />
        ) : null}
        <span>{isSubmitting ? 'Memproses...' : 'Masuk ke Dashboard →'}</span>
      </button>
    </form>
  );
}
