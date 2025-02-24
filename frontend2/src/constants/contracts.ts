export const SONIC_CONTRACT = {
  address: '0x713336e3B1A95c6f8Ad3CA610fD6B615Ba59a41E',
  chainId: '0xDEDE',  // Updated to match Sonic network
  rpc: 'https://rpc.blaze.soniclabs.com',
  explorer: 'https://testnet.sonicscan.org'
} as const;

export const NETWORKS = {
  SONIC_TESTNET: {
    chainId: '0xDEDE', // Updated to match network (57038 in hex)
    chainName: 'Sonic',
    nativeCurrency: {
      name: 'SONIC',
      symbol: 'S',
      decimals: 18
    },
    rpcUrls: ['https://rpc.blaze.soniclabs.com'],
    blockExplorerUrls: ['https://testnet.sonicscan.org']
  }
} as const;
