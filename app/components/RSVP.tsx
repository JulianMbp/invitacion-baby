'use client';

import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Calendar, Check, Heart, X } from 'lucide-react';
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
                className={`bg-gradient-to-br ${
                    isConfirmed
                        ? 'from-green-50 via-emerald-50 to-teal-50 border-green-200'
                        : 'from-slate-50 via-gray-50 to-slate-50 border-slate-200'
                } p-8 rounded-3xl border-2 shadow-xl text-center max-w-lg mx-auto relative overflow-hidden`}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-4"
                    >
                        {isConfirmed ? (
                            <div className="p-4 bg-green-100 rounded-full">
                                <Check className="w-12 h-12 text-green-600" />
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-100 rounded-full">
                                <Heart className="w-12 h-12 text-slate-400" />
                            </div>
                        )}
                    </motion.div>
                    
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-2xl font-bold mb-3 ${
                            isConfirmed ? 'text-green-700' : 'text-slate-600'
                        }`}
                    >
                        {isConfirmed ? '¡Genial! Contamos contigo 🎉' : 'Lamentamos que no puedas asistir'}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-600 mb-6"
                    >
                        {isConfirmed
                            ? 'Gracias por confirmar tu asistencia. ¡Nos vemos pronto!'
                            : 'Gracias por avisarnos. Te extrañaremos.'}
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
                        className="text-sm text-slate-500 hover:text-slate-700 underline font-medium transition-colors"
                    >
                        Cambiar respuesta
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
            className="bg-gradient-to-br from-white via-pink-50/30 to-blue-50/30 p-8 md:p-10 rounded-3xl border-2 border-pink-200/50 shadow-2xl max-w-2xl mx-auto text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl -ml-20 -mt-20" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl -mr-20 -mb-20" />
            
            <div className="relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-4 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full shadow-lg">
                        <Calendar className="w-10 h-10 text-purple-500" />
                    </div>
                </motion.div>
                
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
                >
                    Confirmar Asistencia
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 mb-10 text-lg"
                >
                    ¿Podrás acompañarnos en este día especial?
                </motion.p>

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
                            className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
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
                                        <Check size={22} />
                                        <span>¡Sí, asistiré!</span>
                                    </>
                                )}
                            </motion.span>
                            {!loading && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    initial={false}
                                />
                            )}
                        </motion.button>
                        
                        <motion.button
                            onClick={() => handleConfirm(ConfirmationStatus.DECLINED)}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05, y: -2 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                            className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-slate-300 text-slate-600 py-4 px-8 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={22} />
                            <span>No podré</span>
                        </motion.button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-700 text-lg font-medium mb-6"
                        >
                            ¿Cuántos integrantes de tu familia asistirán?
                        </motion.p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Array.from({ length: numIntegrantes }, (_, i) => i + 1).map((num) => (
                                <motion.button
                                    key={num}
                                    onClick={() => handleSelectIntegrantes(num)}
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.05, y: -2 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                    className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white py-4 px-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                >
                                    <motion.span
                                        className="relative z-10"
                                        animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                                        transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
                                    >
                                        {num}
                                    </motion.span>
                                    {!loading && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            initial={false}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                        <motion.button
                            onClick={() => setSelectingIntegrantes(false)}
                            disabled={loading}
                            className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            ← Volver
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
