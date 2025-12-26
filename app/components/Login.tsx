'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { getGuestById, Guest } from '../lib/nocodb';

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl"
                    animate={{
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10 border border-white/50"
            >
                {/* Decorative elements */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex justify-center mb-4"
                >
                    <div className="relative">
                        <Gift className="w-16 h-16 text-pink-400" />
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3"
                >
                    ¡Bienvenido!
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-600 mb-8 text-lg"
                >
                    Ingresa el código de tu invitación
                </motion.p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <input
                            type="number"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Tu código aquí"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-center text-xl text-slate-900 placeholder:text-slate-500 font-medium bg-white/50 backdrop-blur-sm"
                            required
                        />
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-red-400 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg relative overflow-hidden group"
                    >
                        <motion.span
                            className="relative z-10 flex items-center justify-center gap-2"
                            animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                            transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Ver Invitación
                                </>
                            )}
                        </motion.span>
                        {!loading && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                            />
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
