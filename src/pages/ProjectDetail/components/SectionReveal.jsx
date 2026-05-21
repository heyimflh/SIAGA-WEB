/**
 * SectionReveal — Reusable Framer Motion reveal wrapper.
 * Provides a subtle fade + upward slide animation when sections
 * enter the viewport. Respects prefers-reduced-motion.
 *
 * Feature: project-detail-page
 */
import { motion } from 'framer-motion';

const variants = {
 hidden: { opacity: 0, y: 32 },
 visible: {
 opacity: 1,
 y: 0,
 transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
 },
};

const reducedMotionVariants = {
 hidden: { opacity: 1, y: 0 },
 visible: { opacity: 1, y: 0 },
};

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.delay=0] - Delay in seconds before animation starts
 * @param {string} [props.className] - Optional className to pass through
 */
export default function SectionReveal({ children, delay = 0, className = '' }) {
 // Check for reduced motion preference
 const prefersReduced =
 typeof window !== 'undefined' &&
 window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

 return (
 <motion.div
 className={className}
 variants={prefersReduced ? reducedMotionVariants : variants}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true, margin: '-60px' }}
 transition={{ delay }}
 >
 {children}
 </motion.div>
 );
}
