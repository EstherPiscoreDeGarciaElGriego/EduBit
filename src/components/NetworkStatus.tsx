/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Box, Users, GraduationCap } from 'lucide-react';
import { blockchain } from '../lib/blockchain';
import { BlockchainStats } from '../types';

export default function NetworkStatus() {
  const [stats, setStats] = useState<BlockchainStats>(blockchain.getStats());

  useEffect(() => {
    const unsubscribe = blockchain.subscribeStats((newStats) => {
      setStats(newStats);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-6 px-4 py-3 bg-surface-800/60 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
          <GraduationCap size={12} className="text-brand-primary" />
          {stats.networkName}
        </span>
      </div>

      <div className="hidden sm:block h-4 w-px bg-white/10" />

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Box size={14} className="text-brand-primary" />
          <div className="flex flex-col -space-y-1">
            <span className="text-[9px] font-semibold text-slate-500 uppercase">Bloques Ledger</span>
            <span className="text-xs font-mono font-bold text-slate-300">#{stats.height}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-blue-400" />
          <div className="flex flex-col -space-y-1">
            <span className="text-[9px] font-semibold text-slate-500 uppercase">Integrantes</span>
            <span className="text-xs font-mono font-bold text-slate-300">{stats.classCount} alumnos</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-emerald-400" />
          <div className="flex flex-col -space-y-1">
            <span className="text-[9px] font-semibold text-slate-500 uppercase">Consenso Escolar</span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 leading-none">
              <ShieldCheck size={10} />
              Sincronizado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
