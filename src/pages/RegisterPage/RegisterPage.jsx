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

export default function RegisterPage() {
 const [state, dispatch] = useReducer(
 registerReducer,
 initialRegisterState,
 );

 return (
 <RegisterLayout>
 <div className="register-page">
 <div className="register-card">
 <h2 className="register-card__heading">Daftar SIAGA</h2>


 <p className="register-card__subheading">
 Bangun akses inspeksi aerial untuk perusahaan, pilot, dan agensi profesional.
 </p>

 <RegisterStepper currentStep={state.step} />

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


 <p className="register-card__login-link">
 Sudah punya akun? <Link to="/login">Masuk</Link>
 </p>
 </div>
 </div>
 </RegisterLayout>
 );
}
