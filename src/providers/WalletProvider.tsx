// File: src/app/providers.tsx
'use client';

import { LiFiProvider } from '@lifi/widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, polygon, arbitrum, base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

const queryClient = new QueryClient();

// Configurazione Wagmi per EVM
const wagmiConfig = createConfig({
  chains: [mainnet, optimism, polygon, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  connectors: [
    injected({ target: "metaMask" }),
  ],
});

// Configurazione Solana
const network = WalletAdapterNetwork.Mainnet;
const endpoint = "https://api.mainnet-beta.solana.com";

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <LiFiProvider
              integrator="ExcgApp"
              walletManagement={{
                connect: async () => ({}) as any,
                disconnect: () => {},
                switchChain: async () => true,
              }}
            >
              {children}
            </LiFiProvider>
          </WalletProvider>
        </ConnectionProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}