import React, { useState, useEffect } from 'react';
import './App.css';
import Swap from './components/Swap';

function App() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);
      try {
        console.log('Connecting wallet...');
        
        // Request accounts
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        // Get chain ID
        const chain = await window.ethereum.request({
          method: 'eth_chainId'
        });
        
        setAccount(accounts[0]);
        setChainId(parseInt(chain, 16));
        
        console.log('Connected:', accounts[0], 'Chain:', parseInt(chain, 16));
        
      } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect wallet: ' + (error.message || 'Unknown error'));
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert('MetaMask not found! Please install MetaMask extension.');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setChainId(1);
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            const chain = await window.ethereum.request({
              method: 'eth_chainId'
            });
            setChainId(parseInt(chain, 16));
          }
        } catch (error) {
          console.log('No existing connection');
        }
      }
    };

    checkConnection();
  }, []);

  // Handle account and chain changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setAccount('');
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        setChainId(parseInt(chainId, 16));
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">EXCG DEX</h1>
          <div className="wallet-section">
            {account ? (
              <div className="connected-wallet">
                <div className="wallet-info">
                  <span className="wallet-address">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                  <span className="chain-info">
                    {chainId === 1 && 'Ethereum'}
                    {chainId === 56 && 'BSC'}
                    {chainId === 137 && 'Polygon'}
                    {chainId === 43114 && 'Avalanche'}
                    {chainId === 250 && 'Fantom'}
                    {![1, 56, 137, 43114, 250].includes(chainId) && `Chain ${chainId}`}
                  </span>
                </div>
                <button onClick={disconnectWallet} className="disconnect-btn">
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet} 
                className="connect-wallet-btn"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {account ? (
          <Swap account={account} chainId={chainId} />
        ) : (
          <div className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome to EXCG DEX</h2>
              <p>Connect your wallet to start swapping tokens</p>
              <p>Earn 0.3% fees on every swap directly to your wallet!</p>
              <button 
                onClick={connectWallet} 
                className="large-connect-btn"
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
