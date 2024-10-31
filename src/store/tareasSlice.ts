import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tarea, TiempoRegistrado } from '../types';

interface TareasState {
  items: Record<string, Tarea[]>;
  loading: boolean;
  error: string | null;
}

const initialState: TareasState = {
  items: {},
  loading: false,
  error: null,
};

export const loadTareasFromStorage = (): Record<string, Tarea[]> => {
  try {
    const savedTareas = localStorage.getItem('tareas');
    return savedTareas ? JSON.parse(savedTareas) : {};
  } catch (error) {
    console.error('Error loading tasks:', error);
    return {};
  }
};

const saveTareasToStorage = (items: Record<string, Tarea[]>) => {
  try {
    localStorage.setItem('tareas', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: {
    ...initialState,
    items: loadTareasFromStorage(),
  },
  reducers: {
    agregarTarea: (state, action: PayloadAction<{ empresaId: string; tarea: Tarea }>) => {
      const { empresaId, tarea } = action.payload;
      if (!state.items[empresaId]) {
        state.items[empresaId] = [];
      }
      const nuevaTarea = {
        ...tarea,
        tiemposRegistrados: [],
      };
      state.items[empresaId].push(nuevaTarea);
      saveTareasToStorage(state.items);
    },
    actualizarEstadoTarea: (
      state,
      action: PayloadAction<{
        empresaId: string;
        id: string;
        estado: Tarea['estado'];
      }>
    ) => {
      const { empresaId, id, estado } = action.payload;
      const tareas = state.items[empresaId];
      if (tareas) {
        const tareaIndex = tareas.findIndex(t => t.id === id);
        if (tareaIndex !== -1) {
          const tarea = tareas[tareaIndex];
          tareas[tareaIndex] = {
            ...tarea,
            estado,
            fechaFinalizacion: estado === 'terminada'
              ? new Date().toLocaleString('es-AR', {
                  timeZone: 'America/Argentina/Buenos_Aires',
                })
              : tarea.fechaFinalizacion,
          };
          saveTareasToStorage(state.items);
        }
      }
    },
    agregarTiempoTarea: (
      state,
      action: PayloadAction<{
        empresaId: string;
        id: string;
        tiempo: Omit<TiempoRegistrado, 'fecha'>;
      }>
    ) => {
      const { empresaId, id, tiempo } = action.payload;
      const tareas = state.items[empresaId];
      if (tareas) {
        const tareaIndex = tareas.findIndex(t => t.id === id);
        if (tareaIndex !== -1) {
          const tarea = tareas[tareaIndex];
          const nuevoTiempo = {
            ...tiempo,
            fecha: new Date().toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
            }),
          };
          tareas[tareaIndex] = {
            ...tarea,
            tiemposRegistrados: [...(tarea.tiemposRegistrados || []), nuevoTiempo],
          };
          saveTareasToStorage(state.items);
        }
      }
    },
  },
});

export const { agregarTarea, actualizarEstadoTarea, agregarTiempoTarea } = tareasSlice.actions;
export default tareasSlice.reducer;