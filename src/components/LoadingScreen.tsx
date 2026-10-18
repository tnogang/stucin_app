import { motion } from 'framer-motion';
import logoAsistenca from '@/assets/logo-asistenca.png';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.img
          src={logoAsistenca}
          alt="Štucin"
          className="h-16 md:h-20 w-auto object-contain"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
        />
        <motion.div
          className="w-32 h-1 bg-muted rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
