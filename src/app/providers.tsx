// File: src/app/providers.tsx
'use client';

import { LiFiProvider } from '@lifi/widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const queryClient = new QueryClient();

const { publicClient, webSocketPublicClient } = configureChains(
  [chain.mainnet, chain.optimism, chain.polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <LiFiProvider
          integrator="ExcgApp"
          defaultTheme="light"
          walletManagement={{
            connect: async () => ({}) as any,
            disconnect: () => {},
            switchChain: async () => true,
          }}
        >
          {children}
        </LiFiProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}