/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Copy, Check, Eye, EyeOff, TrendingUp } from 'lucide-react';

interface BalanceCardProps {
  address: string;
  balance: number;
}

export default function BalanceCard({ address, balance }: BalanceCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-800 to-surface-700 p-6 shadow-2xl border border-white/5 animate-in">
      {/* Decorative Background Elements */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet size={18} className="text-brand-primary" />
            <span className="text-sm font-medium tracking-wide uppercase">Mi Billetera Escolar</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={12} />
            ACTIVO
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Saldo de Recompensas</p>
          <div className="flex items-baseline gap-2">
            <motion.h2 
              key={balance}
              initial={{ scale: 1.1, color: '#10B981' }}
              animate={{ scale: 1, color: '#F8FAFC' }}
              className="text-5xl font-bold tracking-tight"
            >
              {balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </motion.h2>
            <span className="text-xl font-semibold text-brand-secondary">EduBits</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-widest">
            <span>Identificador de Alumno (Blockchain)</span>
            <button 
              onClick={() => setShowFullAddress(!showFullAddress)}
              className="hover:text-white transition-colors"
            >
              {showFullAddress ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-surface-900/50 p-3 border border-white/5 group hover:border-brand-primary/30 transition-all">
            <code className="flex-1 font-mono text-sm text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
              {showFullAddress ? address : truncatedAddress}
            </code>
            <button 
              onClick={copyAddress}
              className="p-1 text-slate-500 hover:text-brand-primary transition-colors"
            >
              {copied ? <Check size={16} className="text-brand-primary" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
