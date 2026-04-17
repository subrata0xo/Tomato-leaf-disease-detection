import { motion } from 'framer-motion';

export default function ScanningBeam() {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none rounded-[1.5rem]">
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_25px_var(--primary)]"
      />
      <div className="absolute inset-0 bg-primary/5 animate-pulse" />
    </div>
  );
}
