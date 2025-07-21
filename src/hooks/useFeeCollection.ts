"use client"

import { useCallback, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"

export const FEE_COLLECTOR_ADDRESS = "DZoHMBRyTzShZC9dwQ2HgFwhSjUE2xWLEDypKoa2Mcp3"
export const FEE_PERCENTAGE = 0.003 // 0.3%
export const FEE_COLLECTOR_ADDRESS = {
  ethereum: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS polygon: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS bsc: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Linea:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Avalance C-Chain:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Arbitrum: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Base:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS OP:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Palm:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
export const FEE_COLLECTOR_ADDRESS Sonic:"0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",


};
interface FeeCollectionResult {
  signature: string
  feeAmount: number
  feeInLamports: number
}

export function useFeeCollection() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isCollecting, setIsCollecting] = useState(false)

  const collectFee = useCallback(
    async (swapAmount: number): Promise<FeeCollectionResult | null> => {
      if (!publicKey || !sendTransaction) {
        throw new Error("Wallet non connesso")
      }

      setIsCollecting(true)
      try {
        const feeAmount = swapAmount * FEE_PERCENTAGE
        const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL)

        if (feeInLamports === 0) {
          return null // Fee troppo piccola
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESS),
            lamports: feeInLamports,
          }),
        )

        const signature = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, "confirmed")

        return {
          signature,
          feeAmount,
          feeInLamports,
        }
      } finally {
        setIsCollecting(false)
      }
    },
    [publicKey, sendTransaction, connection],
  )

  const calculateFee = useCallback((amount: number) => {
    return amount * FEE_PERCENTAGE
  }, [])

  const addFeeToTransaction = useCallback(
    (transaction: Transaction, swapAmount: number) => {
      if (!publicKey) return transaction

      const feeAmount = swapAmount * FEE_PERCENTAGE
      const feeInLamports = Math.floor(feeAmount * LAMPORTS_PER_SOL)

      if (feeInLamports > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(FEE_COLLECTOR_ADDRESS),
            lamports: feeInLamports,
          }),
        )
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
    FEE_COLLECTOR_ADDRESS,
  }
}