export function safeReadLocalStorage(key) {
 if (typeof window === 'undefined' || !window.localStorage) {
 return null;
 }

 try {
 const raw = window.localStorage.getItem(key);
 return raw ?? null;
 } catch {

 return null;
 }
}

export function safeWriteLocalStorage(key, value) {
 if (typeof window === 'undefined' || !window.localStorage) {

 return;
 }

 try {
 window.localStorage.setItem(key, value);
 } catch (err) {

 console.warn('[siaga] safeWriteLocalStorage failed', { key, err });
 }
}
