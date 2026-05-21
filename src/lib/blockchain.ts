/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Transaction, TransactionStatus, Block, BlockchainStats, SchoolReward } from '../types';
import { ethers } from 'ethers';

const NETWORK_NAME = 'Red Blockchain Escolar Educativa';
const STORAGE_KEY = 'edubit_classroom_blockchain_v3';

// Available prizes in the school store
export const DEFAULT_SCHOOL_REWARDS: SchoolReward[] = [
  { id: 'r1', title: '15 Minutos Libres', cost: 15, description: 'Puedes usarlos al final de la clase para leer o jugar.', icon: 'Clock' },
  { id: 'r2', title: 'Elegir Asiento', cost: 25, description: 'Intercambia por el derecho a cambiar tu asiento por una semana.', icon: 'MapPin' },
  { id: 'r3', title: 'Punto Extra en Tarea', cost: 40, description: 'Un punto adicional para la próxima entrega de deberes.', icon: 'FileCheck' },
  { id: 'r4', title: 'Líder del Grupo', cost: 30, description: 'Ser el encargado de coordinar la próxima actividad lúdica.', icon: 'Crown' },
  { id: 'r5', title: 'Prórroga de Entrega', cost: 50, description: 'Un día más para entregar cualquier trabajo pendiente.', icon: 'CalendarDays' }
];

interface BlockchainData {
  students: Student[];
  transactions: Transaction[];
  blocks: Block[];
  currentBlockNumber: number;
}

class BlockchainService {
  private data: BlockchainData = {
    students: [],
    transactions: [],
    blocks: [],
    currentBlockNumber: 1
  };
  
  private pendingTransactions: Transaction[] = [];
  private subscribers: ((data: BlockchainData) => void)[] = [];
  private statsSubscribers: ((stats: BlockchainStats) => void)[] = [];

  constructor() {
    this.init();
    
    // Simulate periodic blockchain validation / block mining
    setInterval(() => {
      this.checkAndMinePendingTransactions();
    }, 12000); // Mines a block every 12 seconds if pending tx exist
  }

  // Simple pseudo-hash function to mimic proof-of-work
  private calculateHash(index: number, previousHash: string, timestamp: number, transactions: Transaction[], nonce: number): string {
    const dataString = index + previousHash + timestamp + JSON.stringify(transactions.map(t => t.hash)) + nonce;
    // Basic hash simulation using a simple character code reducer to return a hex string
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const absoluteHash = Math.abs(hash).toString(16).padStart(8, '0');
    // Let's prepend some zeros to look like double SHA256 block hash
    return `0000a${absoluteHash}${absoluteHash}`;
  }

  // Generate real cryptographic hash for a transaction
  private calculateTxHash(tx: Omit<Transaction, 'hash'>): string {
    const rawString = tx.from + tx.to + tx.studentId + tx.amount + tx.timestamp + tx.memo;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
       const code = rawString.charCodeAt(i);
       hash = ((hash << 5) - hash) + code;
       hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(16, '0') + Math.abs(hash * 3).toString(16).padStart(16, '0');
  }

  private init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.students && parsed.transactions && parsed.blocks) {
          this.data = parsed;
          this.pendingTransactions = parsed.transactions.filter((t: Transaction) => t.status === TransactionStatus.PENDING);
          return;
        }
      } catch (e) {
        console.error('Error reloading blockchain', e);
      }
    }

    // Default initialization when no data exists
    const initialStudents: Student[] = [
      { id: 's1', name: 'Julian Alvarez', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f441', balance: 75 },
      { id: 's2', name: 'Marta Ruiz', address: '0x123d35Cc6634C0532925a3b844Bc454e4438f122', balance: 120 },
      { id: 's3', name: 'Lucas Gomez', address: '0x999d35Cc6634C0532925a3b844Bc454e4438f993', balance: 50 },
      { id: 's4', name: 'Elena Torres', address: '0x555d35Cc6634C0532925a3b844Bc454e4438f554', balance: 95 },
      { id: 's5', name: 'Tomas Vaccaro', address: '0x333d35Cc6634C0532925a3b844Bc454e4438f331', balance: 60 }
    ];

    // Create Genesis block
    const genesisTx: Transaction = {
      id: 'genesis-tx',
      hash: '0x' + '0'.repeat(64),
      from: 'Red Educativa Principal',
      to: 'Curso 5to Año (Tesoro)',
      studentId: 'all',
      amount: 400,
      currency: 'EduBits',
      timestamp: Date.now() - 3600000,
      status: TransactionStatus.CONFIRMED,
      blockNumber: 0,
      memo: 'Bloque Génesis: Emisión inicial para la clase',
      type: 'credit'
    };

    const genesisHash = this.calculateHash(0, '0'.repeat(64), genesisTx.timestamp, [genesisTx], 42);
    const genesisBlock: Block = {
      index: 0,
      timestamp: genesisTx.timestamp,
      transactions: [genesisTx],
      previousHash: '0'.repeat(64),
      hash: genesisHash,
      nonce: 42
    };

    this.data = {
      students: initialStudents,
      transactions: [genesisTx],
      blocks: [genesisBlock],
      currentBlockNumber: 1
    };

    this.save();
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    this.notify();
  }

  private notify() {
    this.subscribers.forEach(cb => cb({ ...this.data }));
    this.statsSubscribers.forEach(cb => cb(this.getStats()));
  }

  public subscribe(cb: (data: BlockchainData) => void) {
    this.subscribers.push(cb);
    cb({ ...this.data });
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  public subscribeStats(cb: (stats: BlockchainStats) => void) {
    this.statsSubscribers.push(cb);
    cb(this.getStats());
    return () => {
      this.statsSubscribers = this.statsSubscribers.filter(s => s !== cb);
    };
  }

  // --- ADMIN ACTIONS (TEACHER) ---

  public addStudent(name: string): string {
    if (!name.trim()) throw new Error('El nombre no puede estar vacío');
    
    // Create new wallet-like address
    const randomWallet = ethers.Wallet.createRandom();
    const newStudent: Student = {
      id: `s_${Date.now()}`,
      name: name.trim(),
      address: randomWallet.address,
      balance: 50 // starting baseline
    };

    this.data.students.push(newStudent);

    // Create reward transaction on chain
    const tx: Transaction = {
      id: crypto.randomUUID(),
      hash: '',
      from: 'Tesorería Escolar',
      to: newStudent.name,
      studentId: newStudent.id,
      amount: 50,
      currency: 'EduBits',
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
      memo: `Incorporación escolar y saldo inicial`,
      type: 'credit'
    };
    tx.hash = this.calculateTxHash(tx);

    this.data.transactions.unshift(tx);
    this.pendingTransactions.push(tx);
    this.save();
    return newStudent.address;
  }

  public removeStudent(studentId: string) {
    const studentIndex = this.data.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error('Estudiante no encontrado');
    
    const student = this.data.students[studentIndex];
    
    // Create burn or removal tx on the chain
    const tx: Transaction = {
      id: crypto.randomUUID(),
      hash: '',
      from: student.name,
      to: 'Red Escolar (Quemado)',
      studentId: studentId,
      amount: -student.balance,
      currency: 'EduBits',
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
      memo: `Remoción del estudiante del curso - Retiros de tokens`,
      type: 'debit'
    };
    tx.hash = this.calculateTxHash(tx);

    this.data.transactions.unshift(tx);
    this.pendingTransactions.push(tx);
    this.data.students.splice(studentIndex, 1);
    this.save();
  }

  public awardStudent(studentId: string, amount: number, memo: string): string {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) throw new Error('Estudiante no encontrado');
    if (amount <= 0) throw new Error('La cantidad debe ser mayor a cero');

    const tx: Transaction = {
      id: crypto.randomUUID(),
      hash: '',
      from: 'Docente (Premio)',
      to: student.name,
      studentId: studentId,
      amount: amount,
      currency: 'EduBits',
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
      memo: memo || 'Comportamiento excelente',
      type: 'credit'
    };
    tx.hash = this.calculateTxHash(tx);

    student.balance += amount;
    this.data.transactions.unshift(tx);
    this.pendingTransactions.push(tx);
    this.save();
    return tx.hash;
  }

  public deductStudent(studentId: string, amount: number, memo: string): string {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) throw new Error('Estudiante no encontrado');
    if (amount <= 0) throw new Error('La cantidad debe ser mayor a cero');

    const tx: Transaction = {
      id: crypto.randomUUID(),
      hash: '',
      from: 'Docente (Sanción)',
      to: student.name,
      studentId: studentId,
      amount: -amount,
      currency: 'EduBits',
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
      memo: memo || 'Comportamiento indeseado',
      type: 'debit'
    };
    tx.hash = this.calculateTxHash(tx);

    student.balance = Math.max(0, student.balance - amount);
    this.data.transactions.unshift(tx);
    this.pendingTransactions.push(tx);
    this.save();
    return tx.hash;
  }

  // --- STUDENT ACTIONS ---

  public redeemReward(studentId: string, reward: SchoolReward): string {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) throw new Error('Estudiante no encontrado');
    if (student.balance < reward.cost) throw new Error(`EduBits insuficientes. Necesitas ${reward.cost} EB`);

    const tx: Transaction = {
      id: crypto.randomUUID(),
      hash: '',
      from: student.name,
      to: `Premio: ${reward.title}`,
      studentId: student.id,
      amount: -reward.cost,
      currency: 'EduBits',
      timestamp: Date.now(),
      status: TransactionStatus.PENDING,
      memo: `Canje de recompensa: ${reward.title}`,
      type: 'redemption'
    };
    tx.hash = this.calculateTxHash(tx);

    student.balance -= reward.cost;
    this.data.transactions.unshift(tx);
    this.pendingTransactions.push(tx);
    this.save();
    return tx.hash;
  }

  // --- CRYPTO ENGINE / MINING (FOR EDUCATION) ---

  public mineBlockManually(): Block | null {
    if (this.pendingTransactions.length === 0) {
      throw new Error('No hay transacciones pendientes en la memoria temporal (Mempool)');
    }
    return this.mineBlock();
  }

  private mineBlock(): Block {
    const prevBlock = this.data.blocks[this.data.blocks.length - 1];
    const newIndex = prevBlock.index + 1;
    const timestamp = Date.now();
    const transactionsToConfirm = [...this.pendingTransactions];
    
    // Simulate mining difficulty proof of work nonce finding
    let nonce = Math.floor(Math.random() * 1000);
    const hash = this.calculateHash(newIndex, prevBlock.hash, timestamp, transactionsToConfirm, nonce);

    const newBlock: Block = {
      index: newIndex,
      timestamp,
      transactions: transactionsToConfirm,
      previousHash: prevBlock.hash,
      hash,
      nonce
    };

    // Confirm all these in the main ledger
    this.data.transactions = this.data.transactions.map(t => {
      const pendingMatch = transactionsToConfirm.find(pt => pt.id === t.id);
      if (pendingMatch) {
        return { ...t, status: TransactionStatus.CONFIRMED, blockNumber: newIndex };
      }
      return t;
    });

    this.data.blocks.push(newBlock);
    this.data.currentBlockNumber = newIndex + 1;
    this.pendingTransactions = [];
    this.save();
    return newBlock;
  }

  private checkAndMinePendingTransactions() {
    if (this.pendingTransactions.length > 0) {
      this.mineBlock();
    }
  }

  // --- GETTERS & METRICS ---

  public getClassWalletTotal(): number {
    return this.data.students.reduce((total, s) => total + s.balance, 0);
  }

  public getPendingTransactionsLength() {
    return this.pendingTransactions.length;
  }

  public getStats(): BlockchainStats {
    const totalClassBalance = this.getClassWalletTotal();
    return {
      height: this.data.blocks.length,
      tps: this.pendingTransactions.length > 0 ? 0.33 : 0.05,
      lastBlockTime: this.data.blocks[this.data.blocks.length - 1]?.timestamp || Date.now(),
      networkName: NETWORK_NAME,
      totalDistributed: totalClassBalance,
      classCount: this.data.students.length
    };
  }

  public getStudentTransactions(studentId: string): Transaction[] {
    return this.data.transactions.filter(t => t.studentId === studentId);
  }
}

export const blockchain = new BlockchainService();
