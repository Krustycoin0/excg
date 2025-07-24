import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setSigner(signer);
      setProvider(provider);
      setChainId(network.chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setSigner(null);
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      account,
      signer,
      chainId,
      provider,
      connectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};