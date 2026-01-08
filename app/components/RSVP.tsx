'use client';

import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Calendar, Check, Clock, Heart, X } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationStatus } from '../lib/constants';
import { Guest, confirmGuestAttendance } from '../lib/nocodb';

interface RSVPProps {
    guest: Guest;
    onUpdate: (updatedGuest: Guest) => void;
}

export default function RSVP({ guest, onUpdate }: RSVPProps) {
    const [loading, setLoading] = useState(false);
    const [selectingIntegrantes, setSelectingIntegrantes] = useState(false);

    const handleConfirm = async (status: ConfirmationStatus, integrantesConfirmados?: number) => {
        setLoading(true);
        try {
            await confirmGuestAttendance(guest.Id, status, integrantesConfirmados);
            const updatedGuest = {
                ...guest,
                confirmacion: status, // Update confirmacion field with enum value
                'N° de Integrantes confirmados': integrantesConfirmados,
            };
            onUpdate(updatedGuest);

            if (status === ConfirmationStatus.CONFIRMED) {
                // Enhanced confetti
                const count = 200;
                const defaults = {
                    origin: { y: 0.7 },
                    colors: ['#f9a8d4', '#93c5fd', '#fcd34d', '#a78bfa', '#fb7185'],
                };

                function fire(particleRatio: number, opts: any) {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio),
                    });
                }

                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            }
        } catch (error) {
            console.error(error);
            alert('Hubo un problema al actualizar tu asistencia. Intenta de nuevo.');
        } finally {
            setLoading(false);
            setSelectingIntegrantes(false);
        }
    };

    const handleSelectIntegrantes = (numIntegrantes: number) => {
        handleConfirm(ConfirmationStatus.CONFIRMED, numIntegrantes);
    };

    const numIntegrantes = guest['N° Integrantes'] || 1;
    
    // Check confirmation status: 1=Pending, 2=Confirmed, 3=Declined
    const confirmationStatus = guest.confirmacion;

    // If status is CONFIRMED (2) or DECLINED (3), show the result message
    if (confirmationStatus === ConfirmationStatus.CONFIRMED || confirmationStatus === ConfirmationStatus.DECLINED) {
        const isConfirmed = confirmationStatus === ConfirmationStatus.CONFIRMED;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className={`bg-white p-10 rounded-[2.5rem] border-4 shadow-xl text-center max-w-lg mx-auto relative overflow-hidden ${
                    isConfirmed ? 'border-green-100' : 'border-slate-100'
                }`}
            >
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-20 -mt-20 ${
                    isConfirmed ? 'bg-green-50' : 'bg-slate-50'
                }`} />
                
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        {isConfirmed ? (
                            <div className="p-6 bg-green-50 rounded-full border-2 border-green-100">
                                <Check className="w-12 h-12 text-green-500" />
                            </div>
                        ) : (
                            <div className="p-6 bg-slate-50 rounded-full border-2 border-slate-100">
                                <Heart className="w-12 h-12 text-slate-400" />
                            </div>
                        )}
                    </motion.div>
                    
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-2xl font-bold mb-3 ${
                            isConfirmed ? 'text-green-600' : 'text-slate-500'
                        }`}
                    >
                        {isConfirmed ? '¡Qué alegría! 🎉' : '¡Oh no!'}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-500 mb-8 text-lg"
                    >
                        {isConfirmed
                            ? 'Ya te anotamos en la lista. ¡Nos vemos pronto!'
                            : 'Entendemos, te extrañaremos mucho.'}
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            onUpdate({ 
                                ...guest, 
                                confirmacion: ConfirmationStatus.PENDING,
                                'N° de Integrantes confirmados': undefined 
                            });
                            setSelectingIntegrantes(false);
                        }}
                        className="text-sm text-slate-400 hover:text-slate-600 underline font-bold transition-colors"
                    >
                        Cambiar mi respuesta
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-2xl mx-auto text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-50 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mb-32" />
            
            <div className="relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-8"
                >
                    <div className="p-6 bg-white rounded-full shadow-lg border-2 border-purple-50">
                        <Calendar className="w-12 h-12 text-purple-400" />
                    </div>
                </motion.div>
                
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-slate-700 mb-4"
                >
                    Confirmar Asistencia
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 mb-6 text-xl"
                >
                    ¿Podrás acompañarnos en este día especial?
                </motion.p>

                {/* Fecha límite de confirmación */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-10 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <Clock className="w-6 h-6 text-amber-600" />
                        <h4 className="text-lg font-bold text-amber-800 uppercase tracking-wide">
                            Fecha Límite
                        </h4>
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-amber-700 mb-2">
                        24 de Enero de 2026
                    </p>
                    <p className="text-sm text-amber-600 font-semibold">
                        Por favor confirma tu asistencia antes de esta fecha
                    </p>
                </motion.div>

                {!selectingIntegrantes ? (
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <motion.button
                            onClick={() => {
                                if (numIntegrantes > 1) {
                                    setSelectingIntegrantes(true);
                                } else {
                                    handleConfirm(ConfirmationStatus.CONFIRMED, 1);
                                }
                            }}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05, y: -2 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                            <motion.span
                                className="relative z-10 flex items-center gap-3"
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
                                        Confirmando...
                                    </>
                                ) : (
                                    <>
                                        <Check size={24} strokeWidth={3} />
                                        <span>¡Sí, asistiré!</span>
                                    </>
                                )}
                            </motion.span>
                        </motion.button>
                        
                        <motion.button
                            onClick={() => handleConfirm(ConfirmationStatus.DECLINED)}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05, y: -2 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                            className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-500 py-5 px-8 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={24} strokeWidth={3} />
                            <span>No podré</span>
                        </motion.button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-600 text-xl font-medium mb-6"
                        >
                            ¿Cuántas personas asistirán?
                        </motion.p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Array.from({ length: numIntegrantes }, (_, i) => i + 1).map((num) => (
                                <motion.button
                                    key={num}
                                    onClick={() => handleSelectIntegrantes(num)}
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.05, y: -4 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                    className="bg-white border-2 border-pink-100 text-pink-500 hover:bg-pink-50 hover:border-pink-300 py-6 px-6 rounded-3xl font-black text-2xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="relative z-10"
                                        animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                                        transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
                                    >
                                        {num}
                                    </motion.span>
                                </motion.button>
                            ))}
                        </div>
                        <motion.button
                            onClick={() => setSelectingIntegrantes(false)}
                            disabled={loading}
                            className="w-full text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors disabled:opacity-50 uppercase tracking-wide"
                        >
                            ← Volver atrás
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
