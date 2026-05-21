/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../types';
import { Plus, Trash2, Award, ShieldAlert, Coins, HelpCircle, Check, CircleDot, UserPlus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentListManagerProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onRemoveStudent: (id: string) => void;
  onAward: (id: string, amount: number, memo: string) => void;
  onDeduct: (id: string, amount: number, memo: string) => void;
}

const PRESET_AWARDS = [
  { label: 'Participación Activa', amount: 10 },
  { label: 'Tarea Completa', amount: 15 },
  { label: 'Puntualidad Absoluta', amount: 5 },
  { label: 'Ayudar a un Compañero', amount: 20 },
  { label: 'Excelente Conducta', amount: 15 }
];

const PRESET_DEDUCTIONS = [
  { label: 'Uso Inapropiado de Pantalla', amount: 10 },
  { label: 'Falta de Respeto', amount: 15 },
  { label: 'Falta de Entrega de Tareas', amount: 10 },
  { label: 'Desorden en Aula', amount: 5 },
  { label: 'Impuntualidad', amount: 5 }
];

export default function StudentListManager({
  students,
  onAddStudent,
  onRemoveStudent,
  onAward,
  onDeduct,
}: StudentListManagerProps) {
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  // Custom transaction formulation state
  const [txType, setTxType] = useState<'award' | 'deduct'>('award');
  const [txAmount, setTxAmount] = useState<string>('10');
  const [txMemo, setTxMemo] = useState<string>('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const submitAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    try {
      onAddStudent(newStudentName);
      setNewStudentName('');
      showFeedback('¡Alumno registrado en la blockchain!');
    } catch (e: any) {
      setErrorMessage(e.message || 'Error registrando estudiante');
    }
  };

  const handleApplyPreset = (reason: string, amt: number) => {
    setTxMemo(reason);
    setTxAmount(amt.toString());
  };

  const executeBehaviorTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    
    const amt = parseFloat(txAmount);
    if (!txAmount || isNaN(amt) || amt <= 0) {
      setErrorMessage('Por favor ingresa una cantidad válida de EduBits');
      return;
    }
    
    if (!txMemo.trim()) {
      setErrorMessage('Debes escribir o elegir una justificación/motivo en el memo');
      return;
    }

    try {
      if (txType === 'award') {
        onAward(selectedStudentId, amt, txMemo.trim());
        showFeedback('¡EduBits otorgados y registrados con éxito!');
      } else {
        onDeduct(selectedStudentId, amt, txMemo.trim());
        showFeedback('¡Sanción aplicada y descontada de la billetera!');
      }
      
      // Clean up local states
      setTxMemo('');
      setSelectedStudentId(null);
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error en transacción escolar');
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const activeStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in">
      {/* Columna Izquierda: Listado de Alumnos */}
      <div className="lg:col-span-7 bg-surface-800 p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Registro de Estudiantes</h3>
            <p className="text-xs text-slate-400">Total de alumnos en el padrón electoral: {students.length}</p>
          </div>
          
          {/* Formulario de Registro Rápido */}
          <form onSubmit={submitAddStudent} className="flex gap-2">
            <input 
              type="text"
              placeholder="Nombre del alumno..."
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-surface-900 border border-white/10 text-white outline-none focus:border-brand-primary placeholder:text-slate-600 transition-all w-48"
            />
            <button 
              type="submit"
              className="px-3 py-2 bg-brand-primary hover:bg-brand-secondary text-surface-900 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <UserPlus size={14} />
              Agregar
            </button>
          </form>
        </div>

        {/* Alerta de feedback */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Check size={14} />
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listado de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {students.map((student, idx) => {
            const isSelected = student.id === selectedStudentId;
            return (
              <div 
                key={student.id}
                className={`p-4 rounded-2xl border transition-all text-left relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-brand-primary/10 border-brand-primary/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                    : 'bg-surface-900/60 border-white/5 hover:bg-surface-900 hover:border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      RANGO #{idx + 1}
                    </span>
                    <button 
                      onClick={() => onRemoveStudent(student.id)}
                      title="Dar de baja de la blockchain escolar"
                      className="text-slate-600 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-slate-100 truncate text-base">{student.name}</h4>
                  <code className="text-[9px] font-mono text-slate-500 block truncate mt-1">
                    WALLET: {student.address}
                  </code>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-brand-primary">{student.balance}</span>
                    <span className="text-[9px] font-bold text-brand-secondary">EB</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setErrorMessage('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-brand-primary text-surface-900 shadow-md' 
                        : 'bg-surface-800 text-slate-300 hover:bg-surface-700 hover:text-white'
                    }`}
                  >
                    Asignar Conducta
                  </button>
                </div>
              </div>
            );
          })}

          {students.length === 0 && (
            <div className="sm:col-span-2 flex flex-col items-center justify-center py-16 text-slate-500">
              <CircleDot size={44} className="opacity-20 mb-3 animate-pulse" />
              <p className="text-sm font-semibold">El aula virtual está vacía</p>
              <p className="text-xs text-slate-600 mt-1">Usa la casilla superior para registrar tus primeros alumnos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Consola de Transacciones de Comportamiento */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {selectedStudentId && activeStudent ? (
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/10 shadow-xl space-y-5 animate-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Crear Bloque de Acción</span>
                <h3 className="text-lg font-bold text-white truncate max-w-[200px]">{activeStudent.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedStudentId(null)}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold px-2 py-1 rounded hover:bg-white/5"
              >
                Cancelar
              </button>
            </div>

            {/* Selector de Tipo Premio / Sanción */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-900 rounded-xl border border-white/5">
              <button 
                type="button"
                onClick={() => {
                  setTxType('award');
                  setTxMemo('');
                }}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  txType === 'award' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award size={14} />
                Premiar (+ EB)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setTxType('deduct');
                  setTxMemo('');
                }}
                className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  txType === 'deduct' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert size={14} />
                Sancionar (- EB)
              </button>
            </div>

            {/* Presets Rápidos */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Comportamientos Predeterminados
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(txType === 'award' ? PRESET_AWARDS : PRESET_DEDUCTIONS).map(preset => (
                  <button 
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.label, preset.amount)}
                    className="px-2.5 py-1.5 bg-surface-900 border border-white/5 hover:border-brand-primary/30 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
                  >
                    {preset.label} ({txType === 'award' ? '+' : '-'}{preset.amount})
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario Detallado */}
            <form onSubmit={executeBehaviorTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Coins size={12} /> Cantidad EB
                  </label>
                  <input 
                    type="number"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    min="1"
                    placeholder="10"
                    className="w-full text-sm font-bold bg-surface-900 text-slate-100 p-3 rounded-xl border border-white/10 outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    Saldo Resultante
                  </label>
                  <div className="h-11 px-3 bg-surface-900/50 rounded-xl border border-white/5 flex items-center text-xs font-mono font-bold text-slate-400">
                    {txType === 'award' 
                      ? activeStudent.balance + (parseFloat(txAmount) || 0)
                      : Math.max(0, activeStudent.balance - (parseFloat(txAmount) || 0))} EB
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  Justificación (Memo de Blockchain)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Por qué se realiza esta transacción..."
                  value={txMemo}
                  onChange={(e) => setTxMemo(e.target.value)}
                  className="w-full text-xs bg-surface-900 text-slate-100 p-3 rounded-xl border border-white/10 outline-none focus:border-brand-primary resize-none placeholder:text-slate-600"
                />
              </div>

              {errorMessage && (
                <div className="text-[11px] font-bold text-red-400 p-2.5 rounded-lg bg-red-400/5 border border-red-400/15">
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit"
                className={`w-full p-3 rounded-xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1 ${
                  txType === 'award' 
                    ? 'bg-emerald-500 hover:bg-emerald-400' 
                    : 'bg-red-500 hover:bg-red-400'
                }`}
              >
                {txType === 'award' ? 'Otorgar Recompensa' : 'Aplicar Sanción'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-surface-800/40 p-8 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center text-slate-500 flex-1 min-h-[300px]">
            <Info size={36} className="text-slate-600 mb-2" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Centro de Comando Docente</p>
            <p className="text-[11px] text-slate-500 max-w-[240px] mt-2">
              Selecciona un alumno del listado para acreditarle EduBits o aplicarle un débito por conducta. El cambio ingresará primero al mempool de la escuela.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
