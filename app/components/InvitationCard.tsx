'use client';

import { motion } from 'framer-motion';
import { Baby, Calendar, Clock, Download, Heart, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';

interface InvitationCardProps {
    fecha?: string;
    hora?: string;
    lugar?: string;
    direccion?: string;
}

export default function InvitationCard({ 
    fecha = "Sábado, 15 de Marzo",
    hora = "3:00 PM",
    lugar = "Salón de Eventos",
    direccion = "Calle Principal 123, Ciudad"
}: InvitationCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!cardRef.current) return;

        try {
            // Dynamic import to avoid SSR issues
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            // Crear un elemento temporal con estilos convertidos a RGB
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = cardRef.current.offsetWidth + 'px';
            document.body.appendChild(tempContainer);

            const cloned = cardRef.current.cloneNode(true) as HTMLElement;
            tempContainer.appendChild(cloned);

            // Función auxiliar para convertir cualquier color a RGB
            const colorToRGB = (colorValue: string): string | null => {
                if (!colorValue || colorValue === 'transparent' || colorValue === 'none') {
                    return null;
                }

                // Si ya es RGB/RGBA, devolverlo
                if (colorValue.startsWith('rgb')) {
                    return colorValue;
                }

                // Si es HEX, devolverlo
                if (colorValue.startsWith('#')) {
                    return colorValue;
                }

                // Si contiene funciones de color modernas (lab, oklab, oklch, etc.), convertir usando canvas
                if (colorValue.includes('lab') || colorValue.includes('oklch') || colorValue.includes('oklab') || 
                    colorValue.includes('lch') || colorValue.includes('color(')) {
                    try {
                        const tempDiv = document.createElement('div');
                        tempDiv.style.color = colorValue;
                        tempDiv.style.position = 'absolute';
                        tempDiv.style.visibility = 'hidden';
                        tempDiv.style.opacity = '0';
                        document.body.appendChild(tempDiv);
                        
                        const computedColor = window.getComputedStyle(tempDiv).color;
                        document.body.removeChild(tempDiv);
                        
                        // Si se convirtió a RGB, usarlo
                        if (computedColor && computedColor.startsWith('rgb')) {
                            return computedColor;
                        }
                    } catch {
                        // Si falla, usar un color por defecto
                    }
                    // Si no se puede convertir, devolver un color por defecto
                    return 'rgb(0, 0, 0)';
                }

                // Para otros formatos, intentar convertir usando el navegador
                try {
                    const tempDiv = document.createElement('div');
                    tempDiv.style.color = colorValue;
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.visibility = 'hidden';
                    tempDiv.style.opacity = '0';
                    document.body.appendChild(tempDiv);
                    
                    const computedColor = window.getComputedStyle(tempDiv).color;
                    document.body.removeChild(tempDiv);
                    
                    if (computedColor && computedColor.startsWith('rgb')) {
                        return computedColor;
                    }
                } catch {
                    // Si falla, devolver null
                }

                return null;
            };

            // Convertir todos los estilos computados a RGB antes de capturar
            const convertStylesToRGB = (element: HTMLElement, original: HTMLElement) => {
                try {
                    const computed = window.getComputedStyle(original);
                    
                    // Convertir color
                    const color = colorToRGB(computed.color);
                    if (color) {
                        element.style.color = color;
                    }

                    // Convertir backgroundColor
                    const bgColor = colorToRGB(computed.backgroundColor);
                    if (bgColor) {
                        element.style.backgroundColor = bgColor;
                    }

                    // Convertir borderColor si existe
                    const borderColor = colorToRGB(computed.borderColor);
                    if (borderColor && computed.borderWidth !== '0px') {
                        element.style.borderColor = borderColor;
                    }

                    // Convertir otros colores relacionados
                    ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'].forEach(prop => {
                        const borderSideColor = colorToRGB(computed.getPropertyValue(prop));
                        if (borderSideColor) {
                            element.style.setProperty(prop, borderSideColor);
                        }
                    });

                    // Para gradientes o funciones de color modernas, reemplazar con un color sólido
                    const bgImage = computed.backgroundImage;
                    if (bgImage && bgImage !== 'none' && (
                        bgImage.includes('gradient') || 
                        bgImage.includes('lab') || 
                        bgImage.includes('oklch') || 
                        bgImage.includes('oklab') ||
                        bgImage.includes('lch') ||
                        bgImage.includes('color(')
                    )) {
                        // Usar el color de fondo computado o un color por defecto
                        const solidBg = bgColor || colorToRGB('#fef3f2') || 'rgb(254, 243, 242)';
                        element.style.backgroundImage = 'none';
                        element.style.background = 'none';
                        element.style.backgroundColor = solidBg;
                    }

                } catch {
                    // Ignorar errores
                }

                // Procesar hijos
                const children = element.children;
                const originalChildren = original.children;
                for (let i = 0; i < children.length && i < originalChildren.length; i++) {
                    convertStylesToRGB(children[i] as HTMLElement, originalChildren[i] as HTMLElement);
                }
            };

            convertStylesToRGB(cloned, cardRef.current);

            // Función más agresiva para forzar todos los estilos a RGB
            const forceRGBStyles = (el: HTMLElement) => {
                try {
                    const computed = window.getComputedStyle(el);
                    
                    // Forzar color a RGB
                    const color = colorToRGB(computed.color);
                    if (color) el.style.setProperty('color', color, 'important');
                    
                    // Forzar backgroundColor a RGB
                    const bgColor = colorToRGB(computed.backgroundColor);
                    if (bgColor) el.style.setProperty('background-color', bgColor, 'important');
                    
                    // Forzar borderColor a RGB
                    const borderColor = colorToRGB(computed.borderColor);
                    if (borderColor && computed.borderWidth !== '0px') {
                        el.style.setProperty('border-color', borderColor, 'important');
                    }
                    
                    // Eliminar completamente backgroundImage si contiene funciones de color modernas
                    if (computed.backgroundImage && computed.backgroundImage !== 'none') {
                        const bgImg = computed.backgroundImage.toLowerCase();
                        if (bgImg.includes('gradient') || bgImg.includes('lab') || bgImg.includes('oklch') || 
                            bgImg.includes('oklab') || bgImg.includes('lch') || bgImg.includes('color(')) {
                            const solidBg = bgColor || colorToRGB('#fef3f2') || 'rgb(254, 243, 242)';
                            el.style.setProperty('background-image', 'none', 'important');
                            el.style.setProperty('background', 'none', 'important');
                            el.style.setProperty('background-color', solidBg, 'important');
                        }
                    }
                    
                    // Procesar hijos recursivamente
                    Array.from(el.children).forEach(child => {
                        forceRGBStyles(child as HTMLElement);
                    });
                } catch {
                    // Ignorar errores
                }
            };

            // Aplicar forzado de estilos RGB al clon completo
            forceRGBStyles(cloned);

            // Remover todas las clases de gradiente y funciones de color modernas del clon antes de capturar
            const removeGradients = (el: HTMLElement) => {
                // Remover clases de gradiente
                if (el.className && typeof el.className === 'string') {
                    el.className = el.className.replace(/\bbg-gradient-[^\s]*/g, '');
                    el.className = el.className.replace(/\bfrom-[^\s]*/g, '');
                    el.className = el.className.replace(/\bvia-[^\s]*/g, '');
                    el.className = el.className.replace(/\bto-[^\s]*/g, '');
                }

                // Forzar conversión de todos los estilos inline que puedan contener funciones de color
                const inlineStyle = el.getAttribute('style');
                if (inlineStyle) {
                    // Remover cualquier referencia a funciones de color modernas en estilos inline
                    const cleanedStyle = inlineStyle
                        .replace(/background[^:]*:\s*[^;]*(lab|oklab|oklch|lch|color\([^)]+\))[^;]*;?/gi, '')
                        .replace(/gradient[^;]*;?/gi, '');
                    el.setAttribute('style', cleanedStyle);
                }

                // Remover background-image con gradientes o funciones de color modernas
                const computed = window.getComputedStyle(el);
                if (computed.backgroundImage && computed.backgroundImage !== 'none') {
                    if (computed.backgroundImage.includes('gradient') || 
                        computed.backgroundImage.includes('lab') || 
                        computed.backgroundImage.includes('oklch') ||
                        computed.backgroundImage.includes('oklab') ||
                        computed.backgroundImage.includes('lch') ||
                        computed.backgroundImage.includes('color(')) {
                        const bgColor = colorToRGB(computed.backgroundColor) || colorToRGB('#fef3f2') || 'rgb(254, 243, 242)';
                        el.style.backgroundImage = 'none';
                        el.style.background = 'none';
                        el.style.backgroundColor = bgColor;
                    }
                }

                // Procesar hijos
                Array.from(el.children).forEach(child => {
                    removeGradients(child as HTMLElement);
                });
            };

            removeGradients(cloned);

            const canvas = await html2canvas(cloned, {
                scale: 2,
                backgroundColor: '#fef3f2',
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    // Procesar todos los elementos en el documento clonado
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach((el: Element) => {
                        const htmlEl = el as HTMLElement;
                        const computed = window.getComputedStyle(htmlEl);
                        
                        // Convertir todos los colores a RGB con !important
                        const color = colorToRGB(computed.color);
                        if (color) htmlEl.style.setProperty('color', color, 'important');
                        
                        const bgColor = colorToRGB(computed.backgroundColor);
                        if (bgColor) htmlEl.style.setProperty('background-color', bgColor, 'important');
                        
                        // Convertir colores de borde
                        const borderColor = colorToRGB(computed.borderColor);
                        if (borderColor && computed.borderWidth !== '0px') {
                            htmlEl.style.setProperty('border-color', borderColor, 'important');
                        }
                        
                        // Eliminar completamente gradientes y funciones de color modernas en backgroundImage
                        if (computed.backgroundImage && computed.backgroundImage !== 'none') {
                            const bgImg = computed.backgroundImage.toLowerCase();
                            if (bgImg.includes('gradient') || bgImg.includes('lab') || bgImg.includes('oklch') ||
                                bgImg.includes('oklab') || bgImg.includes('lch') || bgImg.includes('color(')) {
                                const solidBg = bgColor || colorToRGB('#fef3f2') || 'rgb(254, 243, 242)';
                                htmlEl.style.setProperty('background-image', 'none', 'important');
                                htmlEl.style.setProperty('background', 'none', 'important');
                                htmlEl.style.setProperty('background-color', solidBg, 'important');
                            }
                        }
                    });
                }
            });

            // Limpiar
            document.body.removeChild(tempContainer);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [210, 297] // A4
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('invitacion-baby-shower.pdf');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(`Hubo un error al generar el PDF: ${errorMessage}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto mb-12"
        >
            {/* Card de Invitación */}
            <div
                ref={cardRef}
                className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl border-4 border-pink-200 shadow-2xl overflow-hidden relative"
                style={{ minHeight: '600px' }}
            >
                {/* Decoraciones de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />
                </div>

                {/* Contenido */}
                <div className="relative z-10 p-8 md:p-12">
                    {/* Header con iconos decorativos */}
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Heart className="w-8 h-8 text-pink-400" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Baby className="w-12 h-12 text-purple-500" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <Heart className="w-8 h-8 text-blue-400" />
                        </motion.div>
                    </div>

                    {/* Título */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-pink-400" />
                            <h2 className="text-sm uppercase tracking-[0.3em] text-pink-500 font-semibold">
                                Baby Shower
                            </h2>
                            <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            Julian & Maria Fernanda
                        </h1>
                        <p className="text-slate-600 text-lg mt-4">
                            Estamos emocionados de compartir este momento especial contigo
                        </p>
                    </motion.div>

                    {/* Divider decorativo */}
                    <div className="flex items-center justify-center gap-4 my-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-pink-400 flex-1" />
                        <Baby className="w-6 h-6 text-pink-400" />
                        <div className="h-px bg-gradient-to-l from-transparent via-blue-300 to-blue-400 flex-1" />
                    </div>

                    {/* Información del evento */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6 mb-8"
                    >
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-pink-200/50 shadow-lg">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl">
                                    <Calendar className="w-6 h-6 text-pink-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">Fecha</p>
                                    <p className="text-xl font-bold text-slate-800">{fecha}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/50 shadow-lg">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                                    <Clock className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">Hora</p>
                                    <p className="text-xl font-bold text-slate-800">{hora}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/50 shadow-lg">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-pink-100 rounded-xl">
                                    <MapPin className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">Lugar</p>
                                    <p className="text-xl font-bold text-slate-800 mb-1">{lugar}</p>
                                    <p className="text-sm text-slate-600">{direccion}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Mensaje especial */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-6"
                    >
                        <p className="text-slate-600 italic">
                            &quot;Tu presencia es el mejor regalo que podemos recibir&quot;
                        </p>
                    </motion.div>

                    {/* Decoración inferior */}
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <Baby className="w-6 h-6 text-purple-500" />
                        <Heart className="w-4 h-4 text-blue-400" />
                    </div>
                </div>
            </div>

            {/* Botón de descarga */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center mt-6"
            >
                <motion.button
                    onClick={handleDownloadPDF}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    <Download className="w-5 h-5" />
                    <span>Descargar Invitación</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}

