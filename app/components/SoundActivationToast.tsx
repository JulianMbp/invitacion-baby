'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Music, X } from 'lucide-react';

interface SoundActivationToastProps {
  show: boolean;
  onActivate: () => void;
  onDismiss?: () => void;
}

export default function SoundActivationToast({
  show,
  onActivate,
  onDismiss,
}: SoundActivationToastProps) {
  const handleActivate = () => {
    onActivate();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: 100 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-6 right-6 z-[100] max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-pink-100 p-4 flex items-center gap-4">
            {/* Icono animado */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex-shrink-0 bg-gradient-to-br from-pink-100 to-blue-100 p-3 rounded-full"
            >
              <Music className="w-6 h-6 text-pink-500" />
            </motion.div>

            {/* Contenido */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-700 text-sm mb-1">
                🎵 Música para ti
              </h3>
              <p className="text-slate-500 text-xs mb-3">
                Haz clic para activar la música de fondo
              </p>

              <motion.button
                onClick={handleActivate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md hover:shadow-lg transition-all"
              >
                Activar Sonido
              </motion.button>
            </div>

            {/* Botón de cerrar (opcional) */}
            {onDismiss && (
              <motion.button
                onClick={onDismiss}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Pulso animado de fondo */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-200 to-blue-200 -z-10"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

