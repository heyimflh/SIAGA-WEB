import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, User } from 'lucide-react';
import { ACTION_TYPES } from './registerReducer.js';

/* ──────────────────────────────────────────────────────────────
 * RoleSelector — Step 1 of the Register flow
 *
 * Renders two large interactive cards (Perusahaan, Pilot/Agensi).
 * Cards are real <button> elements so the browser handles
 * Enter/Space activation and tab order natively (Requirement 12.6).
 *
 * Hover effect: translateY(-6px) over 200ms ease-out (Requirement 6.3).
 * Click: dispatch SET_ROLE then GO_TO_STEP(2) (Requirement 6.4).
 *
 * Query parameter handling (Requirements 1.6, 1.7, 1.7a):
 *   - Read ?role=client|pilot from useSearchParams ONCE on mount
 *     (useEffect with empty deps).
 *   - If valid AND state.role is still null → auto-set role and
 *     advance to Step 2.
 *   - If invalid (or absent) → stay at Step 1.
 *   - Subsequent changes to the query string after mount are
 *     deliberately ignored so an active user is never yanked
 *     between roles.
 *
 * Validates: Requirements 1.4, 1.5, 1.6, 1.7, 1.7a, 6.2, 6.3, 6.4,
 *            6.6, 12.6
 * ────────────────────────────────────────────────────────────── */

const ROLE_OPTIONS = [
  {
    role: 'client',
    title: 'Perusahaan',
    description: 'Pemilik aset infrastruktur yang membutuhkan inspeksi aerial',
    Icon: Building2,
  },
  {
    role: 'pilot',
    title: 'Pilot / Agensi',
    description: 'Pilot UAV bersertifikat SIDOPI siap mengambil misi',
    Icon: User,
  },
];

function isValidRole(value) {
  return value === 'client' || value === 'pilot';
}

export default function RoleSelector({ state, dispatch }) {
  const [searchParams] = useSearchParams();

  // Mount-only effect: respect ?role= query exactly once.
  // Reading searchParams here is fine because we never re-run the
  // effect — the linter will flag the missing dep, but the empty
  // array is intentional per Requirement 1.7a.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const queryRole = searchParams.get('role');
    if (isValidRole(queryRole) && state.role === null) {
      dispatch({ type: ACTION_TYPES.SET_ROLE, payload: { role: queryRole } });
      dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: { step: 2 } });
    }
    // Invalid or missing query → user stays at Step 1, no action taken.
  }, []);

  function handleSelect(role) {
    dispatch({ type: ACTION_TYPES.SET_ROLE, payload: { role } });
    dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: { step: 2 } });
  }

  return (
    <div className="role-selector" role="group" aria-label="Pilih peran Anda">
      <h2 className="role-selector__heading">Pilih Peran Anda</h2>
      <p className="role-selector__subheading">
        Tentukan tipe akun yang sesuai untuk melanjutkan pendaftaran.
      </p>

      <div className="role-selector__cards">
        {ROLE_OPTIONS.map(({ role, title, description, Icon }) => {
          const isActive = state.role === role;
          return (
            <button
              key={role}
              type="button"
              className={
                'role-selector__card' +
                (isActive ? ' role-selector__card--active' : '')
              }
              aria-pressed={isActive}
              onClick={() => handleSelect(role)}
            >
              <span className="role-selector__icon" aria-hidden="true">
                <Icon size={48} strokeWidth={1.6} />
              </span>
              <span className="role-selector__title">{title}</span>
              <span className="role-selector__description">{description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
