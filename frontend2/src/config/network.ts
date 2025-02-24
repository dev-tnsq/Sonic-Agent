export const SONIC_NETWORK = {
  chainId: 57054,
  chainIdHex: '0xdede',
  name: 'Sonic Chain',
  currency: {
    name: 'SONIC',
    symbol: 'S',
    decimals: 18
  },
  rpc: 'https://rpc.blaze.soniclabs.com',
  explorer: 'https://testnet.sonicscan.org'
} as const;

export const isCorrectNetwork = (chainId?: string | number | null): boolean => {
  if (!chainId) return false;
  
  // Convert both to lowercase hex for comparison
  const normalizedInput = typeof chainId === 'number' 
    ? `0x${chainId.toString(16)}`.toLowerCase()
    : chainId.toLowerCase();
  
  const expectedChainId = SONIC_NETWORK.chainIdHex.toLowerCase();
  
  const matches = normalizedInput === expectedChainId;
  console.log('Network check:', {
    input: chainId,
    normalized: normalizedInput,
    expected: expectedChainId,
    matches
  });
  
  return matches;
};
