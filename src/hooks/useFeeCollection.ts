
"use client";

import { useCallback, useState, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ethers, BigNumber } from "ethers";
import { NETWORK_DETAILS, NetworkKey } from "@/utils/networks";

// ABI minima per i token ERC-20
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

export const FEE_PERCENTAGE = 0.003; // 0.3%

interface FeeCollectionResult {
  signature?: string;
  feeAmount: number;
  feeInLamports?: number;
  feeInWei?: string;
  network: string;
  error?: string;
  explorerUrl?: string;
}

export function useFeeCollection() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isCollecting, setIsCollecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const collectFee = useCallback(
    async (
      swapAmount: number, 
      network: NetworkKey,
      tokenAddress?: string
    ): Promise<FeeCollectionResult> => {
      setIsCollecting(true);
      setLastError(null);
      
      try {
        // Valida l'importo
        if (swapAmount <= 0) {
          throw new Error("Importo non valido per il calcolo della fee");
        }

        const networkDetails = NETWORK_DETAILS[network];
        if (!networkDetails) {
          throw new Error(`Rete ${network} non supportata`);
        }

        const feeAmount = swapAmount * FEE_PERCENTAGE;
        let result: FeeCollectionResult = {
          feeAmount,
          network
        };

        // SOLANA
        if (network === "solana") {
          if (!publicKey || !sendTransaction) {
            throw new Error("Wallet Solana non connesso");
          }
          
          const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL);
          if (feeInLamports === 0) {
            return { ...result, feeAmount: 0 };
          }

          // Verifica il saldo SOL
          const balance = await connection.getBalance(publicKey);
          if (balance < feeInLamports) {
            throw new Error(`Saldo SOL insufficiente. Richiesti: ${feeInLamports / LAMPORTS_PER_SOL} SOL`);
          }

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(networkDetails.feeCollector),
              lamports: feeInLamports,
            })
          );

          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(signature, "confirmed");

          result = {
            ...result,
            signature,
            feeInLamports,
            explorerUrl: `${networkDetails.explorer}${signature}`
          };
        }
        // RETI EVM (Ethereum, Optimism, ecc.)
        else {
          // 1. Connetti al wallet EVM
          if (!window.ethereum) {
            throw new Error("MetaMask non installato");
          }
          
          // Richiedi connessione account
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const senderAddress = await signer.getAddress();

          // 2. Caso Token ERC-20
          if (tokenAddress) {
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            
            // Ottieni decimali
            const decimals = await tokenContract.decimals();
            const feeInUnits = ethers.utils.parseUnits(feeAmount.toString(), decimals);
            
            // Verifica saldo
            const balance: BigNumber = await tokenContract.balanceOf(senderAddress);
            if (balance.lt(feeInUnits)) {
              throw new Error(`Saldo insufficiente. Richiesti: ${feeAmount} ${await tokenContract.symbol()}`);
            }

            // Verifica allowance (opzionale, per sicurezza)
            // In un'implementazione reale potresti aver bisogno di approvazione
            // const allowance = await tokenContract.allowance(senderAddress, networkDetails.feeCollector);
            // if (allowance.lt(feeInUnits)) {
            //   throw new Error("Approvazione insufficiente. Richiedi l'approvazione prima.");
            // }

            // Invia transazione
            const tx = await tokenContract.transfer(networkDetails.feeCollector, feeInUnits);
            await tx.wait(1); // Attendi 1 conferma
            
            result = {
              ...result,
              signature: tx.hash,
              feeInWei: feeInUnits.toString(),
              explorerUrl: `${networkDetails.explorer}${tx.hash}`
            };
          } 
          // 3. Caso Valuta Nativa (ETH, MATIC, OP, ecc.)
          else {
            const feeInWei = ethers.utils.parseEther(feeAmount.toString());
            
            // Verifica saldo
            const balance = await signer.getBalance();
            if (balance.lt(feeInWei)) {
              const required = ethers.utils.formatEther(feeInWei);
              const current = ethers.utils.formatEther(balance);
              throw new Error(
                `Saldo ${networkDetails.nativeToken} insufficiente. ` +
                `Richiesti: ${required}, Disponibile: ${current}`
              );
            }

            // Invia transazione
            const tx = await signer.sendTransaction({
              to: networkDetails.feeCollector,
              value: feeInWei
            });
            await tx.wait(1); // Attendi 1 conferma
            
            result = {
              ...result,
              signature: tx.hash,
              feeInWei: feeInWei.toString(),
              explorerUrl: `${networkDetails.explorer}${tx.hash}`
            };
          }
        }

        return result;
      } catch (error: any) {
        const errorMessage = error.message || "Errore sconosciuto nella raccolta fee";
        setLastError(errorMessage);
        console.error("Errore useFeeCollection:", error);
        
        return {
          feeAmount: 0,
          network,
          error: errorMessage
        };
      } finally {
        setIsCollecting(false);
      }
    },
    [publicKey, sendTransaction, connection]
  );

  /**
   * Calcola l'importo della fee per un importo
   */
  const calculateFee = useCallback((amount: number): number => {
    return amount * FEE_PERCENTAGE;
  }, []);

  /**
   * Aggiunge la fee a una transazione Solana esistente
   */
  const addFeeToTransaction = useCallback(
    (transaction: Transaction, swapAmount: number): Transaction => {
      if (!publicKey) return transaction;

      const feeAmount = swapAmount * FEE_PERCENTAGE;
      const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL);
      
      if (feeInLamports > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(NETWORK_DETAILS.solana.feeCollector),
            lamports: feeInLamports,
          })
        );
      }
      
      return transaction;
    },
    [publicKey]
  );

  /**
   * Ottiene l'URL dell'esploratore per una transazione
   */
  const getExplorerUrl = useCallback((network: NetworkKey, txHash: string): string => {
    return `${NETWORK_DETAILS[network].explorer}${txHash}`;
  }, []);

  // Memorizza gli indirizzi dei collector
  const feeCollectorAddresses = useMemo(() => {
    return Object.fromEntries(
      Object.entries(NETWORK_DETAILS).map(([key, value]) => [key, value.feeCollector])
    ) as Record<NetworkKey, string>;
  }, []);

  return {
    collectFee,
    calculateFee,
    addFeeToTransaction,
    getExplorerUrl,
    isCollecting,
    lastError,
    FEE_PERCENTAGE,
    feeCollectorAddresses,
  };
}