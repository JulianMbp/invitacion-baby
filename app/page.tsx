'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { useState } from 'react';
import GiftRegistry from './components/GiftRegistry';
import GiftsInfo from './components/GiftsInfo';
import Invitation from './components/Invitation';
import InvitationCard from './components/InvitationCard';
import Login from './components/Login';
import RSVP from './components/RSVP';
import { EVENT_INFO } from './lib/constants';
import { Guest } from './lib/nocodb';

export default function Home() {
  const [user, setUser] = useState<Guest | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
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
              className="flex items-center gap-2 text-pink-600"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold text-sm">Baby Shower</span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUser(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white transition-all shadow-md hover:shadow-lg text-sm font-medium border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </motion.button>
          </motion.div>

          {/* Invitación inicial con nombres (siempre visible) */}
          <Invitation />
                            {/* Card de Invitación */}
                            <InvitationCard 
                    fecha={EVENT_INFO.fecha}
                    hora={EVENT_INFO.hora}
                    lugar={EVENT_INFO.lugar}
                    direccion={EVENT_INFO.direccion}
                  />

          <div className="mt-8 px-4">
            <RSVP
              guest={user}
              onUpdate={setUser}
            />

            <AnimatePresence>
              {(user.Confirmado || user.confirmacion) && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-12 mt-12"
                >

                  {/* Divider decorativo */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="border-t-2 border-gradient-to-r from-pink-200 via-purple-200 to-blue-200 w-32 mx-auto relative"
                  >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-100 to-blue-100 px-4 py-2 rounded-full border-2 border-pink-200">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>
                  </motion.div>

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
