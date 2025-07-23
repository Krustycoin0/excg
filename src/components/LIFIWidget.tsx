// File: src/components/LiFiWidget.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { NETWORK_DETAILS } from "@/utils/networks";
import { useFeeCollection } from "@/hooks/useFeeCollection";

const LiFiWidgetDynamic = dynamic(
  () => import("@lifi/widget").then((module) => module.LiFiWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Caricamento interfaccia di swap...</p>
      </div>
    )
  }
);

const LiFiWidget = () => {
  const { publicKey } = useWallet();
  const { address: evmAddress } = useAccount();
  const { collectFee } = useFeeCollection();
  const [lastSwap, setLastSwap] = useState<any>(null);
  const [activeChain, setActiveChain] = useState<number>(1);
  const [widgetReady, setWidgetReady] = useState(false);

  // Integrazione con la raccolta fee
  useEffect(() => {
    if (!window.lifi) return;

    // Gestione eventi LI.FI
    window.lifi.on("routeExecutionStarted", (route) => {
      console.log("Swap iniziato:", route);
    });

    window.lifi.on("routeExecutionCompleted", async (route) => {
      console.log("Swap completato:", route);
      setLastSwap(route);
      
      try {
        // Calcola e raccogli la fee
        const fromAmount = parseFloat(route.fromAmount);
        const networkKey = getNetworkKey(route.fromChainId);
        
        if (networkKey) {
          const result = await collectFee(
            fromAmount,
            networkKey,
            route.fromToken.address
          );
          
          console.log("Fee raccolta:", result);
        }
      } catch (error) {
        console.error("Errore nella raccolta fee:", error);
      }
    });
  }, [collectFee]);

  // Mappatura personalizzata per Solana
  const customChains = [
    {
      id: 99999,
      key: "sol",
      name: "Solana",
      logoURI: "https://cryptologos.cc/logos/solana-sol-logo.svg",
      coin: "SOL",
      metamask: {
        chainId: "0x99999",
        blockExplorerUrls: ["https://solscan.io"],
        chainName: "Solana Mainnet",
        nativeCurrency: {
          name: "SOL",
          symbol: "SOL",
          decimals: 9,
        },
        rpcUrls: ["https://api.mainnet-beta.solana.com"],
      },
    },
    ...Object.values(NETWORK_DETAILS).map(network => ({
      id: network.chainId || 1,
      key: network.name.toLowerCase(),
      name: network.name,
      logoURI: network.icon,
      coin: network.nativeToken,
    }))
  ];

  // Funzione di supporto per convertire chainId in networkKey
  const getNetworkKey = (chainId: number): string | null => {
    const mapping: Record<number, string> = {
      1: "ethereum",
      10: "op",
      137: "polygon",
      56: "bsc",
      43114: "avalanche",
      42161: "arbitrum",
      8453: "base",
      59144: "linea",
      11297108109: "palm",
      64165: "sonic",
      99999: "solana"
    };
    
    return mapping[chainId] || null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <LiFiWidgetDynamic
          config={{
            integrator: "ExcgApp",
            containerStyle: {
              border: "1px solid #eaeaea",
              borderRadius: "16px",
            },
            theme: {
              palette: {
                primary: { main: "#3b82f6" },
                secondary: { main: "#10b981" },
              },
              shape: {
                borderRadius: 16,
                borderRadiusSecondary: 12,
              },
            },
            fee: {
              integrator: "0xFD825e57383f42d483a81EF4caa118b859538540",
              fee: 0.003, // 0.3%
            },
            sdkConfig: {
              defaultRouteOptions: {
                integrator: "ExcgApp",
                fee: 0.003, // 0.3%
                feeConfig: {
                  feeAddress: "0xFD825e57383f42d483a81EF4caa118b859538540",
                  integratorFee: 0.003,
                },
              },
            },
          }}
          chains={customChains}
          activeChain={activeChain}
          onWidgetLoad={() => setWidgetReady(true)}
        />
      </div>

      {lastSwap && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg mb-2">Ultimo Swap Completato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Da:</p>
              <p>
                {lastSwap.fromAmount} {lastSwap.fromToken.symbol} 
                <span className="text-gray-500 ml-2">(Chain ID: {lastSwap.fromChainId})</span>
              </p>
            </div>
            <div>
              <p className="font-medium">A:</p>
              <p>
                {lastSwap.toAmount} {lastSwap.toToken.symbol} 
                <span className="text-gray-500 ml-2">(Chain ID: {lastSwap.toChainId})</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-blue-700 mb-2">Wallet Connessi</h3>
        <div className="flex flex-wrap gap-4">
          {publicKey && (
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="font-medium">Solana:</p>
              <p className="text-sm truncate max-w-xs">{publicKey.toString()}</p>
            </div>
          )}
          
          {evmAddress && (
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="font-medium">EVM:</p>
              <p className="text-sm truncate max-w-xs">{evmAddress}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiFiWidget;