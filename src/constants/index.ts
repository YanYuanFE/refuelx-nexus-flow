import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  baseSepolia,
  bsc,
  kaia,
  mainnet,
  monadTestnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
  sophon,
  scroll,
} from "viem/chains";
import { defineChain } from "viem";

export const hyperEVM = defineChain({
  id: 999,
  name: "HyperEVM",
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
  blockExplorers: {
    default: {
      name: "HyperEVMScan",
      url: "https://hyperevmscan.io/",
    },
  },
  testnet: false,
});

const mainnetChains = [
  mainnet,
  optimism,
  arbitrum,
  polygon,
  avalanche,
  base,
  scroll,
  sophon,
  kaia,
  bsc,
  hyperEVM,
];

const testnetChains = [
  optimismSepolia,
  polygonAmoy,
  arbitrumSepolia,
  baseSepolia,
  sepolia,
  monadTestnet,
];

export const globalConfig = {
  chainList: [...mainnetChains, ...testnetChains],
};

export const chainIconList = {
  [optimismSepolia.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png",
  [polygonAmoy.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  [arbitrumSepolia.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
  [baseSepolia.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png",
  [sepolia.id]: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  [monadTestnet.id]:
    "https://s2.coinmarketcap.com/static/img/coins/64x64/30495.png",
};
