/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Block, Transaction } from '../types';
import { Box, ArrowDown, Database, Terminal, Cpu, Hammer, ShieldAlert, BadgeCheck, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlockExplorerProps {
  blocks: Block[];
  pendingTransactions: Transaction[];
  onMine: () => void;
}

export default function BlockExplorer({
  blocks,
  pendingTransactions,
  onMine,
}: BlockExplorerProps) {
  const [isMining, setIsMining] = useState(false);
  const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);
  const [jsonViewBlock, setJsonViewBlock] = useState<Block | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const triggerMining = () => {
    if (pendingTransactions.length === 0) return;
    setIsMining(true);
    
    // Simulate mining mathematical problem finding nonce
    setTimeout(() => {
      onMine();
      setIsMining(false);
      setSuccessMsg('¡Nuevo bloque minado y acuñado con éxito!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 2000);
  };

  const toggleBlockExpand = (index: number) => {
    setExpandedBlockIndex(expandedBlockIndex === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-in" style={{ animationDelay: '0.2s' }}>
      {/* Explicación Blockchain */}
      <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <Database className="text-brand-primary h-6 w-6" />
          <h3 className="text-lg font-extrabold text-white tracking-tight">Laboratorio Interactivo de Blockchain</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          En esta sección se puede experimentar cómo funciona la estructura técnica de una red de bloques descentralizada. 
          Cada vez que un maestro otorga puntos o un alumno canjea un premio, la acción va a la memoria temporal (Mempool) 
          y no se puede manipular hasta que es <strong>minada y sellada</strong> criptográficamente en un nuevo bloque inmutable.
        </p>
        
        {/* Leyenda Didáctica */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-surface-900/50 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Mempool (Fila de Espera)
            </span>
            <p className="text-[10px] text-slate-400">Es donde las operaciones pendientes esperan verificación para ser agrupadas.</p>
          </div>
          <div className="p-3 bg-surface-900/50 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Nonce & Hash Criptográfico
            </span>
            <p className="text-[10px] text-slate-400">Un número único generado por cálculo matemático que inicia el hash con ceros.</p>
          </div>
          <div className="p-3 bg-surface-900/50 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" /> Enlace (Hash Anterior)
            </span>
            <p className="text-[10px] text-slate-400">Cada bloque depende del anterior. Modificar uno invalida toda la cadena.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Izquierda: Mempool & Sellar Bloque */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[9px] font-bold text-amber-500 uppercase">Espacio Temporal</span>
                <h4 className="text-base font-bold text-white">Fila de Memoria (Mempool)</h4>
              </div>
              <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-1 rounded-full border border-amber-500/20">
                {pendingTransactions.length} txs
              </span>
            </div>

            {/* Listado Mempool */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1.5 custom-scrollbar">
              {pendingTransactions.map(tx => (
                <div key={tx.id} className="p-3 bg-surface-900 rounded-xl border border-dashed border-amber-500/20 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400 font-bold">{tx.from}</span>
                    <span className="text-amber-500 font-bold">{tx.amount} EB</span>
                  </div>
                  <p className="text-[11px] text-slate-200 truncate">{tx.memo}</p>
                  <code className="text-[8px] font-mono text-slate-500 block truncate">TX: {tx.hash}</code>
                </div>
              ))}

              {pendingTransactions.length === 0 && (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <Terminal size={28} className="mx-auto opacity-25" />
                  <p className="text-xs font-semibold italic text-slate-400">Mempool vacía</p>
                  <p className="text-[10px] text-slate-500 max-w-[180px] mx-auto leading-relaxed">
                    Las acciones de los alumnos ya están aseguradas en la cadena local. Crea nuevas conductas para poblar el mempool.
                  </p>
                </div>
              )}
            </div>

            {/* Botón de Sellar Bloque */}
            {pendingTransactions.length > 0 && (
              <div className="pt-2">
                <button 
                  onClick={triggerMining}
                  disabled={isMining}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-surface-900 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                >
                  {isMining ? (
                    <>
                      <Cpu className="animate-spin" size={16} />
                      Buscando Nonce Matemático...
                    </>
                  ) : (
                    <>
                      <Hammer size={16} />
                      Sellar y Minar Bloque #{blocks.length}
                    </>
                  )}
                </button>
                <span className="text-[9px] text-slate-500 text-center block mt-2 font-mono">
                  Se buscará un hash con 4 ceros iniciales (Dificultad de Consenso).
                </span>
              </div>
            )}

            {/* Mensaje de Sello Exitoso */}
            <AnimatePresence>
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <CheckCircle size={14} />
                  {successMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Columna Derecha: Cadena de Bloques (The Chain) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-800 p-6 rounded-3xl border border-white/5 space-y-5">
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">Registro General de Bloques Secuenciados</h4>
              <p className="text-xs text-slate-400">Historial absoluto de bloques verificados en el aula</p>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {blocks.map((block, idx) => {
                const isExpanded = expandedBlockIndex === idx;
                return (
                  <div key={block.index} className="flex flex-col gap-3">
                    
                    {/* Flecha conectora para bloques consecutivos */}
                    {idx > 0 && (
                      <div className="flex justify-center -my-2">
                        <div className="flex flex-col items-center gap-0.5">
                          <ArrowDown size={14} className="text-brand-primary/60" />
                          <span className="text-[8px] font-mono font-bold text-brand-secondary">hash_previo == hash_anterior</span>
                        </div>
                      </div>
                    )}

                    {/* Contendor del Bloque */}
                    <div className="bg-surface-900 rounded-2xl border border-white/10 p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Box className="text-brand-primary h-5 w-5" />
                          <div>
                            <span className="text-sm font-bold text-white">
                              {block.index === 0 ? 'Bloque #0 (Bloque Génesis)' : `Bloque #${block.index}`}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 block">
                              Acuñado: {new Date(block.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-surface-800 text-slate-400 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-white/5">
                            NONCE: {block.nonce}
                          </span>
                          <button 
                            onClick={() => setJsonViewBlock(block)}
                            className="bg-surface-800 hover:bg-white/5 text-brand-primary hover:text-brand-secondary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/5 transition-all"
                          >
                            JSON Nodo
                          </button>
                        </div>
                      </div>

                      {/* Hashes y Enlace */}
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 items-center text-[10px] font-mono">
                          <span className="md:col-span-3 text-slate-500 font-bold uppercase">Hash Digital:</span>
                          <span className="md:col-span-9 bg-surface-950 p-1.5 rounded border border-white/5 text-emerald-400 break-all select-all leading-relaxed">
                            {block.hash}
                          </span>
                        </div>

                        {idx > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 items-center text-[10px] font-mono">
                            <span className="md:col-span-3 text-slate-500 font-bold uppercase">Hash Anterior:</span>
                            <span className="md:col-span-9 bg-surface-950 p-1.5 rounded border border-white/5 text-slate-500 break-all select-all">
                              {block.previousHash}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Transacciones en el Bloque */}
                      <div className="border-t border-white/5 pt-3">
                        <button 
                          onClick={() => toggleBlockExpand(idx)}
                          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white transition-all font-bold"
                        >
                          <span>Acciones contenidas ({block.transactions.length})</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pt-3 space-y-2.5"
                            >
                              {block.transactions.map(tx => (
                                <div key={tx.id} className="p-3 bg-surface-950 rounded-xl border border-white/5 space-y-1 text-left">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="font-extrabold text-slate-300">{tx.memo}</span>
                                    <span className={`font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                      {tx.amount > 0 ? '+' : ''}{tx.amount} EB
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap justify-between items-center text-[9px] font-mono text-slate-500 pt-1">
                                    <span>DE: {tx.from} ➔ PARA: {tx.to}</span>
                                    <span className="break-all">TX HASH: {tx.hash.slice(0, 24)}...</span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RAW JSON VIEW MODAL */}
      <AnimatePresence>
        {jsonViewBlock && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-surface-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 font-mono text-left space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                  <Terminal size={14} className="text-brand-primary" />
                  NODO_ESCOLAR_LEDGER://BLOQUE_{jsonViewBlock.index}.JSON
                </span>
                <button 
                  onClick={() => setJsonViewBlock(null)}
                  className="text-slate-500 hover:text-white font-bold text-xs"
                >
                  CERRAR
                </button>
              </div>

              <pre className="bg-surface-900 border border-white/5 rounded-xl p-4 text-[11px] text-emerald-400/90 overflow-x-auto max-h-[400px] leading-relaxed select-all custom-scrollbar">
                {JSON.stringify(jsonViewBlock, null, 2)}
              </pre>

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>SELLO DIGITAL INMUTABLE - SISTEMA INTEGRADO DE ENSEÑANZA</span>
                <span>TAMAÑO: {JSON.stringify(jsonViewBlock).length} BYTES</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
