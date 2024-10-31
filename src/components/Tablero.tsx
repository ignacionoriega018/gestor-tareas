import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FormularioTarea } from './FormularioTarea';
import { TarjetaTarea } from './TarjetaTarea';
import { GestionCreadores } from './GestionCreadores';
import { Tarea } from '../types';

const columnas = [
  { id: 'pendiente', titulo: 'Pendiente' },
  { id: 'en-proceso', titulo: 'En Proceso' },
  { id: 'terminada', titulo: 'Terminada' },
] as const;

export const Tablero: React.FC = () => {
  const empresaActual = useSelector((state: RootState) => 
    state.configuracion.appState.empresaActual
  );
  
  const tareas = useSelector((state: RootState) => {
    if (!empresaActual || !state.tareas.items[empresaActual]) {
      return [];
    }
    return [...state.tareas.items[empresaActual]];
  });

  const creadores = useSelector((state: RootState) => state.creadores.items);

  const exportarExcel = () => {
    try {
      const tareasParaExportar = tareas.map((tarea) => {
        const creador = creadores.find((c) => c.id === tarea.creador);
        const tiempoTotal = Array.isArray(tarea.tiemposRegistrados)
          ? tarea.tiemposRegistrados.reduce((acc, curr) => acc + (curr.minutos || 0), 0)
          : 0;

        return {
          'Estado': columnas.find(col => col.id === tarea.estado)?.titulo || tarea.estado,
          'Título': tarea.titulo || '',
          'Descripción': tarea.descripcion || '',
          'Creador': creador?.nombre || 'Desconocido',
          'Fecha Creación': tarea.fechaCreacion || '',
          'Fecha Finalización': tarea.fechaFinalizacion || '',
          'Tiempo Estimado (min)': tarea.tiempoEstimado || 0,
          'Tiempo Total (min)': tiempoTotal,
          'Registros de Tiempo': Array.isArray(tarea.tiemposRegistrados)
            ? tarea.tiemposRegistrados
                .map((t) => `${t.minutos}min - ${t.descripcion} (${t.fecha})`)
                .join('\n')
            : '',
        };
      });

      if (tareasParaExportar.length === 0) {
        alert('No hay tareas para exportar');
        return;
      }

      const ws = XLSX.utils.json_to_sheet(tareasParaExportar);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tareas');

      ws['!cols'] = [
        { wch: 15 }, // Estado
        { wch: 30 }, // Título
        { wch: 40 }, // Descripción
        { wch: 20 }, // Creador
        { wch: 20 }, // Fecha Creación
        { wch: 20 }, // Fecha Finalización
        { wch: 15 }, // Tiempo Estimado
        { wch: 15 }, // Tiempo Total
        { wch: 50 }, // Registros de Tiempo
      ];

      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      
      saveAs(
        data,
        `tareas-${new Date().toLocaleDateString('es-AR')}.xlsx`
      );
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al exportar el archivo Excel');
    }
  };

  if (!empresaActual) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona o crea una empresa para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GestionCreadores />
      <div className="flex justify-between items-center">
        <FormularioTarea />
        <button
          onClick={exportarExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Tareas
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columnas.map((columna) => (
          <div key={columna.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {columna.titulo}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {tareas
                .filter((tarea) => tarea.estado === columna.id)
                .map((tarea) => (
                  <TarjetaTarea
                    key={tarea.id}
                    tarea={tarea}
                    columnaActual={columna.id}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};