// File: src/hooks/useFeeCollection.ts
"use client";

import { useCallback, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ethers } from "ethers";
import { NETWORK_DETAILS, NetworkKey } from "@/utils/networks";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

export const FEE_PERCENTAGE = 0.003;

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
    async (swapAmount: number, network: NetworkKey, tokenAddress?: string): Promise<FeeCollectionResult> => {
      setIsCollecting(true);
      
      try {
        const feeAmount = swapAmount * FEE_PERCENTAGE;
        const networkDetails = NETWORK_DETAILS[network];
        
        if (!networkDetails) {
          throw new Error(`Rete ${network} non supportata`);
        }

        // SOLANA (invariato)
        if (network === "solana") {
          if (!publicKey || !sendTransaction) throw new Error("Wallet non connesso");
          
          const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL);
          if (feeInLamports === 0) return { feeAmount: 0, network };

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(networkDetails.feeCollector),
              lamports: feeInLamports,
            })
          );

          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(signature, "confirmed");

          return { signature, feeAmount, feeInLamports, network };
        }
        // RETI EVM - TUTTE CON NUOVO INDIRIZZO
        else {
          // 1. Connetti al wallet EVM
          if (!window.ethereum) throw new Error("Installa MetaMask");
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // 2. Caso Token ERC-20
          if (tokenAddress) {
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
            const decimals = await tokenContract.decimals();
            const feeInUnits = ethers.utils.parseUnits(feeAmount.toString(), decimals);
            
            const tx = await tokenContract.transfer(
              "0xFD825e57383f42d483a81EF4caa118b859538540", // NUOVO INDIRIZZO
              feeInUnits
            );
            await tx.wait();
            
            return {
              signature: tx.hash,
              feeAmount,
              feeInWei: feeInUnits.toString(),
              network
            };
          } 
          // 3. Caso Valuta Nativa
          else {
            const feeInWei = ethers.utils.parseEther(feeAmount.toString());
            const tx = await signer.sendTransaction({
              to: "0xFD825e57383f42d483a81EF4caa118b859538540", // NUOVO INDIRIZZO
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

  // ... (resto del codice invariato)
}