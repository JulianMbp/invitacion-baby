'use client';

import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function GiftsInfo() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-8 rounded-3xl max-w-2xl mx-auto border-2 border-yellow-200/50 shadow-xl relative overflow-hidden mb-12"
        >
            <div className="absolute top-0 left-0 w-24 h-24 bg-yellow-200/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-4"
                >
                    <div className="p-4 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-full shadow-lg">
                        <Gift className="w-10 h-10 text-purple-500" />
                    </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Sobre los Regalos</h3>
                <p className="text-slate-700 leading-relaxed text-base text-center">
                    Tu presencia es el regalo más valioso para nosotros. Para ayudarnos a organizarnos mejor y asegurarnos de que el bebé tenga todo lo que necesita sin duplicados, hemos preparado una lista de regalos donde puedes apartar el que desees brindarnos. Esto nos permite estar más organizados y garantizar que cada regalo sea único y especial.
                </p>
            </div>
        </motion.div>
    );
}

