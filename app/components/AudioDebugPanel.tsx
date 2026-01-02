'use client';

import { motion } from 'framer-motion';
import { PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react';

interface AudioDebugPanelProps {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}

export default function AudioDebugPanel({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
}: AudioDebugPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 z-50 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border-2 border-pink-100 max-w-xs"
    >
      <h3 className="font-bold text-sm text-slate-700 mb-3">
        🔧 Panel de Audio
      </h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Estado:</span>
          <span className={`font-bold ${isPlaying ? 'text-green-600' : 'text-orange-600'}`}>
            {isPlaying ? '▶️ Reproduciendo' : '⏸️ Pausado'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Audio:</span>
          <span className={`font-bold ${isMuted ? 'text-red-600' : 'text-green-600'}`}>
            {isMuted ? '🔇 Muteado' : '🔊 Activo'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600">Volumen:</span>
          <span className="font-bold text-blue-600">70%</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <motion.button
          onClick={onTogglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold py-2 px-3 rounded-lg text-xs"
        >
          {isPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          {isPlaying ? 'Pausar' : 'Reproducir'}
        </motion.button>
        
        <motion.button
          onClick={onToggleMute}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-2 px-3 rounded-lg text-xs ${
            isMuted 
              ? 'bg-red-100 text-red-600 border-2 border-red-300' 
              : 'bg-green-100 text-green-600 border-2 border-green-300'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isMuted ? 'Unmute' : 'Mute'}
        </motion.button>
      </div>

      <p className="mt-3 text-xs text-slate-500 italic">
        💡 Verifica el volumen de tu sistema y que el navegador no esté muteando el sitio
      </p>
    </motion.div>
  );
}

