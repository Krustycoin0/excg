
"use client";

import { useState, useEffect } from "react";
import { useFeeCollection } from "@/hooks/useFeeCollection";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";

// Interfaccia per il token
interface Token {
  address: string;
  symbol: string;
  decimals: number;
  isNative: boolean;
}

const SwapToken = () => {
  // Stato dell'applicazione
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [chain, setChain] = useState<string>("solana");
  const [swapResult, setSwapResult] = useState<any>(null);
  const [feeResult, setFeeResult] = useState<FeeCollectionResult | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  
  // Hook per le fee
  const { collectFee, calculateFee, isCollecting } = useFeeCollection();
  
  // Wallet Solana
  const { publicKey } = useWallet();
  
  // Mock di token - sostituisci con dati reali
  const SOLANA_TOKENS: Token[] = [
    { address: "So11111111111111111111111111111111111111112", symbol: "SOL", decimals: 9, isNative: true },
    { address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", symbol: "USDC", decimals: 6, isNative: false },
  ];
  
  const EVM_TOKENS: Record<string, Token[]> = {
    ethereum: [
      { address: "0x0000000000000000000000000000000000000000", symbol: "ETH", decimals: 18, isNative: true },
      { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6, isNative: false },
    ],
    op: [
      { address: "0x0000000000000000000000000000000000000000", symbol: "ETH", decimals: 18, isNative: true },
      { address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", symbol: "USDC", decimals: 6, isNative: false },
    ],
  };

  // Carica i token in base alla chain
  useEffect(() => {
    if (chain === "solana") {
      setTokens(SOLANA_TOKENS);
      setFromToken(SOLANA_TOKENS[0]);
    } else {
      setTokens(EVM_TOKENS[chain] || []);
      setFromToken(EVM_TOKENS[chain]?.[0] || null);
    }
    setToToken(null);
  }, [chain]);

  // Funzione per simulare uno swap
  const performSwap = async (): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula uno swap riuscito
        const amountNum = parseFloat(amount) || 0;
        const swappedAmount = amountNum * 0.98; // 2% slippage
        resolve(swappedAmount);
      }, 1500);
    });
  };

  // Gestore dello swap
  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Inserisci un importo valido");
      return;
    }

    setIsSwapping(true);
    setSwapResult(null);
    setFeeResult(null);

    try {
      // 1. Esegui lo swap
      const swappedAmount = await performSwap();
      setSwapResult({
        amount: swappedAmount,
        message: "Swap completato con successo!"
      });

      // 2. Calcola e invia la fee
      if (chain !== "solana") {
        // Per Solana la fee è inclusa nella transazione di swap
        const tokenAddress = fromToken?.isNative ? undefined : fromToken?.address;
        
        const feeResult = await collectFee(
          parseFloat(amount), 
          chain,
          tokenAddress
        );
        
        setFeeResult(feeResult);
        
        if (feeResult.error) {
          console.error("Errore invio fee:", feeResult.error);
        } else {
          console.log("Fee inviata con successo!", feeResult.signature);
        }
      }
    } catch (error) {
      console.error("Errore durante lo swap:", error);
      setSwapResult({
        error: "Swap fallito: " + (error as Error).message
      });
    } finally {
      setIsSwapping(false);
    }
  };

  // Calcola la fee stimata
  const estimatedFee = calculateFee(parseFloat(amount) || 0);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Swap Token</h1>
      
      {/* Selezione blockchain */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Blockchain</label>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="solana">Solana</option>
          <option value="ethereum">Ethereum</option>
          <option value="op">Optimism</option>
          <option value="polygon">Polygon</option>
          <option value="bsc">BNB Chain</option>
        </select>
      </div>
      
      {/* Token di input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Da</label>
        <div className="flex gap-2">
          <select
            value={fromToken?.address || ""}
            onChange={(e) => 
              setFromToken(tokens.find(t => t.address === e.target.value) || null)
            }
            className="flex-1 p-2 border rounded-md"
          >
            {tokens.map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 p-2 border rounded-md"
          />
        </div>
      </div>
      
      {/* Token di output */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">A</label>
        <select
          value={toToken?.address || ""}
          onChange={(e) => 
            setToToken(tokens.find(t => t.address === e.target.value) || null)
          }
          className="w-full p-2 border rounded-md"
        >
          <option value="">Seleziona token</option>
          {tokens
            .filter(token => token.address !== fromToken?.address)
            .map(token => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
        </select>
      </div>
      
      {/* Dettagli fee */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm text-gray-600">Fee stimata:</p>
        <p className="font-medium">
          {estimatedFee.toFixed(6)} {fromToken?.symbol} 
          <span className="text-sm text-gray-500 ml-2">
            ({FEE_PERCENTAGE * 100}%)
          </span>
        </p>
      </div>
      
      {/* Pulsante di swap */}
      <button
        onClick={handleSwap}
        disabled={isSwapping || isCollecting || !toToken || !publicKey && chain === "solana"}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          isSwapping || isCollecting 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSwapping ? "Swap in corso..." : 
         isCollecting ? "Invio fee..." : 
         "Esegui Swap"}
      </button>
      
      {/* Risultati dello swap */}
      {swapResult && (
        <div className={`mt-4 p-3 rounded-md ${
          swapResult.error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {swapResult.error ? (
            <p>{swapResult.error}</p>
          ) : (
            <>
              <p>{swapResult.message}</p>
              <p>Importo ricevuto: {swapResult.amount?.toFixed(6)} {toToken?.symbol}</p>
            </>
          )}
        </div>
      )}
      
      {/* Risultati della fee */}
      {feeResult && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          {feeResult.error ? (
            <p className="text-red-600">Errore fee: {feeResult.error}</p>
          ) : (
            <>
              <p className="text-green-600">Fee inviata con successo!</p>
              <p>Importo fee: {feeResult.feeAmount?.toFixed(6)} {fromToken?.symbol}</p>
              {feeResult.signature && (
                <a
                  href={`https://${getExplorerUrl(chain)}/tx/${feeResult.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  Visualizza transazione su explorer
                </a>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Messaggio wallet Solana */}
      {chain === "solana" && !publicKey && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
          <p>Connetti il tuo wallet Solana per effettuare lo swap</p>
        </div>
      )}
    </div>
  );
};

// Helper per ottenere l'URL dell'explorer
const getExplorerUrl = (network: string): string => {
  const explorers: Record<string, string> = {
    solana: "solscan.io",
    ethereum: "etherscan.io",
    polygon: "polygonscan.com",
    bsc: "bscscan.com",
    op: "optimistic.etherscan.io",
    arbitrum: "arbiscan.io",
    avalanche: "snowtrace.io",
    base: "basescan.org",
  };
  return explorers[network] || "etherscan.io";
};

export default SwapToken;