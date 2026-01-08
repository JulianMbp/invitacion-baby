'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import { TeamStatus } from '../lib/constants';
import { Guest, updateGuestTeam } from '../lib/nocodb';
import TeamModal from './TeamModal';
import { Bottle, Pacifier } from './icons/BabyIcons';

interface InvitationProps {
    guest?: Guest;
    onUpdate?: (updatedGuest: Guest) => void;
}

export default function Invitation({ guest, onUpdate }: InvitationProps) {
    const [showModal, setShowModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<TeamStatus.PINK | TeamStatus.BLUE | null>(null);
    const [loading, setLoading] = useState(false);
    // Función para obtener el título según el género
    const getTitulo = () => {
        if (!guest) return '';
        
        // Intentar diferentes variaciones del nombre del campo
        const guestWithAny = guest as Guest & Record<string, unknown>;
        const genero = guestWithAny['# genero'] || 
                      guestWithAny['#genero'] || 
                      guestWithAny['genero'] ||
                      guestWithAny['Genero'] ||
                      guestWithAny['Género'];
        
        // Log para debuggear
        if (process.env.NODE_ENV === 'development') {
            console.log('Guest object:', guest);
            console.log('Género encontrado:', genero);
        }
        
        // Convertir a número si viene como string
        const generoNum = typeof genero === 'string' ? parseInt(genero, 10) : genero;
        
        // 1 = Masculino (Sr.), 2 = Femenino (Sra.)
        if (generoNum === 1) return 'Sr.';
        if (generoNum === 2) return 'Sra.';
        return ''; // Si no hay género definido, no mostrar título
    };

    // Función para obtener el saludo personalizado
    const getGreeting = () => {
        if (!guest) return '';
        
        const nombre = guest['Nombre Representante'];
        const integrantes = guest['N° Integrantes'] || 1;
        const titulo = getTitulo();
        const nombreConTitulo = titulo ? `${titulo} ${nombre}` : nombre;
        
        if (integrantes > 2) {
            return `${nombreConTitulo} y familia`;
        } else if (integrantes === 2) {
            return `${nombreConTitulo} y acompañante`;
        } else {
            return nombreConTitulo;
        }
    };

    const handleTeamSelect = async (team: TeamStatus.PINK | TeamStatus.BLUE) => {
        if (!guest || loading) return;
        
        setLoading(true);
        try {
            await updateGuestTeam(guest.Id, team);
            setSelectedTeam(team);
            setShowModal(true);
            
            // Actualizar el guest en el estado padre
            if (onUpdate) {
                const updatedGuest = {
                    ...guest,
                    team: team,
                };
                onUpdate(updatedGuest);
            }
        } catch (error) {
            console.error('Error al guardar el team:', error);
            alert('Hubo un problema al guardar tu elección. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (
        <div className="text-center space-y-10 py-12 px-4 relative">
            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-0 left-5 md:left-20 opacity-30"
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
                <Bottle className="w-16 h-16 text-pink-300" />
            </motion.div>
            <motion.div
                className="absolute top-10 right-5 md:right-20 opacity-30"
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
                <Pacifier className="w-14 h-14 text-blue-300" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-6 relative z-10"
            >
                {guest && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="inline-block bg-white/60 px-6 py-3 rounded-full border border-pink-100 backdrop-blur-sm shadow-sm">
                            <p className="text-lg text-slate-500 font-medium mb-1">
                                ¡Bienvenidos a nuestra celebración!
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                                {getGreeting()}
                            </h2>
                        </div>
                    </motion.div>
                )}
                
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="inline-block"
                >
                    <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-100 to-blue-100 px-5 py-2 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        <span className="text-sm uppercase tracking-[0.2em] text-slate-600 font-bold">
                            Baby Shower
                        </span>
                        <Sparkles className="w-4 h-4 text-blue-500" />
                    </div>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-700 leading-tight drop-shadow-sm"
                >
                    Julian Bastidas<br />
                    <span className="text-4xl md:text-5xl lg:text-6xl text-pink-400">&</span><br />
                    María Fernanda Delgado
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-slate-500 max-w-lg mx-auto leading-relaxed mt-6 text-xl font-medium"
                >
                    Tenemos el agrado de invitarlos a la llegada de nuestro bebé.
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] border-4 border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] max-w-3xl mx-auto relative overflow-hidden"
            >
                {/* Decorative background blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex justify-center mb-8"
                    >
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-slate-700 mb-4">¿Niño o Niña?</h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 mb-6 text-xl"
                    >
                        ¡Es una dulce sorpresa que descubriremos juntos!
                    </motion.p>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 }}
                        className="text-slate-400 mb-8 text-lg font-semibold"
                    >
                        ¡Haz clic en tu equipo favorito!
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
                    >
                        <motion.button
                            onClick={() => handleTeamSelect(TeamStatus.PINK)}
                            disabled={loading || !guest}
                            whileHover={loading || !guest ? {} : { scale: 1.05, y: -2 }}
                            whileTap={loading || !guest ? {} : { scale: 0.95 }}
                            className={`px-8 py-4 bg-pink-100 text-pink-600 rounded-3xl font-bold text-lg shadow-sm border-2 border-pink-200 flex items-center gap-3 cursor-pointer transition-all ${
                                loading || !guest ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:bg-pink-200'
                            } ${guest?.team === TeamStatus.PINK ? 'ring-4 ring-pink-300 ring-offset-2' : ''}`}
                        >
                            <span className="text-2xl">💖</span> TEAM ROSA
                        </motion.button>
                        <span className="text-slate-300 font-bold text-2xl px-2">VS</span>
                        <motion.button
                            onClick={() => handleTeamSelect(TeamStatus.BLUE)}
                            disabled={loading || !guest}
                            whileHover={loading || !guest ? {} : { scale: 1.05, y: -2 }}
                            whileTap={loading || !guest ? {} : { scale: 0.95 }}
                            className={`px-8 py-4 bg-blue-100 text-blue-600 rounded-3xl font-bold text-lg shadow-sm border-2 border-blue-200 flex items-center gap-3 cursor-pointer transition-all ${
                                loading || !guest ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:bg-blue-200'
                            } ${guest?.team === TeamStatus.BLUE ? 'ring-4 ring-blue-300 ring-offset-2' : ''}`}
                        >
                            <span className="text-2xl">💙</span> TEAM AZUL
                        </motion.button>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/90 p-6 rounded-3xl border border-slate-100 shadow-sm inline-block"
                    >
                        <p className="text-slate-600 font-medium">
                            <span className="block text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">Código de Vestimenta</span>
                            Vístete del color que creas que será nuestro bebé. ¡Hagan sus apuestas!
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Modal de Team */}
            {selectedTeam && (
                <TeamModal
                    show={showModal}
                    team={selectedTeam}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
