import { NextPage } from "next"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import FeeCollector from "../components/FeeCollector"

const FeesPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EXCG Fee Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your DEX fee collection</p>
          </div>
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
        </div>

        {/* Fee Collector Component */}
        <FeeCollector />
      </div>
    </div>
  )
}

export default FeesPage