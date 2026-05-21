/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Transaction, SchoolReward } from '../types';
import { DEFAULT_SCHOOL_REWARDS } from '../lib/blockchain';
import { CircleUser, HelpCircle, ShoppingBag, Eye, Copy, Check, Ticket, Award, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface StudentDashboardProps {
  students: Student[];
  transactions: Transaction[];
  onRedeem: (studentId: string, reward: SchoolReward) => void;
}

export default function StudentDashboard({
  students,
  transactions,
  onRedeem,
}: StudentDashboardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [voucherReward, setVoucherReward] = useState<{ reward: SchoolReward; studentName: string; txHash: string } | null>(null);

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Filter transactions matching the selected student
  const studentTx = activeStudent
    ? transactions.filter(t => t.studentId === activeStudent.id)
    : [];

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemClick = (reward: SchoolReward) => {
    if (!activeStudent) return;
    if (activeStudent.balance < reward.cost) return;

    try {
      const txHash = onRedeem(activeStudent.id, reward);
      
      // Trigger canvas confetti animation for successful prize purchase
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#3B82F6', '#10B981', '#ffffff']
      });

      // Show digital certified reward voucher
      setVoucherReward({
        reward,
        studentName: activeStudent.name,
        txHash
      });
    } catch (e: any) {
      alert(e.message || 'Error al canjear premio.');
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Selector de Perfil del alumno */}
      <div className="bg-surface-800 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <CircleUser size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Portal de Alumnos de 5to</h3>
            <p className="text-xs text-slate-400">Selecciona tu perfil de estudiante para consultar o canjear tus EduBits.</p>
          </div>
        </div>

        <div className="relative">
          <select 
            value={selectedStudentId}
            onChange={(e) => {
              setSelectedStudentId(e.target.value);
              setVoucherReward(null);
            }}
            className="w-full md:w-64 bg-surface-900 text-slate-200 text-xs font-bold rounded-xl border border-white/10 px-4 py-3 outline-none focus:border-brand-primary appearance-none cursor-pointer"
          >
            <option value="">-- Seleccionar mi Nombre --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.balance} EB)
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
             ▼
          </div>
        </div>
      </div>

      {activeStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card de Billetera Personal & Tienda */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Balance Card Personal */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/40 to-surface-800 p-6 border border-blue-500/20 shadow-xl">
              <div className="absolute right-0 top-0 p-6 opacity-5">
                <Ticket size={120} />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                    Cuentahabiente Autorizado
                  </span>
                  <h4 className="text-2xl font-black text-white">{activeStudent.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono text-slate-400 block truncate max-w-[200px]">
                      {activeStudent.address}
                    </code>
                    <button 
                      onClick={() => copyAddress(activeStudent.address)}
                      className="text-slate-500 hover:text-white transition-colors"
                      title="Copiar dirección de blockchain"
                    >
                      {copied ? <Check size={14} className="text-brand-primary" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-8">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                    Mi Saldo Actual
                  </span>
                  <div className="flex items-baseline justify-end gap-1.5 mt-1">
                    <span className="text-4xl font-extrabold text-brand-primary">
                      {activeStudent.balance}
                    </span>
                    <span className="text-base font-bold text-brand-secondary">EduBits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tienda Escolar / Canjeables */}
            <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-brand-primary" />
                  <h4 className="font-bold text-white text-base">Tienda Escolar de Recompensas</h4>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Estable y Sin Fluctuaciones (1 EB = 1 Token)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEFAULT_SCHOOL_REWARDS.map(reward => {
                  const cannotAfford = activeStudent.balance < reward.cost;
                  return (
                    <div 
                      key={reward.id}
                      className="p-4 rounded-2xl bg-surface-900 border border-white/5 flex flex-col justify-between gap-4 hover:border-brand-primary/20 transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1.5">
                          <h5 className="font-bold text-slate-100 text-sm">{reward.title}</h5>
                          <span className="shrink-0 bg-blue-500/15 text-blue-400 text-xs px-2.5 py-1 rounded-full font-bold">
                            {reward.cost} EB
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {reward.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRedeemClick(reward)}
                        disabled={cannotAfford}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                          cannotAfford 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95 shadow-md'
                        }`}
                      >
                        {cannotAfford ? 'EduBits Insuficientes' : 'Pedir / Canjear'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Historial de Movimientos de este Alumno */}
          <div className="lg:col-span-4 bg-surface-800 p-5 rounded-3xl border border-white/5 flex flex-col justify-between gap-4 min-h-[400px]">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Historial de {activeStudent.name}
              </h4>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {studentTx.map(tx => {
                  const isPositive = tx.amount > 0;
                  return (
                    <div key={tx.id} className="p-3 bg-surface-900 rounded-xl border border-white/5 space-y-1.5 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-bold uppercase rounded-md px-1.5 py-0.5 ${
                          tx.type === 'credit' ? 'bg-emerald-500/15 text-emerald-400' :
                          tx.type === 'debit' ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {tx.type === 'credit' ? 'Premio' : tx.type === 'debit' ? 'Sanción' : 'Canje'}
                        </span>
                        
                        <span className={`text-xs font-mono font-bold ${
                          isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {isPositive ? '+' : ''}{tx.amount} EB
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-200 font-medium font-sans">
                        {tx.memo}
                      </p>

                      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/5 text-[9px] font-mono text-slate-500">
                        <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          {tx.status === 'CONFIRMED' ? (
                            <span className="text-emerald-500 flex items-center gap-0.5 font-bold">
                              <CheckCircle size={8} /> CONFIRMADO
                            </span>
                          ) : (
                            <span className="text-amber-500 flex items-center gap-0.5 font-bold">
                              <Clock size={8} className="animate-spin" /> PENDIENTE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {studentTx.length === 0 && (
                  <p className="text-xs text-slate-600 italic text-center py-12">
                    Sin operaciones grabadas para esta clave escolar.
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-950 border border-white/5 text-[10px] text-slate-400 leading-relaxed flex items-start gap-1.5">
              <span>💡</span>
              <span>Todos los movimientos quedan registrados en la Red Blockchain de forma pública y no mutable.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-800/40 p-12 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center text-slate-500 min-h-[350px]">
          <ShoppingBag size={44} className="text-slate-600 mb-3" />
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Portal del Estudiante</p>
          <p className="text-xs text-slate-500 max-w-[280px] mt-2 leading-relaxed">
            Por favor, selecciona tu nombre de la lista superior para ingresar a tu billetera escolar privada, ver tu historial de conducta y cambiar tus EduBits acumulados por cupones físicos.
          </p>
        </div>
      )}

      {/* MODAL DE VOUCHER CERTIFICADO */}
      <AnimatePresence>
        {voucherReward && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-surface-800 rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl font-sans"
            >
              {/* Encabezado Certificado */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-center text-white space-y-1 relative">
                <div className="absolute top-4 right-4 bg-white/10 px-2 py-0.5 rounded text-[9px] font-bold">
                  CONTRATO INTELIGENTE
                </div>
                <Ticket className="mx-auto text-yellow-300 h-10 w-10 animate-bounce mb-2" />
                <h4 className="text-lg font-black uppercase tracking-widest">Vale de Recompensa</h4>
                <p className="text-xs text-blue-200">Certificación de Canje Registrado en Blockchain</p>
              </div>

              {/* Cuerpo del cupón */}
              <div className="p-6 space-y-5 text-left bg-surface-800">
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Beneficiario (Alumno)</span>
                    <span className="text-base font-extrabold text-white">{voucherReward.studentName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Premio Canjeado</span>
                      <span className="text-sm font-bold text-blue-400">{voucherReward.reward.title}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Costo Debitado</span>
                      <span className="text-sm font-bold text-emerald-400">{voucherReward.reward.cost} EduBits</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Instrucciones del Premio</span>
                    <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">
                      "Presenta este ticket digital al docente a cargo para gozar de tu beneficio: {voucherReward.reward.description}"
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-dashed border-white/10 pt-4">
                  <div className="p-2.5 bg-surface-900 rounded-xl space-y-1 text-[10px] font-mono">
                    <span className="text-blue-400/80 uppercase font-black tracking-wider block">ID de Transacción Immutable</span>
                    <p className="text-slate-400 break-all text-[9.5px] leading-tight select-all">
                      {voucherReward.txHash}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>SELLO DIGITAL: SHA-256 SECURE</span>
                    <span>BLOQUE: #PENDIENTE (MINE DEL CURSO)</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => setVoucherReward(null)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors active:scale-95"
                >
                  Cerrar e ir al Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
