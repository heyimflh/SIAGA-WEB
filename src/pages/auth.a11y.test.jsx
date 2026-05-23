import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);

import { AuthProvider } from '../auth/AuthContext.jsx';

vi.mock('../components/AuthDroneScene', () => ({
 default: () => null,
 AuthDroneErrorBoundary: ({ children }) => children,
}));

import LoginPage from './LoginPage/LoginPage.jsx';
import RoleSelector from './RegisterPage/RoleSelector.jsx';
import DataEntryForm from './RegisterPage/DataEntryForm.jsx';
import VerificationStep from './RegisterPage/VerificationStep.jsx';
import { initialRegisterState } from './RegisterPage/registerReducer.js';

function renderWithProviders(ui, { initialEntries = ['/'] } = {}) {
 return render(
 <MemoryRouter initialEntries={initialEntries}>
 <AuthProvider>{ui}</AuthProvider>
 </MemoryRouter>,
 );
}

function buildRegisterState({ step, role, overrides = {} }) {
 return {
 ...initialRegisterState,
 step,
 role,
 ...overrides,
 };
}

describe('auth-pages a11y (vitest-axe)', () => {
 it('LoginPage with default role has no axe violations', async () => {
 const { container } = renderWithProviders(<LoginPage />);
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });

 it('RegisterPage Step 1 (RoleSelector) has no axe violations', async () => {
 const state = buildRegisterState({ step: 1, role: null });
 const { container } = renderWithProviders(
 <RoleSelector state={state} dispatch={() => {}} />,
 );
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });

 it('RegisterPage Step 2 (client DataEntryForm) has no axe violations', async () => {
 const state = buildRegisterState({ step: 2, role: 'client' });
 const { container } = renderWithProviders(
 <DataEntryForm state={state} dispatch={() => {}} />,
 );
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });

 it('RegisterPage Step 2 (pilot DataEntryForm) has no axe violations', async () => {
 const state = buildRegisterState({ step: 2, role: 'pilot' });
 const { container } = renderWithProviders(
 <DataEntryForm state={state} dispatch={() => {}} />,
 );
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });

 it('RegisterPage Step 3 (client VerificationStep) has no axe violations', async () => {

 const state = buildRegisterState({
 step: 3,
 role: 'client',
 overrides: {
 client: {
 companyName: 'PT Contoh',
 corporateEmail: 'ops@contoh.co.id',
 phone: '+62 812 3456 7890',
 password: 'password123',
 confirmPassword: 'password123',
 },
 },
 });
 const { container } = renderWithProviders(
 <VerificationStep state={state} dispatch={() => {}} />,
 );
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });

 it('RegisterPage Step 3 (pilot VerificationStep, terms accepted, no file) has no axe violations', async () => {

 const state = buildRegisterState({
 step: 3,
 role: 'pilot',
 overrides: {
 pilot: {
 fullName: 'Budi Santoso',
 email: 'budi@pilot.id',
 phone: '+62 812 0000 1111',
 password: 'password123',
 confirmPassword: 'password123',
 },
 termsAccepted: true,
 },
 });
 const { container } = renderWithProviders(
 <VerificationStep state={state} dispatch={() => {}} />,
 );
 const results = await axe(container);
 expect(results).toHaveNoViolations();
 });
});
