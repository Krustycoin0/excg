// File: src/utils/networks.ts
export const getNetworkByChainId = (chainId: number): NetworkKey | null => {
  const mapping: Record<number, NetworkKey> = {
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