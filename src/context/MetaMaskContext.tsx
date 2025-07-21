
"use client";

import { createContext, useContext, useEffect, useState } from 'react';

const MetaMaskContext = createContext<any>(null);

export const MetaMaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      checkConnection();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    setIsConnected(accounts.length > 0);
  };

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setIsConnected(accounts.length > 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MetaMaskContext.Provider value={{ isConnected }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => useContext(MetaMaskContext);