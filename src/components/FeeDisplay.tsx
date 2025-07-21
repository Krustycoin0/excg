"use client"

import { useMemo } from "react"
import { Info, TrendingUp } from 'lucide-react'
import { useFeeCollection } from "../hooks/useFeeCollection"

interface FeeDisplayProps {
  swapAmount: number
  className?: string
}

export default function FeeDisplay({ swapAmount, className = "" }: FeeDisplayProps) {
  const { calculateFee, FEE_PERCENTAGE, FEE_COLLECTOR_ADDRESS } = useFeeCollection()

  const feeAmount = useMemo(() => {
    return swapAmount > 0 ? calculateFee(swapAmount) : 0
  }, [swapAmount, calculateFee])

  const totalAmount = useMemo(() => {
    return swapAmount + feeAmount
  }, [swapAmount, feeAmount])

  if (swapAmount <= 0) return null

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <Info className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Fee Information</span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-700">
          <span>Swap Amount:</span>
          <span className="font-medium">{swapAmount.toFixed(6)} SOL</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Platform Fee ({(FEE_PERCENTAGE * 100).toFixed(1)}%):</span>
          <span className="font-medium">{feeAmount.toFixed(6)} SOL</span>
        </div>

        <div className="flex justify-between text-blue-800 font-semibold border-t border-blue-200 pt-1">
          <span>Total Required:</span>
          <span>{totalAmount.toFixed(6)} SOL</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-blue-600 flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" />
        Fee goes to: {FEE_COLLECTOR_ADDRESS.slice(0, 8)}...{FEE_COLLECTOR_ADDRESS.slice(-8)}
      </div>
    </div>
  )
}