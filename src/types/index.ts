export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  creador: string;
  estado: 'pendiente' | 'en-proceso' | 'terminada';
  fechaCreacion: string;
  fechaFinalizacion?: string;
  tiempoEstimado?: number; // en minutos
  tiemposRegistrados: {
    fecha: string;
    minutos: number;
    descripcion: string;
  }[];
}

export interface Creador {
  id: string;
  nombre: string;
}

export interface ConfiguracionEmpresa {
  id: string;
  nombre: string;
  logo?: string;
}

export interface AppState {
  empresaActual: string;
  creadorActual: string;
}