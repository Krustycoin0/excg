import React, { useState, useEffect } from 'react';
import { getRoute, executeRoute } from '../../lib/lifi';
import { useWallet } from '../../contexts/WalletContext';

const Swap = () => {
  const { account, signer, chainId } = useWallet();
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [route, setRoute] = useState(null);
  const [isFindingRoute, setIsFindingRoute] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  const handleFindRoute = async () => {
    if (!fromAmount || !fromToken || !toToken || !account) {
      setError('Please fill all fields and connect wallet');
      return;
    }

    try {
      setError(null);
      setIsFindingRoute(true);
      
      const routeResult = await getRoute(
        chainId, // fromChain
        chainId, // toChain (puoi modificare per cross-chain)
        fromToken,
        toToken,
        (parseFloat(fromAmount) * 10**18).toString(), // Assumendo 18 decimali
        account
      );
      
      if (routeResult.routes && routeResult.routes.length > 0) {
        setRoute(routeResult.routes[0]);
      } else {
        throw new Error('No routes found');
      }
    } catch (err) {
      console.error('Swap error:', err);
      setError(err.message || 'Failed to find route');
    } finally {
      setIsFindingRoute(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (!route || !signer) {
      setError('Route not found or wallet not connected');
      return;
    }

    try {
      setError(null);
      setIsExecuting(true);
      
      const execution = await executeRoute(route, signer);
      
      // Monitora l'esecuzione
      execution.on('transaction', (transaction) => {
        console.log('Transaction:', transaction);
      });
      
      execution.on('done', () => {
        console.log('Swap completed successfully');
        // Reset form
        setFromAmount('');
        setRoute(null);
      });
      
    } catch (err) {
      console.error('Execution error:', err);
      setError(err.message || 'Failed to execute swap');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="swap-container">
      {/* Form di swap */}
      <div className="swap-form">
        {/* Input fields */}
        <input
          type="number"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          placeholder="Amount"
        />
        
        {/* Token selectors */}
        {/* ... */}
        
        {error && (
          <div className="error-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {!route ? (
          <button 
            onClick={handleFindRoute}
            disabled={isFindingRoute || !fromAmount}
          >
            {isFindingRoute ? 'Finding Route...' : 'Find Best Route'}
          </button>
        ) : (
          <button 
            onClick={handleExecuteSwap}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing Swap...' : 'Execute Swap'}
          </button>
        )}
      </div>
      
      {/* Route details */}
      {route && (
        <div className="route-details">
          <h3>Route Found</h3>
          <p>Expected output: {route.toAmountMin} {toToken}</p>
          <p>Gas cost: ~${route.gasCostUSD}</p>
        </div>
      )}
    </div>
  );
};

export default Swap;