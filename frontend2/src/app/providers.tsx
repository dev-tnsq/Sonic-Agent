'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@/hooks/useWallet';

const WalletContext = createContext<ReturnType<typeof useWallet>>({} as ReturnType<typeof useWallet>);

export function Providers({ children }: { children: ReactNode }) {
  const walletState = useWallet();
  
  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
