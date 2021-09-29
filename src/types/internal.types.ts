
import { TableColumnType } from 'antd';
import { Action, ChainKey, Coin, Estimate, Execution, Token } from '.';
import bsc from '../assets/icons/bsc.png';
import eth from '../assets/icons/ethereum.png';
import pancake from '../assets/icons/pancake.png';
import pol from '../assets/icons/polygon.png';
import quick from '../assets/icons/quick.png';
import honey from '../assets/icons/honey.png';
import dai from '../assets/icons/xdai.png';
import uniswap from '../assets/icons/uniswap.png';
import spooky from '../assets/icons/spooky.png';
import ftm from '../assets/icons/fantom.png';
import arb from '../assets/icons/arbitrum.svg';
import opt from '../assets/icons/optimism.png';
import rop from '../assets/icons/ethereum_ropsten.png';
import rin from '../assets/icons/ethereum_rinkeby.png';
import gor from '../assets/icons/ethereum_goerli.png';
import mum from '../assets/icons/polygon_test.png';
import bsct from '../assets/icons/bsc_test.png';
import arbt from '../assets/icons/arbitrum_test.png';

export const icons: { [key: string]: string } = {
  // Mainnets
  [ChainKey.ETH]: eth,
  [ChainKey.POL]: pol,
  [ChainKey.BSC]: bsc,
  [ChainKey.DAI]: dai,
  // [ChainKey.OKT]: okt,
  [ChainKey.FTM]: ftm,
  // [ChainKey.AVA]: ava,
  [ChainKey.ARB]: arb,
  // [ChainKey.HEC]: hec,
  [ChainKey.OPT]: opt,

  // Testnets
  [ChainKey.ROP]: rop,
  [ChainKey.RIN]: rin,
  [ChainKey.GOR]: gor,
  [ChainKey.MUM]: mum,
  [ChainKey.ARBT]: arbt,
  //[ChainKey.OPTT]: optt,
  [ChainKey.BSCT]: bsct,
  //[ChainKey.HECT]: hect,


  // Exchanges
  'Pancake': pancake,
  'QuickSwap': quick,
  'Honeyswap': honey,
  'UniswapV2': uniswap,
  'Uniswap': uniswap,
  'SpookySwap': spooky,
}
export const getIcon = (name: string | undefined) => {
  if (name && icons[name]) {
    return icons[name]
  }
  return undefined
}

export interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

export interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}

export interface DataType {
  [key: string]: string | number | Amounts | Coin; // kind of deactivating typing for DataType; last resort?
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;
}

export function chainKeysToObject(val: any) {
  const result: { [ChainKey: string]: any } = {}
  for (const key in ChainKey) {
    result[key.toLowerCase()] = JSON.parse(JSON.stringify(val))
  }
  return result
}

export interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}

export interface ChainPortfolio {
  id: string,
  name: string,
  symbol: string,
  img_url: string,
  pricePerCoin: number,
  amount: number,
  verified: boolean,
}

export interface Wallet {
  address: string;
  loading: boolean;
  portfolio: { [ChainKey: string]: Array<ChainPortfolio> } // ChainKeys -> [ChainPortfolio]
}

export enum Currencies {
  USD = "usd",
  EUR = "eur",
}

export interface SummaryAmounts {
  amount_usd: number;
  percentage_of_portfolio: number;
}

export interface WalletSummary {
  wallet: string
  [ChainKey.ETH]: SummaryAmounts;
  [ChainKey.POL]: SummaryAmounts;
  [ChainKey.BSC]: SummaryAmounts;
  [ChainKey.DAI]: SummaryAmounts;
  [ChainKey.OKT]: SummaryAmounts;
  [ChainKey.FTM]: SummaryAmounts;
  [ChainKey.AVA]: SummaryAmounts;
  [ChainKey.HEC]: SummaryAmounts;
  [ChainKey.OPT]: SummaryAmounts;
  [ChainKey.ARB]: SummaryAmounts;

  [ChainKey.ROP]: SummaryAmounts;
  [ChainKey.RIN]: SummaryAmounts;
  [ChainKey.GOR]: SummaryAmounts;
  [ChainKey.MUM]: SummaryAmounts;
  [ChainKey.ARBT]: SummaryAmounts;
  [ChainKey.OPTT]: SummaryAmounts;
  [ChainKey.BSCT]: SummaryAmounts;
  [ChainKey.HECT]: SummaryAmounts;
}

export interface ProgressStep {
  title: string
  description: string
}

export interface TransferStep {
  action: Action
  estimate?: Estimate
  execution?: Execution
  id?: string
}