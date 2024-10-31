import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Building2 } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { nombre } = useSelector((state: RootState) => state.configuracion);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {nombre || 'Sistema de Gestión de Tareas'}
              </h1>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}