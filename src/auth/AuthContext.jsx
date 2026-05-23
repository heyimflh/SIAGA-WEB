import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'siaga_auth';

const AuthContext = createContext(null);

function readSessionFromStorage() {
 if (typeof window === 'undefined' || !window.sessionStorage) {
 return null;
 }

 try {
 const raw = window.sessionStorage.getItem(STORAGE_KEY);
 if (!raw) return null;

 const parsed = JSON.parse(raw);
 if (
 parsed &&
 typeof parsed === 'object' &&
 (parsed.role === 'client' || parsed.role === 'pilot') &&
 typeof parsed.email === 'string' &&
 typeof parsed.ts === 'number'
 ) {
 return { role: parsed.role, email: parsed.email, ts: parsed.ts };
 }
 return null;
 } catch {
 return null;
 }
}

export function AuthProvider({ children }) {
 const [state, setState] = useState(() => ({ session: readSessionFromStorage() }));

 const login = useCallback(({ role, email }) => {
 const next = { role, email, ts: Date.now() };
 try {
 if (typeof window !== 'undefined' && window.sessionStorage) {
 window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
 }
 } catch {

 }
 setState({ session: next });
 }, []);

 const logout = useCallback(() => {
 try {
 if (typeof window !== 'undefined' && window.sessionStorage) {
 window.sessionStorage.removeItem(STORAGE_KEY);
 }
 } catch {

 }
 setState({ session: null });
 }, []);

 const value = useMemo(
 () => ({ session: state.session, login, logout }),
 [state.session, login, logout]
 );

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
 const ctx = useContext(AuthContext);
 if (ctx === null) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return ctx;
}

export default AuthProvider;
