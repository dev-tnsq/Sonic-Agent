import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Define Sonic chain
export const sonicChain = {
  id: 57054,
  name: 'Sonic',
  nativeCurrency: { name: 'SONIC', symbol: 'SONIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.blaze.soniclabs.com'] }
  },
  blockExplorers: {
    default: { name: 'SonicScan', url: 'https://testnet.sonicscan.org' }
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 11907934
    }
  }
} as const;

export const config = createConfig({
  chains: [sonicChain],
  transports: {
    [sonicChain.id]: http(),
  },
  connectors: [
    injected()
  ],
});