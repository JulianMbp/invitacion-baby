'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Sparkles, X } from 'lucide-react';
import { ReactNode } from 'react';
import { TeamStatus } from '../lib/constants';

interface TeamModalProps {
    show: boolean;
    team: TeamStatus.PINK | TeamStatus.BLUE;
    onClose: () => void;
}

export default function TeamModal({ show, team, onClose }: TeamModalProps) {
    const teamData: {
        [key: number]: {
            title: string;
            emoji: string;
            icon: typeof Crown;
            gradient: string;
            bgGradient: string;
            borderColor: string;
            textColor: string;
            shadowColor: string;
            bgBlob1: string;
            bgBlob2: string;
            particleColor: string;
            legend: ReactNode;
        }
    } = {
        [TeamStatus.PINK]: {
            title: '¡Elegiste Team Rosa!',
            emoji: '👸',
            icon: Crown,
            gradient: 'from-pink-400 to-pink-600',
            bgGradient: 'from-pink-50 to-pink-100',
            borderColor: 'border-pink-200',
            textColor: 'text-pink-600',
            shadowColor: 'shadow-pink-200/50',
            bgBlob1: 'bg-pink-200/30',
            bgBlob2: 'bg-pink-300/20',
            particleColor: 'bg-pink-300',
            legend: (
                <>
                    <p className="text-base md:text-xl font-bold text-pink-700 mb-3 md:mb-4">
                        👸 Una Princesa con su Corona 👑
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-lg">
                        ¡Qué elección tan dulce! Has elegido el <span className="font-bold text-pink-600">Team Rosa</span>, 
                        donde las princesas brillan con su corona y el amor se llena de ternura. 
                        Tu intuición te lleva hacia la magia de una pequeña que llegará a conquistar el mundo 
                        con su sonrisa y su dulzura. 
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-lg mt-3 md:mt-4">
                        🌸 ¡Prepárate para celebrar la llegada de nuestra pequeña reina! 👑
                    </p>
                </>
            ),
        },
        [TeamStatus.BLUE]: {
            title: '¡Elegiste Team Azul!',
            emoji: '🤴',
            icon: Sparkles,
            gradient: 'from-blue-400 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-600',
            shadowColor: 'shadow-blue-200/50',
            bgBlob1: 'bg-blue-200/30',
            bgBlob2: 'bg-blue-300/20',
            particleColor: 'bg-blue-300',
            legend: (
                <>
                    <p className="text-base md:text-xl font-bold text-blue-700 mb-3 md:mb-4">
                        🤴 Un Príncipe con su Corona 👑
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-lg">
                        ¡Excelente elección! Has elegido el <span className="font-bold text-blue-600">Team Azul</span>, 
                        donde los príncipes valientes brillan con su corona y la aventura espera. 
                        Tu intuición te lleva hacia la energía de un pequeño que llegará a conquistar el mundo 
                        con su valentía y su sonrisa. 
                    </p>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-lg mt-3 md:mt-4">
                        💙 ¡Prepárate para celebrar la llegada de nuestro pequeño rey! 👑
                    </p>
                </>
            ),
        },
    };

    const data = teamData[team];
    const IconComponent = data.icon;

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Overlay con blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`relative bg-gradient-to-br ${data.bgGradient} rounded-2xl md:rounded-3xl shadow-2xl ${data.shadowColor} border-2 md:border-4 ${data.borderColor} max-w-lg w-full p-4 md:p-8 my-auto overflow-hidden`}>
                            {/* Decoraciones de fondo */}
                            <div className={`absolute -top-20 -right-20 w-64 h-64 ${data.bgBlob1} rounded-full blur-3xl`} />
                            <div className={`absolute -bottom-20 -left-20 w-64 h-64 ${data.bgBlob2} rounded-full blur-3xl`} />
                            
                            {/* Botón de cerrar */}
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className={`absolute top-2 right-2 md:top-4 md:right-4 ${data.textColor} hover:opacity-80 transition-colors z-10`}
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.button>

                            <div className="relative z-10">
                                {/* Icono animado */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                    className="flex justify-center mb-3 md:mb-6"
                                >
                                    <div className={`bg-gradient-to-br ${data.gradient} p-3 md:p-6 rounded-full shadow-lg`}>
                                        <motion.div
                                            animate={{
                                                rotate: [0, 10, -10, 0],
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            <IconComponent className="w-10 h-10 md:w-16 md:h-16 text-white" />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Emoji grande */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: 'spring' }}
                                    className="text-center mb-2 md:mb-4"
                                >
                                    <span className="text-4xl md:text-6xl">{data.emoji}</span>
                                </motion.div>

                                {/* Título */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className={`text-xl md:text-3xl font-bold ${data.textColor} text-center mb-3 md:mb-6`}
                                >
                                    {data.title}
                                </motion.h2>

                                {/* Leyenda */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-white/50 shadow-lg"
                                >
                                    {data.legend}
                                </motion.div>

                                {/* Botón de cerrar */}
                                <motion.button
                                    onClick={onClose}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-full mt-4 md:mt-6 bg-gradient-to-r ${data.gradient} text-white font-bold py-3 md:py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all text-base md:text-lg`}
                                >
                                    ¡Perfecto! 👏
                                </motion.button>
                            </div>

                            {/* Partículas decorativas */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`absolute w-2 h-2 ${data.particleColor} rounded-full`}
                                        style={{
                                            left: `${20 + i * 15}%`,
                                            top: `${10 + (i % 2) * 80}%`,
                                        }}
                                        animate={{
                                            y: [0, -20, 0],
                                            opacity: [0.3, 0.8, 0.3],
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 2 + i * 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

