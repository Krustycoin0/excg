import React from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account, chainId }) => {
  // Configuration for LIFI widget - LIFI gestisce il wallet da solo
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
    hiddenUI: ['appearance', 'language'], // Non nascondere il wallet UI
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
        }
      }
    }
  };

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
            <div className="chain-info">
              <span className="chain-label">Chain:</span>
              <span className="chain-value">{getChainName()}</span>
            </div>
          </div>
        </div>

        <div className="widget-container">
          <LiFiWidget 
            config={widgetConfig} 
            integrator="EXCG-Dex" 
          />
        </div>

        <div className="instructions">
          <h3>Come funziona:</h3>
          <ol>
            <li>Seleziona i token da scambiare</li>
            <li>Inserisci l'importo</li>
            <li>Clicca su "Swap" - verrai reindirizzato al wallet per firmare</li>
            <li>Guadagna 0.3% fee su ogni swap nel tuo wallet</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Swap;
