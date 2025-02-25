import { Chain } from 'wagmi/chains';

export const sonicBlaze = {
  id: 57_054,
  name: 'Sonic Blaze Testnet',
  nativeCurrency: {
    name: 'SONIC',
    symbol: 'SONIC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.sonic.fan'] },
    public: { http: ['https://rpc.sonic.fan'] },
  },
  blockExplorers: {
    default: {
      name: 'SonicScan',
      url: 'https://explorer.sonic.fan',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  testnet: true,
} as const satisfies Chain; 