import { motion } from 'framer-motion';

const variants = {
 initial: { opacity: 0, y: 24 },
 animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
 exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

/**
 * PageTransition wraps page content with a Framer Motion fade + vertical slide
 * animation. Designed to be used inside an `AnimatePresence mode="wait"` so
 * route changes animate cleanly: initial fade+y:24 → animate y:0 (400ms easeOut)
 * → exit y:-16 (300ms).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content to animate.
 * @param {string} [props.routeKey] - Stable key tied to the current route so
 * AnimatePresence can detect transitions.
 */
export default function PageTransition({ children, routeKey }) {
 return (
 <motion.div
 key={routeKey}
 variants={variants}
 initial="initial"
 animate="animate"
 exit="exit"
 style={{ width: '100%', minHeight: '100%' }}
 >
 {children}
 </motion.div>
 );
}
