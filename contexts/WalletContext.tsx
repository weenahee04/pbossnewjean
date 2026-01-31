import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  icon?: string;
  iconBg?: string;
  iconColor?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(2450);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earn',
      amount: 150,
      description: 'รับคะแนนจากการซื้อสินค้า',
      date: '2024-01-30',
      status: 'completed',
      icon: 'add_circle',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      id: '2',
      type: 'spend',
      amount: -500,
      description: 'แลกรับคูปองส่วนลด',
      date: '2024-01-29',
      status: 'completed',
      icon: 'remove_circle',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      id: '3',
      type: 'earn',
      amount: 200,
      description: 'โบนัสสมาชิกใหม่',
      date: '2024-01-28',
      status: 'completed',
      icon: 'stars',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) => prev + transaction.amount);
  }, []);

  const refreshBalance = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addTransaction,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
