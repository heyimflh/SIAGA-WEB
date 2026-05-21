// Feature: auth-pages
// Console hygiene test for the Login flow.
// Validates: password value MUST NEVER be logged via
// console.log / console.info / console.warn / console.error during typing
// or submission of the login form.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import { AuthProvider } from '../../auth/AuthContext.jsx';

const PASSWORD = 'secret123!';
const EMAIL = 'user@example.com';

/**
 * Returns true if any argument of a console.* call, when stringified,
 * contains the password substring.
 */
const containsPassword = (call) =>
 call.some((arg) => {
 try {
 return String(arg).includes(PASSWORD);
 } catch {
 return false;
 }
 });

describe('LoginPage — console hygiene (Req 11.1)', () => {
 let logSpy;
 let infoSpy;
 let warnSpy;
 let errorSpy;
 let randomSpy;

 beforeEach(() => {
 // Spy on every console method that the form might accidentally use.
 logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
 infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
 warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
 errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

 // Force the success path (Math.random < 0.05 => failure). 0.5 picks success.
 randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
 });

 afterEach(() => {
 logSpy.mockRestore();
 infoSpy.mockRestore();
 warnSpy.mockRestore();
 errorSpy.mockRestore();
 randomSpy.mockRestore();
 });

 it('does not log the password during typing or submit', async () => {
 render(
 <MemoryRouter initialEntries={['/login']}>
 <AuthProvider>
 <LoginPage />
 </AuthProvider>
 </MemoryRouter>
 );

 const emailInput = screen.getByLabelText(/email/i);
 const passwordInput = screen.getByLabelText('Password');
 const submitBtn = screen.getByRole('button', { name: /masuk/i });

 // Type credentials. fireEvent.change fires a single change event per call,
 // which is enough to exercise the controlled-component handler that owns
 // the password value (Req 11.1's primary risk surface).
 fireEvent.change(emailInput, { target: { value: EMAIL } });
 fireEvent.change(passwordInput, { target: { value: PASSWORD } });

 // Trigger submit. We do not need to wait for the full 800ms mock delay —
 // any synchronous logging during typing or click handling will already
 // have happened by the time control returns from fireEvent.click.
 await act(async () => {
 fireEvent.click(submitBtn);
 });

 const allSpies = [
 ['console.log', logSpy],
 ['console.info', infoSpy],
 ['console.warn', warnSpy],
 ['console.error', errorSpy],
 ];

 for (const [label, spy] of allSpies) {
 const offendingCalls = spy.mock.calls.filter(containsPassword);
 expect(
 offendingCalls,
 `${label} was called with an argument containing the password "${PASSWORD}"`
 ).toEqual([]);
 }
 });
});
