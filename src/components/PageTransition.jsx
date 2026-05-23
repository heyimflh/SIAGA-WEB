import { motion } from 'framer-motion';

const variants = {
 initial: { opacity: 0, y: 24 },
 animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
 exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

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
