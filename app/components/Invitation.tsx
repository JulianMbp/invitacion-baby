'use client';

import { motion } from 'framer-motion';
import { Baby, Heart, Sparkles } from 'lucide-react';
import { Guest } from '../lib/nocodb';

interface InvitationProps {
    guest?: Guest;
}

export default function Invitation({ guest }: InvitationProps) {
    // Función para obtener el saludo personalizado
    const getGreeting = () => {
        if (!guest) return '';
        
        const nombre = guest['Nombre Representante'];
        const integrantes = guest['N° Integrantes'] || 1;
        
        if (integrantes > 2) {
            return `${nombre} y flia`;
        } else if (integrantes === 2) {
            return `${nombre} y acompañante`;
        } else {
            return nombre;
        }
    };
    return (
        <div className="text-center space-y-10 py-12 px-4 relative">
            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-10 left-5 md:left-20 opacity-20"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <Baby className="w-12 h-12 text-pink-400" />
            </motion.div>
            <motion.div
                className="absolute top-20 right-5 md:right-20 opacity-20"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, -10, 10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            >
                <Heart className="w-10 h-10 text-blue-400" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4 relative z-10"
            >
                {guest && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-6"
                    >
                        <p className="text-lg text-slate-600 font-medium">
                            Querido{guest['N° Integrantes'] > 1 ? 's' : ''}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text mt-2">
                            {getGreeting()}
                        </h2>
                    </motion.div>
                )}
                
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="inline-block"
                >
                    <h2 className="text-sm uppercase tracking-[0.3em] text-pink-400 font-semibold mb-4 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Baby Shower
                        <Sparkles className="w-4 h-4" />
                    </h2>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight"
                >
                    Julian Bastidas<br />
                    <span className="text-4xl md:text-5xl lg:text-6xl">&</span><br />
                    Maria Fernanda Delgado
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-slate-600 max-w-lg mx-auto leading-relaxed mt-6 text-lg"
                >
                    Estamos muy emocionados de compartir la espera de nuestro bebé contigo.
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 backdrop-blur-sm p-8 rounded-3xl border-2 border-pink-200/50 shadow-xl max-w-2xl mx-auto relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl -ml-16 -mb-16" />
                
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex justify-center mb-6"
                    >
                        <div className="p-4 bg-white/80 rounded-full shadow-lg">
                            <Baby className="w-12 h-12 text-pink-400" />
                        </div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">¿Niño o Niña?</h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-600 mb-6 text-lg"
                    >
                        ¡Aún es una sorpresa!
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-6 mb-6"
                    >
                        <motion.span
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="px-6 py-3 bg-gradient-to-r from-pink-200 to-pink-300 text-pink-800 rounded-full font-semibold text-lg shadow-lg flex items-center gap-2"
                        >
                            💖 Rosa
                        </motion.span>
                        <span className="text-slate-400 font-bold text-xl">o</span>
                        <motion.span
                            whileHover={{ scale: 1.1, y: -5 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800 rounded-full font-semibold text-lg shadow-lg flex items-center gap-2"
                        >
                            💙 Azul
                        </motion.span>
                    </motion.div>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-slate-600 bg-white/60 p-4 rounded-2xl border border-pink-200/50"
                    >
                        <span className="font-bold text-pink-600">Código de vestimenta:</span> Vístete con el color que creas que será el bebé. ¡Rosa si crees que será niña, o azul si crees que será niño!
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}
