'use client';

import { motion } from 'framer-motion';
import { Baby, Calendar, Clock, Download, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { EVENT_GOOGLE_MAPS_EMBED, EVENT_GOOGLE_MAPS_LINK } from '../lib/constants';
import { Guest } from '../lib/nocodb';
import { Bottle, Pacifier, Rattle, ToyBlock } from './icons/BabyIcons';

interface InvitationCardProps {
    fecha?: string;
    hora?: string;
    lugar?: string;
    direccion?: string;
    guest?: Guest;
}

export default function InvitationCard({ 
    fecha = "Sábado, 15 de Marzo",
    hora = "3:00 PM",
    lugar = "Salón de Eventos",
    direccion = "Calle Principal 123, Ciudad",
    guest
}: InvitationCardProps) {
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
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        try {
            // ID del archivo de Google Drive
            const fileId = '19lmNDulhPeR7eKifkDpVHRo2iTckx9vT';
            
            // Enlace para abrir el PDF en Google Drive
            const driveViewUrl = `https://drive.google.com/file/d/${fileId}/view`;
            
            // Enlace para descargar el PDF directamente
            const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            // Abrir el PDF en Drive en una nueva pestaña
            window.open(driveViewUrl, '_blank');
            
            // Descargar el PDF
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'invitacion-baby-shower.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(`Hubo un error al descargar el PDF: ${errorMessage}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12 font-sans"
        >
            {/* Card de Invitación */}
            <div
                ref={cardRef}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden relative border-8 border-pink-100"
                style={{ minHeight: '600px' }}
            >
                {/* Decoraciones tipo móvil colgante */}
                <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-20">
                    <div className="absolute top-0 left-10 w-0.5 h-20 bg-pink-200">
                        <motion.div 
                            className="absolute -bottom-6 -left-3"
                            animate={{ rotate: [5, -5, 5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Bottle className="w-8 h-8 text-pink-400 fill-pink-100" />
                        </motion.div>
                    </div>
                    <div className="absolute top-0 right-10 w-0.5 h-24 bg-blue-200">
                        <motion.div 
                            className="absolute -bottom-6 -left-3"
                            animate={{ rotate: [-5, 5, -5] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <Pacifier className="w-8 h-8 text-blue-400 fill-blue-100" />
                        </motion.div>
                    </div>
                    <div className="absolute top-0 left-1/3 w-0.5 h-16 bg-purple-200">
                        <motion.div 
                            className="absolute -bottom-6 -left-3"
                            animate={{ rotate: [3, -3, 3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <Rattle className="w-8 h-8 text-purple-400 fill-purple-100" />
                        </motion.div>
                    </div>
                    <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-yellow-200">
                        <motion.div 
                            className="absolute -bottom-6 -left-3"
                            animate={{ rotate: [-3, 3, -3] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        >
                            <ToyBlock className="w-8 h-8 text-yellow-400 fill-yellow-100" />
                        </motion.div>
                    </div>
                </div>

                {/* Fondo suave con nubes */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-pink-50/50">
                    <div className="absolute inset-0 opacity-10" 
                         style={{ 
                             backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', 
                             backgroundSize: '20px 20px' 
                         }}>
                    </div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 p-8 md:p-12 pt-24">
                    
                    {/* Título */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400 font-bold">
                                ¡Estás invitado!
                            </h2>
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                        
                        {guest && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="mb-6"
                            >
                                <div className="inline-block bg-white/80 px-6 py-2 rounded-full border border-pink-100 shadow-sm mb-4">
                                    <p className="text-lg text-slate-600 font-medium">
                                        Para: <span className="text-pink-500 font-bold">{getGreeting()}</span>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                        
                        <div className="relative mb-6">
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-700 leading-tight">
                                Baby<br/>Shower
                            </h1>
                            <div className="absolute -top-6 -right-4 rotate-12">
                                <Baby className="w-12 h-12 text-pink-300" />
                            </div>
                        </div>

                        <p className="text-2xl text-slate-600 font-medium mb-2">
                            Julian & Mafe
                        </p>
                        <p className="text-slate-500">
                            Te invitamos a celebrar la llegada de nuestro bebé
                        </p>
                    </motion.div>

                    {/* Información del evento */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4 mb-10"
                    >
                        {/* Fecha y Hora */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-pink-50 rounded-2xl p-4 border border-pink-100 flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <Calendar className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-pink-400 font-bold uppercase tracking-wider">¿Cuándo?</p>
                                    <p className="text-slate-700 font-bold">{fecha}</p>
                                </div>
                            </div>
                            <div className="flex-1 bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">¿A qué hora?</p>
                                    <p className="text-slate-700 font-bold">{hora}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lugar */}
                        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex items-center gap-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                <MapPin className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">¿Dónde?</p>
                                <p className="text-slate-700 font-bold">{lugar}</p>
                                <a 
                                    href={EVENT_GOOGLE_MAPS_LINK} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-slate-500 text-sm hover:text-purple-500 transition-colors underline cursor-pointer"
                                >
                                    {direccion}
                                </a>
                            </div>
                        </div>

                        {/* Mapa embebido de Google Maps */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="rounded-2xl overflow-hidden shadow-lg border border-purple-100"
                        >
                            <iframe 
                                src={EVENT_GOOGLE_MAPS_EMBED}
                                width="100%" 
                                height="450" 
                                style={{ border: 0 }} 
                                allowFullScreen
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Mensaje especial */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                    >
                        <div className="flex justify-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-pink-300"></div>
                             <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                             <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Botón de descarga */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center mt-8"
            >
                <motion.button
                    onClick={handleDownloadPDF}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-white text-slate-600 px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] border-2 border-slate-100 transition-all"
                >
                    <Download className="w-5 h-5 text-slate-400" />
                    <span>Guardar Recuerdo</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
