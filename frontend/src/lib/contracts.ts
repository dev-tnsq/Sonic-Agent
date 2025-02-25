export const CONTRACT_ADDRESSES = {
  MONITOR: "0x2F8b88144ea484de7bCf0879C70Bfc66bAb93586" as `0x${string}`,
  AUTOMATION: "0x159fE01399bB13Df1D1f51878553260b91209C87" as `0x${string}`,
  WETH: "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7" as `0x${string}`,
  WRAPPED_S: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38" as `0x${string}`
} as const;

// Function to validate contract addresses
export const validateAddress = (address: string): `0x${string}` => {
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid address format: ${address}`);
  }
  return address as `0x${string}`;
};

export const SONIC_CHAIN = {
  id: 57054,
  name: 'Sonic',
  network: 'sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'SONIC',
    symbol: 'SONIC',
  },
  rpcUrls: {
    public: { http: ['https://rpc.blaze.soniclabs.com'] },
    default: { http: ['https://rpc.blaze.soniclabs.com'] },
  }
} as const;
