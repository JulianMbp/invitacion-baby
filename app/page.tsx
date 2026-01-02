'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import AudioPlayer, { AudioPlayerControls } from './components/AudioPlayer';
import GiftRegistry from './components/GiftRegistry';
import GiftsInfo from './components/GiftsInfo';
import { Bottle, Pacifier, Rattle, ToyBlock } from './components/icons/BabyIcons';
import Invitation from './components/Invitation';
import InvitationCard from './components/InvitationCard';
import Login from './components/Login';
import MuteButton from './components/MuteButton';
import RSVP from './components/RSVP';
import SoundActivationToast from './components/SoundActivationToast';
import { AUDIO_FILE_PATH, ConfirmationStatus, EVENT_INFO } from './lib/constants';
import { Guest } from './lib/nocodb';

export default function Home() {
  const [user, setUser] = useState<Guest | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSoundToast, setShowSoundToast] = useState(true);
  const playerRef = useRef<AudioPlayerControls>(null);

  const handleActivateSound = () => {
    setIsPlaying(true);
    setIsMuted(false); // Asegurar que no esté muteado
    setShowSoundToast(false);
    
    // Forzar unmute y play después de un momento
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.unmute();
        playerRef.current.play();
      }
    }, 500);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Floating icons configuration
  const floatingIcons = [
    { Icon: Bottle, color: "text-blue-200", delay: 0, x: "5%", y: "15%", size: 10 },
    { Icon: Pacifier, color: "text-pink-200", delay: 2, x: "85%", y: "25%", size: 12 },
    { Icon: Rattle, color: "text-purple-200", delay: 1, x: "15%", y: "65%", size: 14 },
    { Icon: ToyBlock, color: "text-yellow-200", delay: 3, x: "80%", y: "80%", size: 11 },
    { Icon: Sparkles, color: "text-green-200", delay: 4, x: "50%", y: "50%", size: 8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative overflow-hidden font-sans">
      {/* Notificación para activar sonido */}
      <SoundActivationToast
        show={showSoundToast}
        onActivate={handleActivateSound}
        onDismiss={() => setShowSoundToast(false)}
      />
      
      {/* Reproductor de audio MP3 (oculto) */}
      <AudioPlayer ref={playerRef} isMuted={isMuted} isPlaying={isPlaying} audioSrc={AUDIO_FILE_PATH} />
      
      {/* Botón de mute flotante */}
      <MuteButton isMuted={isMuted} onToggleMute={() => setIsMuted(!isMuted)} />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingIcons.map((item, index) => (
            <motion.div
                key={index}
                className={`absolute ${item.color}`}
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item.delay
                }}
                style={{ 
                    left: item.x, 
                    top: item.y,
                    width: `${item.size * 4}px`,
                    height: `${item.size * 4}px`
                }}
            >
                <item.Icon className="w-full h-full opacity-30" />
            </motion.div>
        ))}
        
        {/* Soft blurs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.5),transparent)] pointer-events-none" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-6xl mx-auto pb-20"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 flex justify-between items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-pink-100"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="font-bold text-sm text-slate-600 tracking-wide uppercase">Baby Shower</span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUser(null)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-slate-500 hover:text-pink-500 transition-all shadow-sm hover:shadow-md text-sm font-bold border-2 border-slate-100 hover:border-pink-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </motion.button>
          </motion.div>

          {/* Invitación inicial con nombres (siempre visible) */}
          <Invitation guest={user} />
          
          {/* Card de Invitación */}
          <div className="px-4 mb-16">
             <InvitationCard 
                fecha={EVENT_INFO.fecha}
                hora={EVENT_INFO.hora}
                lugar={EVENT_INFO.lugar}
                direccion={EVENT_INFO.direccion}
                guest={user}
              />
          </div>

          <div className="px-4 space-y-20">
            <RSVP
              guest={user}
              onUpdate={setUser}
            />

            <AnimatePresence>
              {user.confirmacion === ConfirmationStatus.CONFIRMED && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-16"
                >

                  {/* Divider decorativo */}
                  <div className="flex items-center justify-center gap-4 opacity-50">
                    <div className="h-px bg-pink-200 w-20 rounded-full" />
                    <ToyBlock className="w-6 h-6 text-purple-300" />
                    <div className="h-px bg-blue-200 w-20 rounded-full" />
                  </div>

                  {/* Aviso sobre los regalos */}
                  <GiftsInfo />

                  {/* Lista de regalos */}
                  <GiftRegistry guest={user} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
