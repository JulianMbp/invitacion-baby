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

// Información del evento
export const EVENT_INFO = {
  fecha: "Sábado, 15 de Marzo",
  hora: "3:00 PM",
  lugar: "Salón de Eventos",
  direccion: "Calle Principal 123, Ciudad"
};

