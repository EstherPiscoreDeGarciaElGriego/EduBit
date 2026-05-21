/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

export interface Student {
  id: string;
  name: string;
  address: string;
  balance: number;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  studentId: string; // The student involved
  amount: number; // e.g. +10, -5, -20
  currency: string; // 'EduBits' or 'EB'
  timestamp: number;
  status: TransactionStatus;
  blockNumber?: number;
  memo?: string;
  type: 'credit' | 'debit' | 'redemption'; // credit (reward), debit (sanction), redemption (prizes)
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface WalletState {
  address: string;
  privateKey: string;
  balance: number;
  transactions: Transaction[];
}

export interface BlockchainStats {
  height: number;
  tps: number;
  lastBlockTime: number;
  networkName: string;
  totalDistributed: number;
  classCount: number;
}

export interface SchoolReward {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
}
