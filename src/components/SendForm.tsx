/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, User, Coins, MessageSquare, Loader2, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SendFormProps {
  onSend: (to: string, amount: number, memo: string) => Promise<string>;
  onAward?: (amount: number, memo: string) => Promise<string>;
  onDeduct?: (amount: number, memo: string) => Promise<string>;
  balance: number;
}

export default function SendForm({ onSend, onAward, onDeduct, balance }: SendFormProps) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [mode, setMode] = useState<'transfer' | 'award' | 'deduct'>('transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const numAmount = parseFloat(amount);
    
    if (mode === 'transfer' && !to) {
      setError('Por favor ingresa la dirección del compañero');
      return;
    }

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Cantidad no válida');
      return;
    }

    if (mode === 'transfer' && numAmount > balance) {
      setError('No tienes suficientes tokens');
      return;
    }

    try {
      setIsSubmitting(true);
      let hash = '';
      
      if (mode === 'transfer') {
        hash = await onSend(to, numAmount, memo);
      } else if (mode === 'award' && onAward) {
        hash = await onAward(numAmount, memo);
      } else if (mode === 'deduct' && onDeduct) {
        hash = await onDeduct(numAmount, memo);
      }

      setTxHash(hash);
      
      if (mode !== 'deduct') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#ffffff']
        });
      }
      
      setTimeout(() => {
        setTxHash('');
        setTo('');
        setAmount('');
        setMemo('');
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Error en la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (txHash) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4"
      >
        <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-100">¡Acción Procesada!</h3>
          <p className="text-sm text-slate-400">Los EduBits se han actualizado en la red escolar.</p>
        </div>
        <div className="w-full p-3 rounded-xl bg-surface-900 border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-bold text-left mb-1">Hash de la Transacción</p>
          <code className="text-xs font-mono text-emerald-400/80 break-all">{txHash}</code>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl bg-surface-800 p-6 border border-white/5 shadow-2xl animate-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary">
            <Send size={20} />
          </div>
          <h3 className="text-lg font-bold tracking-tight">Gestionar EduBits</h3>
        </div>
        
        <div className="flex bg-surface-900 p-1 rounded-lg border border-white/5">
          <button 
            type="button"
            onClick={() => setMode('transfer')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${mode === 'transfer' ? 'bg-brand-primary text-surface-900' : 'text-slate-500'}`}
          >
            ENVIAR
          </button>
          <button 
            type="button"
            onClick={() => setMode('award')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${mode === 'award' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
          >
            PREMIAR
          </button>
          <button 
            type="button"
            onClick={() => setMode('deduct')}
            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${mode === 'deduct' ? 'bg-red-500 text-white' : 'text-slate-500'}`}
          >
            SANCIONAR
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {mode === 'transfer' && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> ID del Compañero
            </label>
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-xl bg-surface-900 border border-white/10 p-3 text-sm text-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-600"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Coins size={12} /> Cantidad
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl bg-surface-900 border border-white/10 p-3 pr-16 text-sm text-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-600"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-brand-secondary">EB</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              {mode === 'deduct' ? 'Deuda Máx' : 'Disponible'}
            </label>
            <div className="flex items-center h-11 px-3 bg-surface-900/50 rounded-xl border border-white/5 text-xs font-mono text-slate-400">
               {balance.toFixed(0)} EB
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={12} /> Motivo (Comportamiento/Tarea)
          </label>
          <input 
            type="text" 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={mode === 'award' ? 'Ej: Gran participación' : mode === 'deduct' ? 'Ej: Falta de respeto' : 'Motivo opcional'}
            className="w-full rounded-xl bg-surface-900 border border-white/10 p-3 text-sm text-slate-100 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20"
          >
            {error}
          </motion.p>
        )}

        <button 
          disabled={isSubmitting}
          className={`w-full group relative flex items-center justify-center gap-2 rounded-xl p-3.5 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95 ${
            mode === 'transfer' ? 'bg-brand-primary text-surface-900 hover:bg-brand-secondary' :
            mode === 'award' ? 'bg-emerald-500 text-white hover:bg-emerald-400' :
            'bg-red-500 text-white hover:bg-red-400'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              {mode === 'transfer' ? 'Confirmar Envío' : mode === 'award' ? 'Otorgar Recompensa' : 'Aplicar Sanción'}
              {mode === 'transfer' ? <Send size={16} /> : mode === 'award' ? <Award size={16} /> : <ShieldAlert size={16} />}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

