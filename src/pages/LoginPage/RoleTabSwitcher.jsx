import { useRef } from 'react';

/**
 * RoleTabSwitcher — Premium Segmented Control
 *
 * Props:
 * - role: 'client' | 'pilot' (controlled value)
 * - onChange: (newRole) => void
 *
 * Implements:
 * - role="tablist" container, role="tab" buttons, aria-selected
 * - Keyboard: ArrowLeft/ArrowRight cycle + activate, Enter/Space activate
 * - Animated sliding background indicator
 * - Premium glassmorphism segmented control style
 *
 * Requirements: 4.1, 4.2, 4.3, 12.5
 */

const TABS = [
 { value: 'client', label: 'Perusahaan', id: 'role-tab-client' },
 { value: 'pilot', label: 'Pilot', id: 'role-tab-pilot' },
];

export default function RoleTabSwitcher({ role = 'client', onChange }) {
 const activeIndex = TABS.findIndex((t) => t.value === role);
 const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

 const tabRefs = useRef([]);

 const activate = (index) => {
 const next = TABS[index];
 if (!next) return;
 if (next.value !== role && typeof onChange === 'function') {
 onChange(next.value);
 }
 const btn = tabRefs.current[index];
 if (btn) btn.focus();
 };

 const handleKeyDown = (e, index) => {
 switch (e.key) {
 case 'ArrowRight': {
 e.preventDefault();
 const nextIndex = (index + 1) % TABS.length;
 activate(nextIndex);
 break;
 }
 case 'ArrowLeft': {
 e.preventDefault();
 const prevIndex = (index - 1 + TABS.length) % TABS.length;
 activate(prevIndex);
 break;
 }
 case 'Home': {
 e.preventDefault();
 activate(0);
 break;
 }
 case 'End': {
 e.preventDefault();
 activate(TABS.length - 1);
 break;
 }
 case 'Enter':
 case ' ':
 case 'Spacebar': {
 e.preventDefault();
 activate(index);
 break;
 }
 default:
 break;
 }
 };

 return (
 <div
 className="role-toggle"
 role="tablist"
 aria-label="Pilih peran login"
 >
 {/* Sliding background indicator */}
 <span
 className={`role-toggle__slider${safeActiveIndex === 1 ? ' role-toggle__slider--pilot' : ''}`}
 aria-hidden="true"
 />

 {TABS.map((tab, index) => {
 const selected = index === safeActiveIndex;
 return (
 <button
 key={tab.value}
 ref={(el) => { tabRefs.current[index] = el; }}
 type="button"
 role="tab"
 id={tab.id}
 aria-selected={selected}
 tabIndex={selected ? 0 : -1}
 onClick={() => activate(index)}
 onKeyDown={(e) => handleKeyDown(e, index)}
 className={`role-toggle__btn${selected ? ' role-toggle__btn--active' : ''}`}
 >
 {tab.label}
 </button>
 );
 })}
 </div>
 );
}
