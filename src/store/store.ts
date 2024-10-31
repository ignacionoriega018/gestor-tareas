import { configureStore } from '@reduxjs/toolkit';
import tareasReducer from './tareasSlice';
import creadoresReducer from './creadoresSlice';
import configuracionReducer from './configuracionSlice';

export const store = configureStore({
  reducer: {
    tareas: tareasReducer,
    creadores: creadoresReducer,
    configuracion: configuracionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;