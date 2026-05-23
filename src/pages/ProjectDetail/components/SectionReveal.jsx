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

export default function SectionReveal({ children, delay = 0, className = '' }) {

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
