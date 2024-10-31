import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actualizarEstadoTarea, agregarTiempoTarea } from '../store/tareasSlice';
import { RootState } from '../store/store';
import { Tarea, TiempoRegistrado } from '../types';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface TarjetaTareaProps {
  tarea: Tarea;
  columnaActual: string;
}

const obtenerColorTarjeta = (estado: Tarea['estado']) => {
  switch (estado) {
    case 'pendiente':
      return 'bg-red-50';
    case 'en-proceso':
      return 'bg-yellow-50';
    case 'terminada':
      return 'bg-green-50';
    default:
      return 'bg-gray-50';
  }
};

export const TarjetaTarea: React.FC<TarjetaTareaProps> = ({ tarea, columnaActual }) => {
  const dispatch = useDispatch();
  const empresaActual = useSelector((state: RootState) => state.configuracion.appState.empresaActual);
  const creadores = useSelector((state: RootState) => state.creadores.items);
  const [mostrarFormTiempo, setMostrarFormTiempo] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [tiempoNuevo, setTiempoNuevo] = useState('');
  const [descripcionTiempo, setDescripcionTiempo] = useState('');

  const creador = useMemo(() => 
    creadores.find(c => c.id === tarea.creador),
    [creadores, tarea.creador]
  );

  const tiemposRegistrados = useMemo(() => 
    tarea.tiemposRegistrados || [],
    [tarea.tiemposRegistrados]
  );

  const tiempoTotal = useMemo(() => 
    tiemposRegistrados.reduce((acc, curr) => acc + (curr.minutos || 0), 0),
    [tiemposRegistrados]
  );

  const tiemposOrdenados = useMemo(() => 
    [...tiemposRegistrados].sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    ),
    [tiemposRegistrados]
  );

  const formatearTiempo = (minutos?: number) => {
    if (!minutos) return '0h 0m';
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return `${horas}h ${minutosRestantes}m`;
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAgregarTiempo = (e: React.FormEvent) => {
    e.preventDefault();
    if (tiempoNuevo && descripcionTiempo && empresaActual) {
      const tiempo: Omit<TiempoRegistrado, 'fecha'> = {
        minutos: parseInt(tiempoNuevo),
        descripcion: descripcionTiempo.trim(),
      };

      dispatch(
        agregarTiempoTarea({
          empresaId: empresaActual,
          id: tarea.id,
          tiempo,
        })
      );
      setTiempoNuevo('');
      setDescripcionTiempo('');
      setMostrarFormTiempo(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg hover:shadow-md transition-shadow ${obtenerColorTarjeta(tarea.estado)}`}>
      <h3 className="text-sm font-medium text-gray-900">{tarea.titulo}</h3>
      <p className="text-xs text-gray-600 mt-1">{tarea.descripcion}</p>
      <p className="text-xs text-gray-500 mt-1">Creador: {creador?.nombre}</p>
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500">
          Tiempo estimado: {formatearTiempo(tarea.tiempoEstimado)}
        </p>
        <p className="text-xs text-gray-500">
          Tiempo total registrado: {formatearTiempo(tiempoTotal)}
        </p>
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMostrarFormTiempo(!mostrarFormTiempo)}
            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-900"
          >
            <Clock className="h-3 w-3 mr-1" />
            Registrar tiempo
          </button>
          {tiemposOrdenados.length > 0 && (
            <button
              onClick={() => setMostrarHistorial(!mostrarHistorial)}
              className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
            >
              {mostrarHistorial ? (
                <ChevronUp className="h-3 w-3 mr-1" />
              ) : (
                <ChevronDown className="h-3 w-3 mr-1" />
              )}
              Historial de tiempos
            </button>
          )}
        </div>

        {mostrarFormTiempo && (
          <form onSubmit={handleAgregarTiempo} className="space-y-2">
            <input
              type="number"
              value={tiempoNuevo}
              onChange={(e) => setTiempoNuevo(e.target.value)}
              className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Minutos trabajados"
              min="1"
              required
            />
            <input
              type="text"
              value={descripcionTiempo}
              onChange={(e) => setDescripcionTiempo(e.target.value)}
              className="block w-full text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Descripción del trabajo realizado"
              required
            />
            <button
              type="submit"
              className="w-full text-xs bg-indigo-600 text-white rounded-md py-1 hover:bg-indigo-700"
            >
              Guardar tiempo
            </button>
          </form>
        )}

        {mostrarHistorial && tiemposOrdenados.length > 0 && (
          <div className="mt-2 space-y-2 text-xs">
            <h4 className="font-medium text-gray-700">Registro de tiempos:</h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {tiemposOrdenados.map((tiempo, index) => (
                <div
                  key={index}
                  className="p-2 bg-white rounded border border-gray-200"
                >
                  <div className="flex justify-between text-gray-600">
                    <span>{formatearTiempo(tiempo.minutos)}</span>
                    <span>{formatearFecha(tiempo.fecha)}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{tiempo.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {columnaActual !== 'pendiente' && (
            <button
              onClick={() =>
                dispatch(actualizarEstadoTarea({ 
                  empresaId: empresaActual,
                  id: tarea.id, 
                  estado: 'pendiente' 
                }))
              }
              className="text-xs text-indigo-600 hover:text-indigo-900"
            >
              ← Mover a Pendiente
            </button>
          )}
          {columnaActual !== 'en-proceso' && (
            <button
              onClick={() =>
                dispatch(actualizarEstadoTarea({ 
                  empresaId: empresaActual,
                  id: tarea.id, 
                  estado: 'en-proceso' 
                }))
              }
              className="text-xs text-indigo-600 hover:text-indigo-900"
            >
              {columnaActual === 'pendiente' ? 'Mover a En Proceso →' : '← Mover a En Proceso'}
            </button>
          )}
          {columnaActual !== 'terminada' && (
            <button
              onClick={() =>
                dispatch(actualizarEstadoTarea({ 
                  empresaId: empresaActual,
                  id: tarea.id, 
                  estado: 'terminada' 
                }))
              }
              className="text-xs text-indigo-600 hover:text-indigo-900"
            >
              Mover a Terminada →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};