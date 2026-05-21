/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Student } from '../types';
import { BarChart3, Group, Trophy, Landmark } from 'lucide-react';

interface ClassOverviewProps {
  students: Student[];
}

export default function ClassOverview({ students }: ClassOverviewProps) {
  const totalTokens = students.reduce((sum, s) => sum + s.balance, 0);
  const averageBalance = students.length > 0 ? (totalTokens / students.length).toFixed(1) : '0';
  
  // Find top student
  const topStudent = students.length > 0 
    ? [...students].sort((a, b) => b.balance - a.balance)[0]
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in">
      {/* Box 1: Total Class Pools */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 p-5 border border-white/5 shadow-lg">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-primary/10 blur-xl" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Fondo del Curso</span>
          <Landmark className="text-brand-primary h-5 w-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-whiteTracking-tight">{totalTokens}</span>
          <span className="text-sm font-semibold text-brand-secondary">EB</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Suma acumulada de todos los alumnos en la red</p>
      </div>

      {/* Box 2: average */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 p-5 border border-white/5 shadow-lg">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-xl" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Promedio por Alumno</span>
          <BarChart3 className="text-blue-400 h-5 w-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{averageBalance}</span>
          <span className="text-sm font-semibold text-blue-400">EB</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Media equitativa de comportamiento y participación</p>
      </div>

      {/* Box 3: Top Student */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-800 to-surface-700 p-5 border border-white/5 shadow-lg">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-yellow-500/10 blur-xl" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Líderes de Conducta</span>
          <Trophy className="text-yellow-500 h-5 w-5" />
        </div>
        {topStudent ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[120px] inline-block">{topStudent.name}</span>
              <span className="text-base font-bold text-yellow-500">{topStudent.balance} EB</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Mayor interacción positiva y colaboración escolar</p>
          </div>
        ) : (
          <div>
            <span className="text-sm font-bold text-slate-500 italic">No hay alumnos</span>
            <p className="text-[10px] text-slate-500 mt-1">Agrega alumnos para iniciar el ranking</p>
          </div>
        )}
      </div>
    </div>
  );
}
