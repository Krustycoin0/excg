import React from 'react';
import { LiFiWidget } from '@lifi/widget';
import './Swap.css';

const Swap = ({ account, chainId }) => {
  const widgetConfig = {
    integrator: 'EXCG-Dex',
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    variant: 'wide',
    appearance: 'light',
    fee: 0.3,
    feeAddress: account,
    slippage: 0.5
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Swap Token</h2>
      <p>Fee 0.3% → Wallet: {account?.substring(0, 8)}...{account?.substring(account?.length - 6)}</p>
      <LiFiWidget config={widgetConfig} integrator="EXCG-Dex" />
    </div>
  );
};

export default Swap;
