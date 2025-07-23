// components/EVMFeeCollector.tsx
"use client";

import { useState } from "react";
import { useEVMFeeCollection } from "../hooks/useEVMFeeCollection";

export default function EVMFeeCollector() {
  const [amount, setAmount] = useState<string>("0.01");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const { 
    sendNativeFee, 
    sendTokenFee, 
    calculateFee, 
    isCollecting, 
    error 
  } = useEVMFeeCollection();

  const handleNativeFee = async () => {
    const result = await sendNativeFee(parseFloat(amount));
    if (result.txHash) {
      console.log("Fee inviata! TX Hash:", result.txHash);
      // Aggiungi qui la logica post-invio
    }
  };

  const handleTokenFee = async () => {
    if (!tokenAddress) return;
    const result = await sendTokenFee(tokenAddress, parseFloat(amount));
    if (result.txHash) {
      console.log("Token fee inviata! TX Hash:", result.txHash);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Gestione Fee EVM</h2>
      
      <div className="mb-4">
        <label className="block mb-2">
          Importo (in ETH/MATIC/BNB):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          O in Token ERC-20 (indirizzo):
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            className="border p-2 w-full"
          />
        </label>
      </div>

      <div className="mb-4">
        <p>Fee da pagare: {calculateFee(parseFloat(amount))} {tokenAddress ? "Token" : "ETH/MATIC/BNB"}</p>
        <p className="text-sm text-gray-600">
          Fee collector:0xFD825e57383f42d483a81EF4caa118b859538540
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleNativeFee}
          disabled={isCollecting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isCollecting ? "Inviando..." : "Invia Native Fee"}
        </button>
        
        {tokenAddress && (
          <button
            onClick={handleTokenFee}
            disabled={isCollecting}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isCollecting ? "Inviando..." : "Invia Token Fee"}
          </button>
        )}
      </div>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}