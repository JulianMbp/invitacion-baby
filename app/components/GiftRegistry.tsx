'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Baby,
    Bed,
    BookOpen,
    Box,
    Car,
    Check,
    Droplet,
    Gift as GiftIcon,
    Heart,
    Home,
    Lock,
    Music,
    Palette,
    Shirt,
    ShoppingCart,
    Sparkles,
    Star,
    UtensilsCrossed,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Gift, Guest, getGifts, reserveGift, unreserveGift } from '../lib/nocodb';

interface GiftRegistryProps {
    guest: Guest;
}

export default function GiftRegistry({ guest }: GiftRegistryProps) {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);
    const [reservingId, setReservingId] = useState<number | null>(null);
    const [unreservingId, setUnreservingId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        loadGifts();
    }, []);

    const loadGifts = async () => {
        try {
            const data = await getGifts();
            setGifts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (gift: Gift) => {
        if (gift.IsReserved) return;

        if (!confirm(`¿Deseas apartar "${gift.Item}"? Una vez apartado, nadie más podrá elegirlo.`)) {
            return;
        }

        setReservingId(gift.Id);

        // Optimistically set to reserved by current guest
        setGifts(prev => prev.map(g =>
            g.Id === gift.Id ? { ...g, IsReserved: true, ReservedBy: String(guest.Id) } : g
        ));

        try {
            await reserveGift(gift.Id, guest.Id);
        } catch (error) {
            console.error(error);
            alert('Error al reservar. Intenta de nuevo.');
            setGifts(prev => prev.map(g =>
                g.Id === gift.Id ? { ...g, IsReserved: false, ReservedBy: undefined } : g
            ));
        } finally {
            setReservingId(null);
        }
    };

    const handleUnreserve = async (gift: Gift) => {
        if (!confirm(`¿Estás seguro de que deseas desagregar "${gift.Item}"?`)) {
            return;
        }

        setUnreservingId(gift.Id);

        // Optimistically set to unreserved
        setGifts(prev => prev.map(g =>
            g.Id === gift.Id ? { ...g, IsReserved: false, ReservedBy: undefined } : g
        ));

        try {
            await unreserveGift(gift.Id);
        } catch (error) {
            console.error(error);
            alert('Error al desagregar. Intenta de nuevo.');
            setGifts(prev => prev.map(g =>
                g.Id === gift.Id ? { ...g, IsReserved: true, ReservedBy: String(guest.Id) } : g
            ));
        } finally {
            setUnreservingId(null);
        }
    };

    // Map categories to icons - Iconos más específicos y creativos
    const getCategoryIcon = (category: string) => {
        const categoryLower = category.toLowerCase();
        
        // Cuidado e higiene
        if (categoryLower.includes('cuidado') || categoryLower.includes('higiene')) {
            return Droplet;
        }
        
        // Ropa y accesorios
        if (categoryLower.includes('ropa') || categoryLower.includes('vestimenta') || categoryLower.includes('accesorios')) {
            return Shirt;
        }
        
        // Alimentación
        if (categoryLower.includes('alimentación') || categoryLower.includes('alimentacion') || categoryLower.includes('comida') || categoryLower.includes('alimento')) {
            return UtensilsCrossed;
        }
        
        // Sueño y descanso
        if (categoryLower.includes('sueño') || categoryLower.includes('sueño') || categoryLower.includes('descanso') || categoryLower.includes('cama') || categoryLower.includes('manta') || categoryLower.includes('cobija')) {
            return Bed;
        }
        
        // Estimulación
        if (categoryLower.includes('estimulación') || categoryLower.includes('estimulacion') || categoryLower.includes('juguete') || categoryLower.includes('juego') || categoryLower.includes('sonajero') || categoryLower.includes('mordedor')) {
            return Sparkles;
        }
        
        // Organización
        if (categoryLower.includes('organización') || categoryLower.includes('organizacion') || categoryLower.includes('bolso') || categoryLower.includes('organizador')) {
            return Box;
        }
        
        // Decoración
        if (categoryLower.includes('decoración') || categoryLower.includes('decoracion') || categoryLower.includes('mueble') || categoryLower.includes('luz') || categoryLower.includes('vinilo') || categoryLower.includes('guirnalda')) {
            return Home;
        }
        
        // Sets y kits
        if (categoryLower.includes('set') || categoryLower.includes('kit')) {
            return Star;
        }
        
        // Prácticos
        if (categoryLower.includes('práctico') || categoryLower.includes('practico') || categoryLower.includes('cupón') || categoryLower.includes('cupon')) {
            return ShoppingCart;
        }
        
        // Recuerdos
        if (categoryLower.includes('recuerdo') || categoryLower.includes('libro de mensajes') || categoryLower.includes('álbum') || categoryLower.includes('album') || categoryLower.includes('foto')) {
            return Heart;
        }
        
        // Categorías adicionales
        if (categoryLower.includes('libro') || categoryLower.includes('lectura')) {
            return BookOpen;
        }
        if (categoryLower.includes('música') || categoryLower.includes('musica') || categoryLower.includes('sonido')) {
            return Music;
        }
        if (categoryLower.includes('arte') || categoryLower.includes('creativo')) {
            return Palette;
        }
        if (categoryLower.includes('transporte') || categoryLower.includes('coche') || categoryLower.includes('carro')) {
            return Car;
        }
        
        // Default icon
        return Baby;
    };

    // Get unique categories from gifts
    const categories = useMemo(() => {
        const cats = gifts
            .map(g => g.Category)
            .filter((cat): cat is string => !!cat && cat.trim() !== '');
        return Array.from(new Set(cats));
    }, [gifts]);

    // Filter gifts by selected category
    const filteredGifts = useMemo(() => {
        if (!selectedCategory) {
            return [];
        }
        return gifts.filter(g => g.Category === selectedCategory);
    }, [gifts, selectedCategory]);

    if (loading) {
        return (
            <div className="text-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                >
                    <GiftIcon className="w-12 h-12 text-pink-400" />
                </motion.div>
                <p className="text-slate-400 text-lg">Cargando lista de regalos...</p>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-6"
                >
                    <div className="p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full shadow-lg">
                        <GiftIcon className="w-12 h-12 text-purple-500" />
                    </div>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4"
                >
                    Lista de Regalos
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 text-lg max-w-2xl mx-auto mb-8"
                >
                    Primero selecciona una categoría para ver los regalos disponibles.
                </motion.p>
            </motion.div>

            {/* Category Filter with Icons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-slate-700 font-semibold text-lg mb-6"
                >
                    Selecciona una categoría
                </motion.p>
                <div className="flex flex-wrap justify-center gap-4 px-4">
                    {categories.map((category, index) => {
                        const IconComponent = getCategoryIcon(category);
                        const isSelected = selectedCategory === category;
                        return (
                            <motion.button
                                key={category}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category)}
                                className={clsx(
                                    "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all shadow-lg min-w-[100px]",
                                    isSelected
                                        ? "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 border-pink-500 text-white shadow-xl scale-105"
                                        : "bg-white border-pink-200 text-slate-700 hover:border-pink-300 hover:shadow-xl"
                                )}
                            >
                                <IconComponent className={clsx(
                                    "w-8 h-8",
                                    isSelected ? "text-white" : "text-pink-500"
                                )} />
                                <span className={clsx(
                                    "text-xs font-semibold text-center leading-tight",
                                    isSelected ? "text-white" : "text-slate-700"
                                )}>
                                    {category}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Show message when no category is selected */}
            {!selectedCategory && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                >
                    <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="inline-block mb-6"
                    >
                        <GiftIcon className="w-16 h-16 text-pink-400" />
                    </motion.div>
                    <p className="text-slate-500 text-xl font-medium mb-2">
                        Selecciona una categoría arriba
                    </p>
                    <p className="text-slate-400 text-sm">
                        Para ver los regalos disponibles en esa categoría
                    </p>
                </motion.div>
            )}

            {/* Show gifts when category is selected */}
            {selectedCategory && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">
                        Regalos en: <span className="text-pink-500">{selectedCategory}</span>
                    </h3>
                </motion.div>
            )}

            {selectedCategory && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredGifts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12"
                            >
                                <p className="text-slate-400 text-lg">
                                    No hay regalos disponibles en esta categoría
                                </p>
                            </motion.div>
                        ) : (
                            filteredGifts.map((gift, index) => {
                                const isReserved = gift.IsReserved || (gift.ReservedBy && gift.ReservedBy !== '');
                                const isReservedByMe = gift.ReservedBy === String(guest.Id);

                                return (
                            <motion.div
                                key={gift.Id}
                                layout
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className={clsx(
                                    "group relative bg-white p-6 rounded-3xl border-2 transition-all overflow-hidden",
                                    isReserved
                                        ? "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 opacity-75"
                                        : "border-pink-200/50 hover:border-pink-300 hover:shadow-2xl bg-gradient-to-br from-white to-pink-50/30"
                                )}
                            >
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/20 rounded-full blur-2xl -mr-12 -mt-12" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <motion.div
                                            whileHover={{ rotate: 15, scale: 1.1 }}
                                            className={clsx(
                                                "p-3 rounded-2xl",
                                                isReserved
                                                    ? "bg-slate-200"
                                                    : "bg-gradient-to-br from-pink-100 to-purple-100"
                                            )}
                                        >
                                            <GiftIcon className={clsx(
                                                "w-6 h-6",
                                                isReserved ? "text-slate-400" : "text-pink-500"
                                            )} />
                                        </motion.div>
                                        {isReserved && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={clsx(
                                                    "text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 shadow-md",
                                                    isReservedByMe
                                                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                                                        : "bg-slate-200 text-slate-500"
                                                )}
                                            >
                                                {isReservedByMe ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        Apartado por ti
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-3 h-3" />
                                                        Apartado
                                                    </>
                                                )}
                                            </motion.span>
                                        )}
                                    </div>

                                    {gift.Category && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-xs text-pink-400 mb-2 uppercase tracking-wider font-semibold"
                                        >
                                            {gift.Category}
                                        </motion.p>
                                    )}
                                    
                                    <h3 className={clsx(
                                        "font-bold text-lg mb-2",
                                        isReserved ? "text-slate-500" : "text-slate-800"
                                    )}>
                                        {gift.Item}
                                    </h3>
                                    
                                    {gift.Description && (
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                            {gift.Description}
                                        </p>
                                    )}
                                    
                                    {gift.PriceRange && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <p className="text-xs text-slate-500 font-medium">
                                                {gift.PriceRange}
                                            </p>
                                        </div>
                                    )}

                                    {isReservedByMe ? (
                                        <motion.button
                                            onClick={() => handleUnreserve(gift)}
                                            disabled={unreservingId === gift.Id}
                                            whileHover={unreservingId !== gift.Id ? { scale: 1.02 } : {}}
                                            whileTap={unreservingId !== gift.Id ? { scale: 0.98 } : {}}
                                            className="w-full py-3 rounded-2xl font-semibold text-sm transition-all relative overflow-hidden bg-gradient-to-r from-red-400 to-orange-500 text-white shadow-lg hover:shadow-xl border-2 border-transparent"
                                        >
                                            {unreservingId === gift.Id ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Desagregando...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <X className="w-4 h-4" />
                                                    Desagregar
                                                </span>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            onClick={() => handleReserve(gift)}
                                            disabled={isReserved || reservingId === gift.Id}
                                            whileHover={!isReserved && reservingId !== gift.Id ? { scale: 1.02 } : {}}
                                            whileTap={!isReserved && reservingId !== gift.Id ? { scale: 0.98 } : {}}
                                            className={clsx(
                                                "w-full py-3 rounded-2xl font-semibold text-sm transition-all relative overflow-hidden",
                                                isReserved
                                                    ? "bg-transparent text-slate-400 cursor-default border border-slate-200"
                                                    : "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-lg hover:shadow-xl border-2 border-transparent"
                                            )}
                                        >
                                            {reservingId === gift.Id ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    Apartando...
                                                </span>
                                            ) : isReserved ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Lock className="w-4 h-4" />
                                                    No disponible
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    Apartar Regalo
                                                </span>
                                            )}
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
