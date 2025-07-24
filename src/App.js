import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [account, setAccount] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.log('No existing connection');
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
      } catch (error) {
        alert('Errore: ' + error.message);
      }
    } else {
      alert('Installa MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  // Carica lo script LIFI manualmente
  useEffect(() => {
    if (account && !window.LiFiWidgetLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@lifi/widget/build/bundle.js';
      script.onload = () => {
        window.LiFiWidgetLoaded = true;
        console.log('LIFI Widget loaded');
      };
      document.head.appendChild(script);
    }
  }, [account]);

  return (
    <div className="App">
      <header style={{ padding: '20px', background: '#2563eb', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>EXCG DEX</h1>
          {account ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
              <button onClick={disconnectWallet} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                Disconnetti
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
              Connetti Wallet
            </button>
          )}
        </div>
      </header>
      
      <main>
        {account ? (
          <div style={{ maxWidth: '500px', margin: '30px auto', padding: '0 20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e293b' }}>Swap Token</h2>
              
              <div style={{ background: '#eff6ff', padding: '15px', borderRadius: '10px', marginBottom: '25px' }}>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#3b82f6' }}>
                  <strong>Fee:</strong> 0.3% va al tuo wallet
                </p>
                <p style={{ margin: '5px 0', fontSize: '12px', fontFamily: 'monospace' }}>
                  <strong>Wallet:</strong> {account.substring(0, 8)}...{account.substring(account.length - 6)}
                </p>
              </div>

              {/* Widget LIFI HTML */}
              <div dangerouslySetInnerHTML={{
                __html: `
                <div class="lifi-widget" 
                     data-integrator="EXCG-Dex"
                     data-fee-address="${account}"
                     data-fee="0.3"
                     data-api-key="37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5"
                     style="min-height: 600px;">
                </div>
                <script src="https://cdn.jsdelivr.net/npm/@lifi/widget/build/bundle.js"></script>
                `
              }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f8fafc' }}>
            <h2>Benvenuto su EXCG DEX</h2>
            <p style={{ marginBottom: '30px', fontSize: '18px' }}>Connetti il tuo wallet per iniziare a fare swap</p>
            <p style={{ marginBottom: '30px', color: '#2563eb', fontWeight: 'bold' }}>
              Guadagna il 0.3% di fee su ogni swap nel tuo wallet!
            </p>
            <button onClick={connectWallet} style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>
              Connetti Wallet
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
