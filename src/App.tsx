/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { blockchain } from './lib/blockchain';
import { Student, Transaction, Block, SchoolReward } from './types';
import ClassOverview from './components/ClassOverview';
import StudentListManager from './components/StudentListManager';
import StudentDashboard from './components/StudentDashboard';
import BlockExplorer from './components/BlockExplorer';
import NetworkStatus from './components/NetworkStatus';
import { GraduationCap, Users, Database, Sparkles, BookOpen, FileText, X, AlertCircle } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mempoolCount, setMempoolCount] = useState<number>(0);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'docente' | 'alumno' | 'blockchain'>('docente');
  
  // Rules modal state
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const unsubscribe = blockchain.subscribe((data) => {
      setStudents([...data.students]);
      setTransactions([...data.transactions]);
      setBlocks([...data.blocks]);
      setMempoolCount(blockchain.getPendingTransactionsLength());
    });
    return unsubscribe;
  }, []);

  // Handlers mapped to Blockchain Service
  const handleAddStudent = (name: string) => {
    blockchain.addStudent(name);
  };

  const handleRemoveStudent = (id: string) => {
    blockchain.removeStudent(id);
  };

  const handleAwardStudent = (id: string, amount: number, memo: string) => {
    blockchain.awardStudent(id, amount, memo);
  };

  const handleDeductStudent = (id: string, amount: number, memo: string) => {
    blockchain.deductStudent(id, amount, memo);
  };

  const handleRedeemReward = (studentId: string, reward: SchoolReward): string => {
    return blockchain.redeemReward(studentId, reward);
  };

  const handleMineBlock = () => {
    blockchain.mineBlockManually();
  };

  return (
    <div className="min-h-screen bg-surface-950 font-sans text-slate-100 selection:bg-brand-primary/30 selection:text-brand-primary pb-16">
      {/* Top Header & Console Switcher */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl px-4 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-white">
                Red <span className="text-brand-primary">EduBit</span>
              </h1>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Consenso Escolar - 5to Año
              </div>
            </div>
          </div>

          {/* Core Panel Tabs switcher */}
          <div className="flex items-center p-1 bg-surface-950 rounded-2xl border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveTab('docente')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'docente' 
                  ? 'bg-brand-primary text-surface-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users size={14} />
              🔑 Aula Docente
            </button>
            <button 
              onClick={() => setActiveTab('alumno')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'alumno' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={14} />
              🎓 Vista Alumno
            </button>
            <button 
              onClick={() => setActiveTab('blockchain')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                activeTab === 'blockchain' 
                  ? 'bg-white text-surface-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database size={14} />
              <span>🔗 Blockchain Lab</span>
              {mempoolCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950">
                  {mempoolCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Info & Help */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowRules(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-800 border border-white/5 text-xs font-bold text-slate-300 hover:bg-surface-700 hover:text-white transition-all flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-brand-primary" />
              Reglas del Aula
            </button>
          </div>

        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-8">
        
        {/* Interactive Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <NetworkStatus />
          <div className="text-right flex items-center gap-2 justify-end bg-surface-900/40 px-4 py-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              ESTADO DEL SISTEMA:
            </span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-extrabold border border-emerald-500/20">
              VALOR FIJO (RE COMPENSACIÓN ACADÉMICA)
            </span>
          </div>
        </div>

        {/* Dynamic Display based on active tab */}
        <div className="transition-all duration-300">
          {activeTab === 'docente' && (
            <div className="space-y-8">
              {/* Class stats */}
              <ClassOverview students={students} />
              
              {/* Main student management view */}
              <StudentListManager 
                students={students}
                onAddStudent={handleAddStudent}
                onRemoveStudent={handleRemoveStudent}
                onAward={handleAwardStudent}
                onDeduct={handleDeductStudent}
              />
            </div>
          )}

          {activeTab === 'alumno' && (
            <StudentDashboard 
              students={students}
              transactions={transactions}
              onRedeem={handleRedeemReward}
            />
          )}

          {activeTab === 'blockchain' && (
            <BlockExplorer 
              blocks={blocks}
              pendingTransactions={transactions.filter(t => t.status === 'PENDING')}
              onMine={handleMineBlock}
            />
          )}
        </div>

      </main>

      {/* Background Decor */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full opacity-10">
        <div className="absolute left-[5%] top-[10%] h-96 w-96 rounded-full bg-brand-primary/10 blur-[150px]" />
        <div className="absolute bottom-[5%] right-[5%] h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* DIALOG DE REGLAS DE CONDUCTA */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="w-full max-w-lg bg-surface-850 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="text-brand-primary h-5 w-5" />
                <h4 className="text-base font-extrabold text-white">Manual del Token Educativo "EduBits" (EB)</h4>
              </div>
              <button 
                onClick={() => setShowRules(false)}
                className="text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-300 leading-relaxed text-left">
              <p>
                Los <strong>EduBits</strong> (EB) son unidades estables (tokens de canje) concebidos para gamificar
                el aula mediante el reconocimiento de buenas prácticas académicas y de conducta.
              </p>

              <div className="space-y-2 border-l-2 border-brand-primary pl-3 py-1">
                <h5 className="font-bold text-white text-xs">Propiedades Fundamentales:</h5>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><strong>Emisor Único:</strong> Solo el docente a cargo tiene la autoridad técnica de acreditar o debitar tokens.</li>
                  <li><strong>Moneda Estable:</strong> El valor no sube ni baja, garantizando que el esfuerzo de los alumnos conserve un precio de canje justo.</li>
                  <li><strong>Ecosistema Transparente:</strong> El ledger público de blockchain expone hashes matemáticos y nonces para que los alumnos aprendan cómo se acuñan y asocian bloques de datos secuenciales.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h5 className="font-bold text-white text-xs">Guía de Equivalencias de Canje:</h5>
                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1.5">
                  <div className="p-2.5 bg-surface-900 rounded-lg">
                    <p className="font-bold text-emerald-400">👍 Acciones de Acreditación:</p>
                    <ul className="list-none space-y-1 text-slate-400 mt-1">
                      <li>• Participar en clase: +10 EB</li>
                      <li>• Tarea completa: +15 EB</li>
                      <li>• Ayudar a un par: +20 EB</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-surface-900 rounded-lg">
                    <p className="font-bold text-red-400">⚠️ Acciones de Dedepreciación:</p>
                    <ul className="list-none space-y-1 text-slate-400 mt-1">
                      <li>• Uso del móvil sin permiso: -10 EB</li>
                      <li>• Desorden o falta de tarea: -10 EB</li>
                      <li>• Llegada tarde: -5 EB</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-xl flex gap-2 items-start text-[10px]">
                <AlertCircle size={18} className="shrink-0 text-blue-400" />
                <span>
                  <strong>Nota informática:</strong> Esta red funciona sobre un ledger inmutable local in-browser. Todo está sellado con hashes SHA-256 concatenados para garantizar una enseñanza fidedigna de las blockchains.
                </span>
              </div>
            </div>

            <div className="p-4 bg-surface-900/60 border-t border-white/5 text-right">
              <button 
                onClick={() => setShowRules(false)}
                className="px-4 py-2 bg-brand-primary text-surface-950 font-black rounded-xl text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
