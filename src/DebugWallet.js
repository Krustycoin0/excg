import React, { useState } from 'react';

const DebugWallet = () => {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');

  const testConnection = async () => {
    setStatus('Testing...');
    
    if (typeof window.ethereum === 'undefined') {
      setStatus('MetaMask not found!');
      return;
    }

    try {
      setStatus('Requesting accounts...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      setStatus('Success! Account: ' + accounts[0]);
      setAccount(accounts[0]);
      
    } catch (error) {
      setStatus('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Wallet Debug</h1>
      <button onClick={testConnection} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Test Connection
      </button>
      <div>Status: {status}</div>
      {account && <div>Account: {account}</div>}
    </div>
  );
};

export default DebugWallet;
