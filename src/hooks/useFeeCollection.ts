      "use client"

import { useCallback, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"

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
}

export const FEE_PERCENTAGE = 0.003 // 0.3%

interface FeeCollectionResult {
  signature?: string
  feeAmount: number
  feeInLamports?: number
  network: string
}

export function useFeeCollection() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isCollecting, setIsCollecting] = useState(false)

  /**
   * Colleziona la fee tramite transazione sulla rete selezionata
   * @param swapAmount importo swap
   * @param network string: "solana", "ethereum", "polygon", "bsc", ecc.
   */
  const collectFee = useCallback(
    async (swapAmount: number, network: string = "solana"): Promise<FeeCollectionResult | null> => {
      setIsCollecting(true)
      try {
        const feeAmount = swapAmount * FEE_PERCENTAGE

        // SOLO Solana: invia fee via SystemProgram.transfer
        if (network === "solana") {
          if (!publicKey || !sendTransaction) throw new Error("Wallet non connesso")
          const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL)
          if (feeInLamports === 0) return null // Fee troppo piccola

          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESSES[network]),
              lamports: feeInLamports,
            }),
          )
          const signature = await sendTransaction(transaction, connection)
          await connection.confirmTransaction(signature, "confirmed")

          return { signature, feeAmount, feeInLamports, network }
        }

        // EVM & altre chain: qui va la chiamata al tuo smart contract (implementa tu la logica)
        // Puoi solo calcolare la fee e restituire i dati qui
        // Esempio:
        return { feeAmount, network }
      } finally {
        setIsCollecting(false)
      }
    },
    [publicKey, sendTransaction, connection],
  )

  /**
   * Calcola la fee per un importo su qualsiasi rete
   */
  const calculateFee = useCallback((amount: number) => {
    return amount * FEE_PERCENTAGE
  }, [])

  /**
   * SOLO Solana: aggiunge la fee alla transazione
   */
  const addFeeToTransaction = useCallback(
    (transaction: Transaction, swapAmount: number, network: string = "solana") => {
      if (network === "solana" && publicKey) {
        const feeAmount = swapAmount * FEE_PERCENTAGE
        const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL)
        if (feeInLamports > 0) {
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESSES[network]),
              lamports: feeInLamports,
            }),
          )
        }
      }
      return transaction
    },
    [publicKey],
  )

  return {
    collectFee,
    calculateFee,
    addFeeToTransaction,
    isCollecting,
    FEE_PERCENTAGE,
    FEE_COLLECTOR_ADDRESSES,
  }
}