import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { agregarTarea } from '../store/tareasSlice';
import { Plus } from 'lucide-react';

export const FormularioTarea: React.FC = () => {
  const dispatch = useDispatch();
  const creadores = useSelector((state: RootState) => state.creadores.items);
  const creadorActual = useSelector((state: RootState) => state.configuracion.appState.creadorActual);
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempoEstimado, setTiempoEstimado] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim() && creadorActual && empresaActual) {
      dispatch(
        agregarTarea({
          empresaId: empresaActual,
          tarea: {
            id: Date.now().toString(),
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            creador: creadorActual,
            estado: 'pendiente',
            fechaCreacion: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
            tiempoEstimado: tiempoEstimado ? parseInt(tiempoEstimado) : undefined,
            tiemposRegistrados: [],
          }
        })
      );
      setTitulo('');
      setDescripcion('');
      setTiempoEstimado('');
    }
  };

  const creadorSeleccionado = creadores.find(c => c.id === creadorActual);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
            Título de la Tarea
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Título de la tarea"
            required
          />
        </div>
        <div>
          <label htmlFor="tiempoEstimado" className="block text-sm font-medium text-gray-700">
            Tiempo Estimado (minutos)
          </label>
          <input
            type="number"
            id="tiempoEstimado"
            value={tiempoEstimado}
            onChange={(e) => setTiempoEstimado(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Tiempo en minutos"
            min="1"
          />
        </div>
      </div>
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Descripción detallada de la tarea"
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Creador: {creadorSeleccionado?.nombre || 'Seleccione un creador'}
        </div>
        <button
          type="submit"
          disabled={!creadorActual}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Tarea
        </button>
      </div>
    </form>
  );
}