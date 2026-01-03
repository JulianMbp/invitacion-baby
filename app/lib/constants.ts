export const NOCODB_API_URL = "https://nocodb.julian-mbp.pro";
export const NOCODB_API_TOKEN = "5-qzRPHBpMsQz5JIbFsWlf4x2tH9r5nPDkStLC5q";
export const TABLES = {
  GUESTS: "mbra9uo0wh2i6c0",
  GIFTS: "moba9dsegr191su",
};

// Enum para el estado de confirmación
export enum ConfirmationStatus {
  PENDING = 1,      // En espera (no ha abierto el link)
  CONFIRMED = 2,    // Confirmado (asistirá)
  DECLINED = 3      // No podrá asistir
}

// Enum para el team elegido
export enum TeamStatus {
  NONE = 0,         // Sin team
  PINK = 1,         // Team Rosa
  BLUE = 2          // Team Azul
}

// Información del evento
export const EVENT_INFO = {
  fecha: "Domingo, 8 de Febrero",
  hora: "2:00 PM - 6:00 PM",
  lugar: "Jardín Infantil El Arte De Crecer",
  direccion: "Jardín Infantil El Arte De Crecer"
};

// Enlace directo de Google Maps para la ubicación del evento
export const EVENT_GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/abkCiSaTwXmLzZzv5";

// Código del iframe para el mapa embebido
export const EVENT_GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d278.37361380483543!2d-77.26320028990229!3d1.205890621564246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed49145b1ead9%3A0xb57fcd6e3e4caa07!2sJardin%20Infantil%20El%20Arte%20De%20Crecer!5e0!3m2!1ses!2sco!4v1767318683343!5m2!1ses!2sco";

// Función helper para generar enlace de Google Maps (mantenida por compatibilidad)
export const getGoogleMapsLink = (direccion: string): string => {
  const encodedAddress = encodeURIComponent(direccion);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

// 🎵 MÚSICA DE FONDO PARA BABY SHOWER
// Usando archivos MP3 locales

// 📁 CARPETA DE MÚSICA: public/music/
// 💡 INSTRUCCIONES:
// 1. Coloca tu archivo MP3 en la carpeta: invitation-baby/public/music/
// 2. Cambia el nombre del archivo abajo por el nombre de tu archivo
// 3. Ejemplo: Si tu archivo se llama "mi-cancion.mp3", pon: "/music/mi-cancion.mp3"

// 🎵 RUTA DEL ARCHIVO DE AUDIO
export const AUDIO_FILE_PATH = "/music/cancion.mp3";

// 💡 OPCIONES DE MÚSICA GRATIS (para descargar y poner en public/music/):
// - Pixabay Music: https://pixabay.com/music/
// - Free Music Archive: https://freemusicarchive.org/
// - Bensound: https://www.bensound.com/
// - Incompetech: https://incompetech.com/music/
// Busca: "baby shower", "lullaby", "soft instrumental", "royalty free"
