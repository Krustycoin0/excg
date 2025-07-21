"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Wallet, TrendingUp, DollarSign, Users, Copy, Check } from 'lucide-react'
import { FEE_COLLECTOR_ADDRESS, FEE_PERCENTAGE } from "../hooks/useFeeCollection"

interface FeeStats {
  totalCollected: number
  dailyFees: number
  transactionCount: number
  lastCollection: Date | null
}

export default function FeeCollector() {
  const { connected } = useWallet()
  const [copied, setCopied] = useState(false)
  const [feeStats, setFeeStats] = useState<FeeStats>({
    totalCollected: 0,
    dailyFees: 0,
    transactionCount: 0,
    lastCollection: null,
  })

  useEffect(() => {
    // Carica statistiche fee (in implementazione reale da database/API)
    const loadFeeStats = async () => {
      setFeeStats({
        totalCollected: 12.456789,
        dailyFees: 2.345678,
        transactionCount: 156,
        lastCollection: new Date(),
      })
    }

    loadFeeStats()
  }, [])

  const copyAddress = () => {
    navigator.clipboard.writeText(FEE_COLLECTOR_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Collection Dashboard</h2>
          <p className="text-gray-600">Monitor and manage fee collection for EXCG</p>
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Active • {(FEE_PERCENTAGE * 100).toFixed(1)}% fee
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Fees Collected</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{feeStats.totalCollected.toFixed(6)} SOL</div>
          <p className="text-xs text-gray-500">≈ ${(feeStats.totalCollected * 100).toFixed(2)} USD</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Daily Fees</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{feeStats.dailyFees.toFixed(6)} SOL</div>
          <p className="text-xs text-gray-500">+12% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{feeStats.transactionCount}</div>
          <p className="text-xs text-gray-500">Total swaps processed</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Fee Wallet</h3>
            <Wallet className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-sm font-mono text-gray-900 break-all">
            {FEE_COLLECTOR_ADDRESS.slice(0, 8)}...{FEE_COLLECTOR_ADDRESS.slice(-8)}
          </div>
          <button
            onClick={copyAddress}
            className="text-xs text-purple-600 hover:text-purple-700 flex items-center mt-1"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? "Copied!" : "Copy full address"}
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Configuration</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Collection Address</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-mono text-sm break-all text-gray-900">{FEE_COLLECTOR_ADDRESS}</div>
              <div className="text-xs text-gray-500 mt-1">Your fee collection wallet</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Fee Structure</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{(FEE_PERCENTAGE * 100).toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Per transaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Fee Collections</h3>
        <div className="space-y-3">
          {[
            { amount: 0.003456, time: "2 minutes ago", tx: "5KJh...9mNp", type: "SOL → USDC" },
            { amount: 0.015234, time: "5 minutes ago", tx: "8Qw2...4xRt", type: "USDC → SOL" },
            { amount: 0.007891, time: "12 minutes ago", tx: "3Mn8...7kLs", type: "SOL → BONK" },
            { amount: 0.021567, time: "18 minutes ago", tx: "9Pq4...2vBn", type: "BONK → SOL" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{tx.amount.toFixed(6)} SOL</p>
                  <p className="text-sm text-gray-600">
                    {tx.type} • {tx.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-gray-700">{tx.tx}</p>
                <p className="text-xs text-gray-500">Transaction</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}