'use client';

import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

export default function GiftsInfo() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-2xl mx-auto border-4 border-yellow-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden mb-16"
        >
            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -ml-16 -mt-16" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mb-16" />
            
            <div className="relative z-10">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-5 bg-yellow-50 rounded-full shadow-sm border-2 border-yellow-100">
                        <Gift className="w-10 h-10 text-yellow-500" />
                    </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-slate-700 mb-4 text-center">Lluvia de Sobres y Regalos</h3>
                <p className="text-slate-500 leading-relaxed text-lg text-center font-medium">
                    Tu presencia es nuestro mejor regalo. Sin embargo, si deseas tener un detalle con nuestro bebé, hemos preparado una lista de sugerencias para evitar duplicados, o también agradecemos la lluvia de sobres.
                </p>
            </div>
        </motion.div>
    );
}
