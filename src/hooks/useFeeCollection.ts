
"use client";

import { useCallback, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ethers } from "ethers";

// ABI minima per i token ERC-20
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint amount) returns (bool)"
];

export const FEE_COLLECTOR_ADDRESSES: Record<string, string> = {
  solana: "DZoHMBRyTzShZC9dwQ2HgFwhSjUE2xWLEDypKoa2Mcp3",
  ethereum: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  polygon: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  bsc: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  linea: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  avalanche: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  arbitrum: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  base: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  op: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  palm: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
  sonic: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
};

export const FEE_PERCENTAGE = 0.003; // 0.3%

interface FeeCollectionResult {
  signature?: string;
  feeAmount: number;
  feeInLamports?: number;
  feeInWei?: string;
  network: string;
  error?: string;
}

export function useFeeCollection() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isCollecting, setIsCollecting] = useState(false);

  const collectFee = useCallback(
    async (
      swapAmount: number, 
      network: string = "solana",
      tokenAddress?: string
    ): Promise<FeeCollectionResult> => {
      setIsCollecting(true);
      try {
        const feeAmount = swapAmount * FEE_PERCENTAGE;

        // SOLANA
        if (network === "solana") {
          if (!publicKey || !sendTransaction) {
            throw new Error("Solana wallet non connesso");
          }
          
          const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL);
          if (feeInLamports === 0) {
            return { feeAmount: 0, network: "solana" };
          }

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESSES.solana),
              lamports: feeInLamports,
            })
          );

          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(signature, "confirmed");

          return { 
            signature, 
            feeAmount, 
            feeInLamports, 
            network: "solana"
          };
        }
        // EVM (Ethereum, Polygon, Optimism, ecc.)
        else {
          const feeCollector = FEE_COLLECTOR_ADDRESSES[network];
          if (!feeCollector) {
            throw new Error(`Rete ${network} non supportata`);
          }

          // Verifica presenza MetaMask
          if (!window.ethereum) {
            throw new Error("MetaMask non installato");
          }
          
          // Connetti al wallet EVM
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const currentNetwork = await provider.getNetwork();
          
          // Verifica che l'utente sia sulla rete corretta
          console.log(`Connesso alla rete EVM: ${currentNetwork.name} (${currentNetwork.chainId})`);

          // Caso token ERC-20
          if (tokenAddress) {
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            const decimals = await tokenContract.decimals();
            const feeInUnits = ethers.utils.parseUnits(feeAmount.toString(), decimals);
            
            // Verifica saldo
            const balance = await tokenContract.balanceOf(await signer.getAddress());
            if (balance.lt(feeInUnits)) {
              throw new Error("Saldo token insufficiente per pagare la fee");
            }
            
            // Invia transazione
            const tx = await tokenContract.transfer(feeCollector, feeInUnits);
            await tx.wait();
            
            return {
              signature: tx.hash,
              feeAmount,
              feeInWei: feeInUnits.toString(),
              network
            };
          } 
          // Caso valuta nativa (ETH, MATIC, OP, ecc.)
          else {
            const feeInWei = ethers.utils.parseEther(feeAmount.toString());
            
            // Verifica saldo
            const balance = await signer.getBalance();
            if (balance.lt(feeInWei)) {
              throw new Error("Saldo insufficiente per pagare la fee");
            }
            
            // Invia transazione
            const tx = await signer.sendTransaction({
              to: feeCollector,
              value: feeInWei
            });
            await tx.wait();
            
            return {
              signature: tx.hash,
              feeAmount,
              feeInWei: feeInWei.toString(),
              network
            };
          }
        }
      } catch (error: any) {
        console.error("Errore nella raccolta fee:", error);
        return {
          feeAmount: 0,
          network,
          error: error.message || "Errore sconosciuto"
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
  const calculateFee = useCallback((amount: number) => {
    return amount * FEE_PERCENTAGE;
  }, []);

  /**
   * Aggiunge la fee a una transazione Solana esistente
   */
  const addFeeToTransaction = useCallback(
    (transaction: Transaction, swapAmount: number, network: string = "solana"): Transaction => {
      if (network === "solana" && publicKey) {
        const feeAmount = swapAmount * FEE_PERCENTAGE;
        const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL);
        
        if (feeInLamports > 0) {
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESSES.solana),
              lamports: feeInLamports,
            })
          );
        }
      }
      return transaction;
    },
    [publicKey]
  );

  return {
    collectFee,
    calculateFee,
    addFeeToTransaction,
    isCollecting,
    FEE_PERCENTAGE,
    FEE_COLLECTOR_ADDRESSES,
  };
}