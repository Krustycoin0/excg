import React, { useState, useEffect } from 'react';
import './App.css';
import Swap from './components/Swap';

function App() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(1);

  // Forza la connessione wallet all'avvio
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Controlla se c'è un account già connesso
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
          console.log('Auto-connect failed');
        }
      }
    };

    autoConnect();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Forza la connessione
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
        
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        const chain = await window.ethereum.request({
          method: 'eth_chainId'
        });
        
        setAccount(accounts[0]);
        setChainId(parseInt(chain, 16));
        
      } catch (error) {
        console.error('Connection error:', error);
        alert('Errore: ' + error.message);
      }
    } else {
      alert('MetaMask non trovato!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  return (
    <div className="App">
      <header style={{ padding: '20px', background: '#f0f0f0' }}>
        <h1>EXCG DEX</h1>
        {account ? (
          <div>
            <span>Connesso: {account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            <button onClick={disconnectWallet} style={{ marginLeft: '10px' }}>Disconnetti</button>
          </div>
        ) : (
          <button onClick={connectWallet}>Connetti Wallet</button>
        )}
      </header>
      
      <main>
        {account ? (
          <Swap account={account} chainId={chainId} />
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Connetti il wallet per iniziare</h2>
            <button onClick={connectWallet} style={{ padding: '15px 30px', fontSize: '18px' }}>
              Connetti Wallet
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
