
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
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://etherscan.io/tx/",
    chainId: 1,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    icon: "/icons/ethereum.svg"
  },
  polygon: {
    name: "Polygon",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://polygonscan.com/tx/",
    chainId: 137,
    nativeToken: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
    icon: "/icons/polygon.svg"
  },
  bsc: {
    name: "BNB Smart Chain",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://bscscan.com/tx/",
    chainId: 56,
    nativeToken: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
    icon: "/icons/bsc.svg"
  },
  avalanche: {
    name: "Avalanche C-Chain",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://snowtrace.io/tx/",
    chainId: 43114,
    nativeToken: "AVAX",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    icon: "/icons/avalanche.svg"
  },
  arbitrum: {
    name: "Arbitrum One",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://arbiscan.io/tx/",
    chainId: 42161,
    nativeToken: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    icon: "/icons/arbitrum.svg"
  },
  op: {
    name: "Optimism",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://optimistic.etherscan.io/tx/",
    chainId: 10,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.optimism.io",
    icon: "/icons/optimism.svg"
  },
  base: {
    name: "Base",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://basescan.org/tx/",
    chainId: 8453,
    nativeToken: "ETH",
    rpcUrl: "https://mainnet.base.org",
    icon: "/icons/base.svg"
  },
  linea: {
    name: "Linea",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://lineascan.build/tx/",
    chainId: 59144,
    nativeToken: "ETH",
    rpcUrl: "https://rpc.linea.build",
    icon: "/icons/linea.svg"
  },
  palm: {
    name: "Palm Network",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://explorer.palm.io/tx/",
    chainId: 11297108109,
    nativeToken: "PALM",
    rpcUrl: "https://palm-mainnet.infura.io/v3/YOUR_INFURA_KEY",
    icon: "/icons/palm.svg"
  },
  sonic: {
    name: "Sonic Network",
    feeCollector: "0xC6927e8e6A8B966fC3cBDfFB639c9db459A8C5D5",
    explorer: "https://sonicscan.io/tx/",
    chainId: 64165,
    nativeToken: "SONIC",
    rpcUrl: "https://rpc.sonic.network",
    icon: "/icons/sonic.svg"
  }
};

// Funzioni di utilità
export const getNetworkDetails = (networkKey: NetworkKey): NetworkDetails => {
  return NETWORK_DETAILS[networkKey] || NETWORK_DETAILS.ethereum;
};

export const getExplorerUrl = (networkKey: NetworkKey, txHash: string): string => {
  const network = getNetworkDetails(networkKey);
  return `${network.explorer}${txHash}`;
};

export const getNativeToken = (networkKey: NetworkKey): string => {
  return getNetworkDetails(networkKey).nativeToken;
};

export const getChainId = (networkKey: NetworkKey): number | undefined => {
  return getNetworkDetails(networkKey).chainId;
};

export const getAllNetworks = (): NetworkDetails[] => {
  return Object.values(NETWORK_DETAILS);
};

export const getNetworkByChainId = (chainId: number): NetworkDetails | undefined => {
  return Object.values(NETWORK_DETAILS).find(
    network => network.chainId === chainId
  );
};

// Configurazione per il frontend (dropdown, ecc.)
export const NETWORK_OPTIONS = Object.entries(NETWORK_DETAILS).map(
  ([key, config]) => ({
    value: key as NetworkKey,
    label: config.name,
    icon: config.icon,
    nativeToken: config.nativeToken
  })
);