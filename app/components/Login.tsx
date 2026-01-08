'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Baby, Cloud, Star } from 'lucide-react';
import { useState } from 'react';
import { getGuestById, Guest } from '../lib/nocodb';
import { Bottle, Pacifier, Rattle, ToyBlock } from './icons/BabyIcons';

interface LoginProps {
    onLogin: (guest: Guest) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const guest = await getGuestById(id);
            if (guest && guest.Id) {
                onLogin(guest);
            } else {
                setError('No encontramos una invitación con ese ID. Por favor verifica e intenta de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error al intentar ingresar. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };

    // Configuration for floating icons background
    const floatingIcons = [
        { Icon: Baby, color: "text-pink-300", delay: 0, x: "10%", y: "20%" },
        { Icon: Bottle, color: "text-blue-300", delay: 2, x: "80%", y: "15%" },
        { Icon: Cloud, color: "text-purple-200", delay: 1, x: "20%", y: "80%" },
        { Icon: Star, color: "text-yellow-300", delay: 3, x: "70%", y: "70%" },
        { Icon: Pacifier, color: "text-green-300", delay: 4, x: "15%", y: "50%" },
        { Icon: Rattle, color: "text-orange-300", delay: 5, x: "85%", y: "40%" },
        { Icon: ToyBlock, color: "text-red-200", delay: 6, x: "50%", y: "10%" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 relative overflow-hidden font-sans">
            {/* Floating Background Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingIcons.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`absolute ${item.color}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.4, 0.7, 0.4],
                            scale: [1, 1.2, 1],
                            y: [0, -20, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "easeInOut"
                        }}
                        style={{ left: item.x, top: item.y }}
                    >
                        <item.Icon className="w-12 h-12 md:w-20 md:h-20 opacity-50" />
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-md text-center relative z-10 border-4 border-white"
            >
                {/* Decorative top icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-6 -mt-16"
                >
                    <div className="bg-white p-4 rounded-full shadow-lg border-4 border-pink-100">
                        <Baby className="w-16 h-16 text-pink-400" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold text-slate-700 mb-2 tracking-tight"
                >
                    ¡Hola Bebé!
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-500 mb-8 text-lg font-medium"
                >
                    Ingresa el código mágico de tu invitación
                </motion.p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={id}
                            onChange={(e) => setId(e.target.value.replace(/\D/g, ''))}
                            placeholder="Tu código único de invitación"
                            className="w-full px-6 py-4 rounded-full border-2 border-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-50 outline-none transition-all text-center text-xl text-slate-700 placeholder:text-slate-400 font-bold bg-pink-50/50"
                            required
                        />
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="text-red-400 text-sm bg-red-50 px-4 py-2 rounded-2xl border border-red-100 font-medium"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        className="w-full bg-gradient-to-r from-pink-300 to-blue-300 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-pink-200/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Abriendo...
                                </>
                            ) : (
                                <>
                                    <Star className="w-5 h-5 fill-current" />
                                    Ver Invitación
                                </>
                            )}
                        </span>
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
