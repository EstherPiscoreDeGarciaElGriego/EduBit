/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, ShieldAlert, Award } from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  walletAddress: string;
}

export default function TransactionList({ transactions, walletAddress }: TransactionListProps) {
  return (
    <div className="flex flex-col gap-4 animate-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold tracking-tight">Registro de Actividad</h3>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          {transactions.length} Eventos
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {transactions.map((tx) => {
            const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();
            const isDeduction = tx.amount < 0;
            const isAward = tx.from.includes('Docente');
            
            const statusColor = 
              tx.status === TransactionStatus.CONFIRMED ? 'text-emerald-400' :
              tx.status === TransactionStatus.PENDING ? 'text-amber-400' : 'text-red-400';

            return (
              <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={tx.id}
                className="group relative flex items-center gap-4 rounded-2xl bg-surface-800 p-4 border border-white/5 hover:border-white/10 transition-all hover:shadow-xl"
              >
                <div className={`p-3 rounded-xl ${
                  isDeduction ? 'bg-red-500/10 text-red-400' : 
                  isAward ? 'bg-emerald-500/10 text-emerald-400' :
                  isOutgoing ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {isDeduction ? <ShieldAlert size={20} /> : 
                   isAward ? <Award size={20} /> :
                   isOutgoing ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-100 truncate">
                      {tx.memo || (isOutgoing ? `Enviado a ${tx.to.slice(0, 8)}...` : `Recibido de ${tx.from.slice(0, 8)}...`)}
                    </p>
                    <p className={`font-mono font-bold ${isOutgoing || isDeduction ? 'text-red-400' : 'text-emerald-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} <span className="text-[10px] opacity-70">EB</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                      {isAward ? 'Sistema Docente' : isOutgoing ? 'Para compañero' : 'Recompensa'}
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${statusColor}`}>
                      {tx.status === TransactionStatus.CONFIRMED ? <CheckCircle2 size={12} /> : 
                       tx.status === TransactionStatus.PENDING ? <Clock size={12} className="animate-spin" /> : 
                       <AlertCircle size={12} />}
                      {tx.status === TransactionStatus.CONFIRMED ? 'VERIFICADO' : tx.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <Clock size={40} className="mb-2 opacity-20" />
            <p className="text-sm font-medium italic">Sin actividad registrada en la red escolar</p>
          </div>
        )}
      </div>
    </div>
  );
}

