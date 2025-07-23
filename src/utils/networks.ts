// File: src/utils/networks.ts
export type NetworkKey = 
  | "solana"
  | "ethereum"
  | "polygon"
  | "bsc"
  | "avalanche"
  | "arbitrum"
  | "op"
  | "base"
  | "linea"
  | "palm"
  | "sonic";

export interface NetworkDetails {
  name: string;
  feeCollector: string;
  explorer: string;
  chainId?: number;
  nativeToken: string;
  rpcUrl?: string;
  icon?: string;
}

export const NETWORK_DETAILS: Record<NetworkKey, NetworkDetails> = {
  solana: {
    name: "Solana",
    feeCollector: "DZoHMBRyTzShZC9dwQ2HgFwhSjUE2xWLEDypKoa2Mcp3",
    explorer: "https://solscan.io/tx/",
    nativeToken: "SOL",
    icon: "/icons/solana.svg"
  },
  ethereum: {
    name: "Ethereum",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://etherscan.io/tx/",
    chainId: 1,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    icon: "/icons/ethereum.svg"
  },
  polygon: {
    name: "Polygon",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://polygonscan.com/tx/",
    chainId: 137,
    nativeToken: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    icon: "/icons/polygon.svg"
  },
  bsc: {
    name: "BNB Smart Chain",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://bscscan.com/tx/",
    chainId: 56,
    nativeToken: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    icon: "/icons/bsc.svg"
  },
  avalanche: {
    name: "Avalanche C-Chain",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://snowtrace.io/tx/",
    chainId: 43114,
    nativeToken: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    icon: "/icons/avalanche.svg"
  },
  arbitrum: {
    name: "Arbitrum One",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://arbiscan.io/tx/",
    chainId: 42161,
    nativeToken: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    icon: "/icons/arbitrum.svg"
  },
  op: {
    name: "Optimism",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://optimistic.etherscan.io/tx/",
    chainId: 10,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    icon: "/icons/optimism.svg"
  },
  base: {
    name: "Base",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://basescan.org/tx/",
    chainId: 8453,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.base.org",
    icon: "/icons/base.svg"
  },
  linea: {
    name: "Linea",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://lineascan.build/tx/",
    chainId: 59144,
    nativeToken: "ETH",
    rpcUrl: "https://rpc.linea.build",
    icon: "/icons/linea.svg"
  },
  palm: {
    name: "Palm Network",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://explorer.palm.io/tx/",
    chainId: 11297108109,
    nativeToken: "PALM",
    rpcUrl: "https://palm-mainnet.infura.io/v3/YOUR_INFURA_KEY",
    icon: "/icons/palm.svg"
  },
  sonic: {
    name: "Sonic Network",
    feeCollector: "0xFD825e57383f42d483a81EF4caa118b859538540", // MODIFICATO
    explorer: "https://sonicscan.io/tx/",
    chainId: 64165,
    nativeToken: "SONIC",
    rpcUrl: "https://rpc.sonic.network",
    icon: "/icons/sonic.svg"
  }
};

// ... (resto del codice invariato)