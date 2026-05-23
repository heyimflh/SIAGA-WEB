import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, User } from 'lucide-react';
import { ACTION_TYPES } from './registerReducer.js';

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

 useEffect(() => {
 const queryRole = searchParams.get('role');
 if (isValidRole(queryRole) && state.role === null) {
 dispatch({ type: ACTION_TYPES.SET_ROLE, payload: { role: queryRole } });
 dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: { step: 2 } });
 }

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
