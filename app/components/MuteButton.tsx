'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface MuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function MuteButton({ isMuted, onToggleMute }: MuteButtonProps) {
  return (
    <motion.button
      onClick={onToggleMute}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-pink-100 hover:border-pink-200 group"
      aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
    >
      <motion.div
        animate={{ rotate: isMuted ? 0 : 360 }}
        transition={{ duration: 0.3 }}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-slate-500 group-hover:text-pink-400 transition-colors" />
        ) : (
          <Volume2 className="w-5 h-5 text-pink-400 group-hover:text-pink-500 transition-colors" />
        )}
      </motion.div>

      {/* Indicador visual de ondas de sonido cuando está activo */}
      {!isMuted && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-pink-200"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}

