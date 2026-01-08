#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Automatización NocoDB - Generador de Mensajes WhatsApp
Aplicación con interfaz gráfica para generar mensajes personalizados de invitación
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import requests
import json
import os
from pathlib import Path
from typing import List, Dict, Optional

# =============================================================================
# CONFIGURACIÓN
# =============================================================================

# Configuración de NocoDB
NOCODB_API_URL = "https://nocodb.julian-mbp.pro"
NOCODB_API_TOKEN = "5-qzRPHBpMsQz5JIbFsWlf4x2tH9r5nPDkStLC5q"
TABLA_INVITADOS = "mbra9uo0wh2i6c0"

# ⚠️ IMPORTANTE: Cambia esta URL por la URL base de tu plataforma de invitaciones
# Ejemplo: "https://baby-shower.julian-mbp.pro" o "https://invitacion-baby.com"
URL_BASE_PLATAFORMA = "https://baby-shower.julian-mbp.pro/"  # CAMBIAR ESTA URL

# Headers para las peticiones API
HEADERS = {
    'xc-token': NOCODB_API_TOKEN,
    'Content-Type': 'application/json',
}

# Archivo para guardar el estado (último invitado visto)
ARCHIVO_ESTADO = Path(__file__).parent / ".ultimo_invitado.txt"

# =============================================================================
# CLASE PRINCIPAL DE LA APLICACIÓN
# =============================================================================

class NocoDBWhatsAppGenerator:
    def __init__(self, root):
        self.root = root
        self.root.title("Generador de Mensajes WhatsApp - Baby Shower")
        self.root.geometry("900x750")
        self.root.resizable(True, True)
        
        # Configurar fondo oscuro de la ventana principal
        self.root.configure(bg='#1e1e1e')
        
        # Datos
        self.invitados: List[Dict] = []
        self.indice_actual = 0
        self.invitado_actual: Optional[Dict] = None
        
        # Variables de estado
        self.mensaje_copiado = False
        
        # Configurar estilo
        self.setup_styles()
        
        # Crear interfaz
        self.crear_interfaz()
        
        # Cargar invitados al inicio
        self.cargar_invitados()
    
    def setup_styles(self):
        """Configurar estilos de la interfaz para modo oscuro"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # Colores para modo oscuro
        bg_color = '#1e1e1e'  # Fondo oscuro principal
        fg_color = '#e0e0e0'  # Texto claro
        frame_bg = '#2d2d2d'  # Fondo de frames
        label_bg = '#2d2d2d'  # Fondo de labels
        select_bg = '#404040'  # Fondo de selección
        
        # Configurar fondo de la ventana principal
        self.root.configure(bg=bg_color)
        
        # Configurar estilos para los widgets ttk
        style.configure('TFrame', background=bg_color)
        style.configure('TLabelFrame', background=frame_bg, foreground=fg_color, 
                       bordercolor='#404040', relief='solid')
        style.configure('TLabelFrame.Label', background=frame_bg, foreground=fg_color)
        style.configure('TLabel', background=label_bg, foreground=fg_color)
        style.configure('TButton', background='#404040', foreground=fg_color,
                       borderwidth=1, relief='flat', padding=6)
        style.map('TButton',
                 background=[('active', '#505050'), ('pressed', '#353535'),
                            ('disabled', '#2d2d2d')],
                 foreground=[('disabled', '#666666')])
    
    def crear_interfaz(self):
        """Crear todos los componentes de la interfaz gráfica"""
        
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        # Título
        titulo = ttk.Label(
            main_frame,
            text="👶 Generador de Mensajes WhatsApp - Baby Shower ✨",
            font=('Helvetica', 16, 'bold'),
            foreground='#ffffff'
        )
        titulo.grid(row=0, column=0, columnspan=3, pady=(0, 15))
        
        # Panel de información del invitado
        info_frame = ttk.LabelFrame(main_frame, text="Información del Invitado", padding="10")
        info_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        info_frame.columnconfigure(1, weight=1)
        
        # Labels de información (con colores para modo oscuro)
        ttk.Label(info_frame, text="ID (Código único):", 
                 font=('Helvetica', 10, 'bold'), foreground='#b0b0b0').grid(
            row=0, column=0, sticky=tk.W, pady=5
        )
        self.label_id = ttk.Label(info_frame, text="---", 
                                  font=('Helvetica', 10), foreground='#ffffff')
        self.label_id.grid(row=0, column=1, sticky=tk.W, padx=(10, 0))
        
        ttk.Label(info_frame, text="Nombre:", 
                 font=('Helvetica', 10, 'bold'), foreground='#b0b0b0').grid(
            row=1, column=0, sticky=tk.W, pady=5
        )
        self.label_nombre = ttk.Label(info_frame, text="---", 
                                      font=('Helvetica', 10), foreground='#ffffff')
        self.label_nombre.grid(row=1, column=1, sticky=tk.W, padx=(10, 0))
        
        ttk.Label(info_frame, text="Celular:", 
                 font=('Helvetica', 10, 'bold'), foreground='#b0b0b0').grid(
            row=2, column=0, sticky=tk.W, pady=5
        )
        self.label_celular = ttk.Label(info_frame, text="---", 
                                       font=('Helvetica', 10), foreground='#ffffff')
        self.label_celular.grid(row=2, column=1, sticky=tk.W, padx=(10, 0))
        
        ttk.Label(info_frame, text="Email:", 
                 font=('Helvetica', 10, 'bold'), foreground='#b0b0b0').grid(
            row=3, column=0, sticky=tk.W, pady=5
        )
        self.label_email = ttk.Label(info_frame, text="---", 
                                     font=('Helvetica', 10), foreground='#ffffff')
        self.label_email.grid(row=3, column=1, sticky=tk.W, padx=(10, 0))
        
        ttk.Label(info_frame, text="Integrantes:", 
                 font=('Helvetica', 10, 'bold'), foreground='#b0b0b0').grid(
            row=4, column=0, sticky=tk.W, pady=5
        )
        self.label_integrantes = ttk.Label(info_frame, text="---", 
                                           font=('Helvetica', 10), foreground='#ffffff')
        self.label_integrantes.grid(row=4, column=1, sticky=tk.W, padx=(10, 0))
        
        # Indicador de posición
        self.label_posicion = ttk.Label(
            main_frame,
            text="Invitado 0 de 0",
            font=('Helvetica', 10, 'italic'),
            foreground='#808080'
        )
        self.label_posicion.grid(row=2, column=0, columnspan=3, pady=(0, 10))
        
        # Panel del mensaje
        mensaje_frame = ttk.LabelFrame(main_frame, text="Mensaje de WhatsApp", padding="10")
        mensaje_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        mensaje_frame.columnconfigure(0, weight=1)
        mensaje_frame.rowconfigure(0, weight=1)
        main_frame.rowconfigure(3, weight=1)
        
        # Área de texto para el mensaje (modo oscuro)
        self.texto_mensaje = scrolledtext.ScrolledText(
            mensaje_frame,
            wrap=tk.WORD,
            width=80,
            height=20,
            font=('Helvetica', 11),
            bg='#252525',  # Fondo oscuro para el área de texto
            fg='#e0e0e0',  # Texto claro
            insertbackground='#ffffff',  # Color del cursor
            selectbackground='#404040',  # Fondo de selección
            selectforeground='#ffffff',  # Texto seleccionado
            relief=tk.FLAT,
            padx=10,
            pady=10,
            borderwidth=1,
            highlightthickness=1,
            highlightbackground='#404040',
            highlightcolor='#505050'
        )
        self.texto_mensaje.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Frame de botones
        botones_frame = ttk.Frame(main_frame)
        botones_frame.grid(row=4, column=0, columnspan=3, pady=(10, 0))
        
        # Botón Anterior
        self.btn_anterior = ttk.Button(
            botones_frame,
            text="◀ Anterior",
            command=self.invitado_anterior,
            width=15
        )
        self.btn_anterior.grid(row=0, column=0, padx=5)
        
        # Botón Copiar Mensaje
        self.btn_copiar = ttk.Button(
            botones_frame,
            text="📋 Copiar Mensaje",
            command=self.copiar_mensaje,
            width=20
        )
        self.btn_copiar.grid(row=0, column=1, padx=5)
        
        # Botón Siguiente
        self.btn_siguiente = ttk.Button(
            botones_frame,
            text="Siguiente ▶",
            command=self.invitado_siguiente,
            width=15
        )
        self.btn_siguiente.grid(row=0, column=2, padx=5)
        
        # Botón Recargar
        ttk.Button(
            botones_frame,
            text="🔄 Recargar Invitados",
            command=self.cargar_invitados,
            width=20
        ).grid(row=0, column=3, padx=5)
        
        # Botón Reiniciar desde el principio
        ttk.Button(
            botones_frame,
            text="🔄 Reiniciar desde el inicio",
            command=self.reiniciar_desde_principio,
            width=22
        ).grid(row=0, column=4, padx=5)
        
        # Status bar (con colores adaptados para modo oscuro)
        self.status_label = ttk.Label(
            main_frame,
            text="Listo",
            font=('Helvetica', 9),
            foreground='#4ade80'  # Verde claro para modo oscuro
        )
        self.status_label.grid(row=5, column=0, columnspan=3, pady=(10, 0))
    
    # =========================================================================
    # FUNCIONES DE API NocoDB
    # =========================================================================
    
    def obtener_invitados(self) -> List[Dict]:
        """Obtener todos los invitados desde NocoDB"""
        try:
            url = f"{NOCODB_API_URL}/api/v2/tables/{TABLA_INVITADOS}/records"
            params = {
                'limit': 1000,
                'offset': 0,
                'shuffle': 0
            }
            
            response = requests.get(url, headers=HEADERS, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            return data.get('list', [])
        
        except requests.exceptions.RequestException as e:
            messagebox.showerror(
                "Error de Conexión",
                f"No se pudo conectar a NocoDB:\n{str(e)}\n\nVerifica tu conexión a internet y la configuración."
            )
            return []
        except Exception as e:
            messagebox.showerror(
                "Error",
                f"Error al obtener invitados:\n{str(e)}"
            )
            return []
    
    def cargar_invitados(self):
        """Cargar invitados y continuar desde el último invitado visto"""
        self.status_label.config(text="Cargando invitados...", foreground='#fbbf24')  # Amarillo para modo oscuro
        self.root.update()
        
        self.invitados = self.obtener_invitados()
        
        if not self.invitados:
            self.status_label.config(text="No se encontraron invitados", foreground='#f87171')  # Rojo claro
            self.limpiar_informacion()
            return
        
        self.status_label.config(
            text=f"Cargados {len(self.invitados)} invitados",
            foreground='#4ade80'  # Verde claro
        )
        
        # Intentar cargar el último invitado visto
        ultimo_id = self.cargar_ultimo_invitado()
        indice_inicio = 0
        
        if ultimo_id:
            # Buscar el último ID en la lista de invitados
            for i, invitado in enumerate(self.invitados):
                guest_id = invitado.get('Id', invitado.get('id', ''))
                if str(guest_id) == str(ultimo_id):
                    indice_inicio = i
                    self.status_label.config(
                        text=f"Cargados {len(self.invitados)} invitados - Continuando desde el invitado {i + 1}",
                        foreground='#4ade80'  # Verde claro
                    )
                    break
        
        if self.invitados:
            self.mostrar_invitado(indice_inicio)
    
    # =========================================================================
    # FUNCIONES DE NAVEGACIÓN
    # =========================================================================
    
    def mostrar_invitado(self, indice: int):
        """Mostrar el invitado en el índice especificado"""
        if not self.invitados or indice < 0 or indice >= len(self.invitados):
            return
        
        self.indice_actual = indice
        self.invitado_actual = self.invitados[indice]
        self.mensaje_copiado = False
        
        # Guardar el ID del invitado actual para poder continuar después
        guest_id = self.invitado_actual.get('Id', self.invitado_actual.get('id', ''))
        self.guardar_ultimo_invitado(guest_id)
        
        # Actualizar información del invitado
        invitado = self.invitado_actual
        
        # Obtener campos (manejar diferentes nombres posibles)
        guest_id = invitado.get('Id', invitado.get('id', 'N/A'))
        nombre = invitado.get('Nombre Representante', invitado.get('nombre', 'N/A'))
        celular = invitado.get('Celular', invitado.get('celular', 'N/A'))
        email = invitado.get('correo', invitado.get('email', invitado.get('Correo', 'N/A')))
        integrantes = invitado.get('N° Integrantes', invitado.get('integrantes', 'N/A'))
        
        self.label_id.config(text=str(guest_id))
        self.label_nombre.config(text=nombre)
        self.label_celular.config(text=str(celular) if celular != 'N/A' else 'N/A')
        self.label_email.config(text=str(email) if email != 'N/A' else 'N/A')
        self.label_integrantes.config(text=str(integrantes) if integrantes != 'N/A' else 'N/A')
        
        # Actualizar posición
        self.label_posicion.config(
            text=f"Invitado {indice + 1} de {len(self.invitados)}"
        )
        
        # Generar y mostrar mensaje
        mensaje = self.generar_mensaje_whatsapp(invitado)
        self.texto_mensaje.delete('1.0', tk.END)
        self.texto_mensaje.insert('1.0', mensaje)
        
        # Actualizar estado de botones
        self.btn_anterior.config(state=tk.NORMAL if indice > 0 else tk.DISABLED)
        self.btn_siguiente.config(state=tk.NORMAL if indice < len(self.invitados) - 1 else tk.DISABLED)
        
        self.status_label.config(text="Listo", foreground='#4ade80')  # Verde claro
    
    def invitado_siguiente(self):
        """Mostrar el siguiente invitado"""
        if self.indice_actual < len(self.invitados) - 1:
            self.mostrar_invitado(self.indice_actual + 1)
    
    def invitado_anterior(self):
        """Mostrar el invitado anterior"""
        if self.indice_actual > 0:
            self.mostrar_invitado(self.indice_actual - 1)
    
    def limpiar_informacion(self):
        """Limpiar la información mostrada"""
        self.label_id.config(text="---")
        self.label_nombre.config(text="---")
        self.label_celular.config(text="---")
        self.label_email.config(text="---")
        self.label_integrantes.config(text="---")
        self.label_posicion.config(text="Invitado 0 de 0")
        self.texto_mensaje.delete('1.0', tk.END)
        self.btn_anterior.config(state=tk.DISABLED)
        self.btn_siguiente.config(state=tk.DISABLED)
    
    # =========================================================================
    # GENERACIÓN DE MENSAJES
    # =========================================================================
    
    def obtener_saludo_personalizado(self, invitado: Dict) -> str:
        """Obtener el saludo personalizado según el género"""
        # Intentar diferentes variaciones del campo de género
        genero = (
            invitado.get('# genero') or
            invitado.get('#genero') or
            invitado.get('genero') or
            invitado.get('Genero') or
            invitado.get('Género')
        )
        
        # Convertir a número si viene como string
        if isinstance(genero, str):
            try:
                genero = int(genero)
            except (ValueError, TypeError):
                genero = None
        
        # 1 = Masculino (Sr.), 2 = Femenino (Sra.)
        if genero == 1:
            return "Sr."
        elif genero == 2:
            return "Sra."
        else:
            return ""
    
    def generar_mensaje_whatsapp(self, invitado: Dict) -> str:
        """Generar el mensaje personalizado de WhatsApp"""
        # Obtener datos del invitado
        guest_id = invitado.get('Id', invitado.get('id', ''))
        nombre_representante = invitado.get('Nombre Representante', invitado.get('nombre', ''))
        integrantes = invitado.get('N° Integrantes', invitado.get('integrantes', 1))
        
        # Obtener saludo
        titulo = self.obtener_saludo_personalizado(invitado)
        nombre_con_titulo = f"{titulo} {nombre_representante}".strip() if titulo else nombre_representante
        
        # Ajustar saludo según número de integrantes
        if integrantes and isinstance(integrantes, (int, float)) and integrantes > 2:
            saludo = f"{nombre_con_titulo} y familia"
        elif integrantes and isinstance(integrantes, (int, float)) and integrantes == 2:
            saludo = f"{nombre_con_titulo} y acompañante"
        else:
            saludo = nombre_con_titulo
        
        # Construir URL única (usar ID como código)
        url_invitacion = f"{URL_BASE_PLATAFORMA}"
        
        # Generar mensaje completo (versión optimizada para marketing)
        mensaje = f"""👶✨ ¡Hola {saludo}! ✨👶

🎉 *¡Estás invitado/a a nuestro Baby Shower!* 🎉

Te esperamos para celebrar este momento tan especial con nosotros 🎈

📅 *Domingo, 8 de Febrero*
🕐 *2:00 PM - 6:00 PM*
📍 *Jardín Infantil El Arte De Crecer*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 *Accede a tu invitación digital en 2 pasos:*

1️⃣ Abre: {url_invitacion}

2️⃣ Ingresa tu código: *{guest_id}*

✨ *¡Y listo!* Podrás confirmar tu asistencia, elegir tu equipo (Rosa o Azul 💗💙) y ver nuestro registro de regalos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💝 Tu presencia es nuestro mejor regalo 💕

Con cariño,
Julian & María Fernanda 👶✨

💬 ¿Dudas? Escríbenos, estamos aquí para ayudarte 😊"""
        
        return mensaje
    
    # =========================================================================
    # FUNCIONES DE PERSISTENCIA (GUARDAR/CARGAR ESTADO)
    # =========================================================================
    
    def guardar_ultimo_invitado(self, guest_id):
        """Guardar el ID del último invitado visto en un archivo"""
        try:
            with open(ARCHIVO_ESTADO, 'w', encoding='utf-8') as f:
                f.write(str(guest_id))
        except Exception as e:
            # Silenciar errores de escritura, no es crítico
            print(f"Error al guardar estado: {e}")
    
    def cargar_ultimo_invitado(self) -> Optional[str]:
        """Cargar el ID del último invitado visto desde un archivo"""
        try:
            if ARCHIVO_ESTADO.exists():
                with open(ARCHIVO_ESTADO, 'r', encoding='utf-8') as f:
                    contenido = f.read().strip()
                    if contenido:
                        return contenido
        except Exception as e:
            # Silenciar errores de lectura, no es crítico
            print(f"Error al cargar estado: {e}")
        return None
    
    def reiniciar_desde_principio(self):
        """Reiniciar desde el primer invitado (eliminar estado guardado)"""
        # Confirmar con el usuario
        respuesta = messagebox.askyesno(
            "Reiniciar desde el inicio",
            "¿Estás seguro de que deseas reiniciar desde el primer invitado?\n\n"
            "Esto eliminará el registro del último invitado visto y comenzarás desde el principio."
        )
        
        if not respuesta:
            return
        
        try:
            if ARCHIVO_ESTADO.exists():
                ARCHIVO_ESTADO.unlink()
        except Exception as e:
            print(f"Error al eliminar estado: {e}")
        
        # Mostrar el primer invitado directamente
        if self.invitados:
            self.mostrar_invitado(0)
            self.status_label.config(
                text=f"Reiniciado desde el inicio - Invitado 1 de {len(self.invitados)}",
                foreground='#4ade80'  # Verde claro
            )
        else:
            # Si no hay invitados cargados, recargar
            self.cargar_invitados()
    
    # =========================================================================
    # FUNCIONALIDAD DE COPIAR
    # =========================================================================
    
    def copiar_mensaje(self):
        """Copiar el mensaje al portapapeles"""
        mensaje = self.texto_mensaje.get('1.0', tk.END).strip()
        
        if not mensaje:
            messagebox.showwarning("Advertencia", "No hay mensaje para copiar.")
            return
        
        try:
            self.root.clipboard_clear()
            self.root.clipboard_append(mensaje)
            self.root.update()  # Ahora está disponible en el portapapeles
            
            # Actualizar botón con confirmación visual
            texto_original = self.btn_copiar.cget('text')
            self.btn_copiar.config(text="✓ Copiado!")
            self.mensaje_copiado = True
            
            self.status_label.config(
                text="✓ Mensaje copiado al portapapeles",
                foreground='#4ade80'  # Verde claro
            )
            
            # Restaurar texto después de 2 segundos
            self.root.after(2000, lambda: self.btn_copiar.config(text=texto_original))
            
        except Exception as e:
            messagebox.showerror(
                "Error",
                f"No se pudo copiar al portapapeles:\n{str(e)}"
            )
            self.status_label.config(text="Error al copiar", foreground='#f87171')  # Rojo claro


# =============================================================================
# FUNCIÓN PRINCIPAL
# =============================================================================

def main():
    # Verificar que la URL base esté configurada
    if URL_BASE_PLATAFORMA == "https://TU-PLATAFORMA.com":
        respuesta = messagebox.askyesno(
            "Configuración Requerida",
            "⚠️ IMPORTANTE: Necesitas configurar la URL base de tu plataforma.\n\n"
            "Por favor, edita el archivo automatizacion.py y cambia:\n"
            "URL_BASE_PLATAFORMA = \"https://TU-PLATAFORMA.com\"\n\n"
            "Por tu URL real (ej: https://baby-shower.julian-mbp.pro)\n\n"
            "¿Deseas continuar de todos modos? (El enlace no funcionará correctamente)"
        )
        if not respuesta:
            return
    
    root = tk.Tk()
    app = NocoDBWhatsAppGenerator(root)
    root.mainloop()


if __name__ == "__main__":
    main()

