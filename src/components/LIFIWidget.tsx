// File: src/components/LiFiWidget.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { NETWORK_DETAILS } from "@/utils/networks";

// Caricamento dinamico per evitare problemi SSR
const LiFiWidgetDynamic = dynamic(
  () => import("@lifi/widget").then((module) => module.LiFiWidget),
  {
    ssr: false,
    loading: () => <div className="text-center p-8">Caricamento widget swap...</div>
  }
);

// Configurazione avanzata del widget
const widgetConfig = {
  integrator: "ExcgApp",
  containerStyle: {
    border: "1px solid rgb(234, 234, 234)",
    borderRadius: "16px",
    maxWidth: "480px",
    overflow: "hidden",
  },
  theme: {
    palette: {
      primary: { main: "#3b82f6" }, // Blu di Tailwind
      secondary: { main: "#10b981" }, // Verde di Tailwind
    },
    shape: {
      borderRadius: 16,
      borderRadiusSecondary: 12,
    },
  },
  disableAppearance: true,
  hiddenUI: ["appearance"],
  variant: "expandable",
};

const LiFiWidget = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { publicKey } = useWallet();
  const { address: evmAddress } = useAccount();
  const [activeChain, setActiveChain] = useState<number>(1); // Ethereum di default

  // Risincronizza il wallet con il widget
  useEffect(() => {
    setIsMounted(true);
    
    const handleWalletUpdate = () => {
      const lifiWallet = window.lifiWallet;
      if (!lifiWallet) return;

      // Connessione Solana
      if (publicKey) {
        lifiWallet.setChain(99999); // ChainId personalizzato per Solana
        lifiWallet.setAccount(publicKey.toString());
        setActiveChain(99999);
      } 
      // Connessione EVM
      else if (evmAddress) {
        lifiWallet.setChain(1); // Ethereum
        lifiWallet.setAccount(evmAddress);
        setActiveChain(1);
      }
    };

    // Aggiorna al cambio wallet
    window.addEventListener("lifiWalletUpdated", handleWalletUpdate);
    return () => window.removeEventListener("lifiWalletUpdated", handleWalletUpdate);
  }, [publicKey, evmAddress]);

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

  if (!isMounted) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Swap Cross-Chain</h1>
        <p className="text-gray-600 mt-2">
          Scambia asset tra Solana, Ethereum, Optimism e 20+ altre blockchain
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <LiFiWidgetDynamic
          config={widgetConfig}
          chains={customChains}
          activeChain={activeChain}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-700">1. Seleziona Asset</h3>
          <p className="text-sm mt-1">Scegli token e quantità da scambiare</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-700">2. Connetti Wallet</h3>
          <p className="text-sm mt-1">Usa Phantom, MetaMask o altri wallet</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-bold text-purple-700">3. Conferma Swap</h3>
          <p className="text-sm mt-1">Completa la transazione nel tuo wallet</p>
        </div>
      </div>
    </div>
  );
};

export default LiFiWidget;