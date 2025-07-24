import React, { useState, useEffect } from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account, chainId }) => {
  const [widgetKey, setWidgetKey] = useState(0);

  // Configuration for LIFI widget with fee distribution
  const widgetConfig = {
    integrator: 'EXCG-Dex',
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    variant: 'wide',
    appearance: 'light',
    fromChain: chainId || 1,
    toChain: chainId || 1,
    fee: 0.3, // 0.3% fee
    feeAddress: account, // Fees go to user's wallet
    slippage: 0.5,
    hiddenUI: ['appearance', 'language', 'wallet'],
    walletManagement: {
      signer: async () => {
        if (window.ethereum) {
          try {
            const provider = new window.ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            console.log('Signer created successfully');
            return signer;
          } catch (error) {
            console.error('Error creating signer:', error);
            throw error;
          }
        }
        throw new Error('No wallet provider found');
      },
    },
    theme: {
      palette: {
        primary: { 
          main: '#2563eb' 
        },
        secondary: { 
          main: '#7c3aed' 
        },
        background: { 
          paper: '#ffffff',
          default: '#f8fafc'
        },
        grey: {
          300: '#f1f5f9',
          300: '#e2e8f0',
          500: '#94a3b8',
          800: '#1e293b'
        }
      }
    }
  };

  // Refresh widget when account or chain changes
  useEffect(() => {
    setWidgetKey(prev => prev + 1);
  }, [account, chainId]);

  const getChainName = () => {
    const chains = {
      1: 'Ethereum',
      56: 'BSC',
      137: 'Polygon',
      43114: 'Avalanche',
      250: 'Fantom'
    };
    return chains[chainId] || `Chain ${chainId}`;
  };

  return (
    <div className="swap-container">
      <div className="swap-content">
        <div className="swap-header">
          <h2 className="swap-title">Token Swap</h2>
          <div className="swap-info">
            <div className="fee-info">
              <span className="fee-label">Fee:</span>
              <span className="fee-value">0.3%</span>
            </div>
            <div className="wallet-info">
              <span className="wallet-label">Fee Wallet:</span>
              <span className="wallet-value">{account.substring(0, 6)}...{account.substring(account.length - 4)}</span>
            </div>
          </div>
        </div>

        <div className="widget-container">
          <LiFiWidget 
            key={widgetKey}
            config={widgetConfig} 
            integrator="EXCG-Dex" 
          />
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Earn Fees</h3>
            <p>0.3% of every swap goes to your wallet</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Multi-Chain</h3>
            <p>Swap across {getChainName()} and other chains</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Swaps</h3>
            <p>Optimized routing for best prices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;
